// Supabase rows are per plan. The saved baseline tells a remote edit from a local one.
export function syncAction(local, remote, base) {
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (!local) return remote ? 'pull' : 'skip';
  if (!remote) return base ? 'conflict' : 'insert';
  if (same(local, remote.content)) return 'ack';
  if (base && same(local, base.content)) return 'pull';
  if (base && base.revision === remote.revision) return 'update';
  return 'conflict';
}

export async function startPlanSync(config, startWorkspace) {
  const byId = id => document.getElementById(id);
  const say = message => { byId('cloud-status').textContent = message; };
  let db, session;
  try {
    db = window.supabase.createClient(config.url, config.key, {
      auth: { storage: sessionStorage, storageKey: 'ash-account-' + new URL(config.url).hostname,
        detectSessionInUrl: false, persistSession: true }
    });
    const current = await db.auth.getSession();
    if (current.error) throw current.error;
    session = current.data.session;
  } catch {
    startWorkspace();
    byId('cloud-email').hidden = true;
    say('Account access is unavailable in this tab. Browser plans and downloads are available.');
    return;
  }
  const owner = session?.user.id;
  const workspace = startWorkspace(owner);
  byId('cloud-email').hidden = Boolean(owner);
  byId('cloud-actions').hidden = !owner;
  byId('cloud-identity').textContent = owner ? 'Signed in as ' + session.user.email :
    'Sign in by email to sync your plans. You choose whether to copy existing browser plans.';
  async function submit(form, action) {
    const button = form.querySelector('button');
    button.disabled = true;
    try { await action(); } catch { say('That request could not be completed. Check your connection and try again.'); }
    finally { button.disabled = false; }
  }
  if (!owner) {
    const emailForm = byId('cloud-email'), codeForm = byId('cloud-code');
    let email = '';
    emailForm.onsubmit = event => {
      event.preventDefault();
      submit(emailForm, async () => {
        const address = emailForm.elements.email.value.trim();
        const { error } = await db.auth.signInWithOtp({ email: address });
        if (error) { say('The code could not be sent. Check your email address or wait a minute and retry.'); return; }
        email = address;
        codeForm.hidden = false;
        say('Enter the code sent to ' + email + '.');
        codeForm.elements.code.focus();
      });
    };
    codeForm.onsubmit = event => {
      event.preventDefault();
      submit(codeForm, async () => {
        const { data, error } = await db.auth.verifyOtp({ email, token: codeForm.elements.code.value.trim(), type: 'email' });
        if (error || !data.session) { say('That code was invalid or expired. Request a new code.'); return; }
        location.reload();
      });
    };
    return;
  }
  const baseKey = 'ash-sync-base-v1:' + owner;
  const baselines = JSON.parse(sessionStorage.getItem(baseKey) || '{}');
  const conflicts = new Map();
  const table = () => db.from('saved_plans');
  const acknowledge = (id, row) => {
    baselines[id] = row;
    sessionStorage.setItem(baseKey, JSON.stringify(baselines));
  };
  let active = false, queued = false, timer;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(sync, 500);
  }
  function conflictControls() {
    const container = byId('cloud-conflicts');
    container.replaceChildren();
    for (const [id, row] of conflicts) {
      const item = document.createElement('div');
      const title = document.createElement('p');
      title.textContent = workspace.title(id) + ' has two versions. Download a backup to keep a copy before choosing.';
      item.append(title);
      for (const choice of ['Keep this tab’s version', 'Use the account version']) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'secondary'; button.textContent = choice;
        button.onclick = () => {
          if (choice === 'Use the account version' && row) workspace.apply(id, row.content);
          if (row) acknowledge(id, row);
          else { delete baselines[id]; sessionStorage.setItem(baseKey, JSON.stringify(baselines)); }
          conflicts.delete(id); conflictControls(); schedule();
        };
        if (!row && choice === 'Use the account version') continue;
        item.append(button);
      }
      container.append(item);
    }
  }
  async function sync() {
    if (active) { queued = true; return; }
    active = true;
    try {
      const result = await table().select('plan_id,revision,content').eq('owner_id',owner);
      if (result.error) throw result.error;
      const remote = new Map();
      for (const row of result.data) {
        const content = workspace.cleanPlan(row.plan_id, row.content);
        if (content) remote.set(row.plan_id, {content, revision:row.revision});
      }
      conflicts.clear();
      for (const id of new Set([...workspace.ids(), ...remote.keys()])) {
        const local = workspace.get(id), row = remote.get(id);
        switch (syncAction(local, row, baselines[id])) {
          case 'pull': workspace.apply(id,row.content); acknowledge(id,row); break;
          case 'ack': acknowledge(id,row); break;
          case 'conflict': conflicts.set(id,row); break;
          case 'insert':
          case 'update': {
            const write = row
              ? table().update({content:local,revision:crypto.randomUUID()}).eq('owner_id',owner).eq('plan_id',id).eq('revision',row.revision)
              : table().insert({plan_id:id,content:local});
            const saved = await write.select('revision').maybeSingle();
            if (saved.error && saved.error.code !== '23505') throw saved.error;
            if (!saved.data) queued = true;
            else acknowledge(id,{revision:saved.data.revision, content:local});
            break;
          }
        }
      }
      conflictControls();
      say(conflicts.size ? 'Choose which version to keep for the plans below.' : 'Your plans are synced.');
    } catch { say('Sync paused. This tab keeps your edits. Try syncing again or download a backup before closing it.'); }
    finally { active = false; if (queued) { queued = false; schedule(); } }
  }
  workspace.onChange(schedule);
  byId('cloud-import').onclick = () => {
    let count;
    try { count = workspace.importGuest(); } catch { say('Browser plans could not be read. You can restore a downloaded backup instead.'); return; }
    say(count ? 'Copied ' + count + ' browser plans. Syncing now.' : 'There are no new browser plans to copy. Existing versions were kept.');
    if (count) schedule();
  };
  byId('cloud-retry').onclick = sync;
  byId('cloud-logout').onclick = async () => {
    if (active) { say('A sync is in progress. Try signing out when it finishes.'); return; }
    clearTimeout(timer);
    if (workspace.ids().some(id => JSON.stringify(workspace.get(id)) !== JSON.stringify(baselines[id]?.content)) &&
        !window.confirm('Some changes have not synced. Sign out and leave these edits in this tab for your next sign-in?')) { schedule(); return; }
    const {error} = await db.auth.signOut({scope:'local'});
    if (error) { say('Sign-out could not be completed. Try again.'); return; }
    location.reload();
  };
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  await sync();
}
