// Private work stays local; track only accepts predefined action metadata.
export function workspaceBrowser(createDraft = () => null, track = () => {}) {
  const data = JSON.parse(document.getElementById('hustle-data').textContent);
  const key = 'aisidehustle-workspace-v1';
  const status = document.getElementById('workspace-status');
  const say = text => { if (status) status.textContent = text; };
  const clean = raw => {
    const result = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
    for (const item of data.catalog) {
      const plan = raw[item.id];
      if (!plan || typeof plan !== 'object') continue;
      const fields = {};
      for (const name of ['audience', 'problem', 'offer', 'hours', 'notes', 'deliverable', 'price', 'turnaround', 'revisions', 'sample', 'outreach', 'followup']) {
        fields[name] = typeof plan.fields?.[name] === 'string' ? plan.fields[name].slice(0, ['notes','offer','sample','outreach','followup'].includes(name) ? 5000 : 600) : '';
      }
      const prospects = Array.isArray(plan.prospects) ? plan.prospects.slice(0,50).filter(p=>p && typeof p.name==='string').map(p=>({
        name:p.name.slice(0,100),
        stage:['identified','contacted','replied','offer','won','closed'].includes(p.stage)?p.stage:'identified',
        channel:['Undecided','Referral','Email','LinkedIn','Community','Marketplace','In person','Other'].includes(p.channel)?p.channel:'Undecided',
        followup:typeof p.followup==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(p.followup)?p.followup:'',
        note:typeof p.note==='string'?p.note.slice(0,500):'',
      })) : [];
      result[item.id] = { fields, prospects, done: Array.isArray(plan.done) ? [...new Set(plan.done.filter(n => Number.isInteger(n) && n >= 0 && n < 7))] : [] };
    }
    return result;
  };
  let plans = {};
  try { plans = clean(JSON.parse(localStorage.getItem(key) || '{}')); }
  catch { say('Saved plans could not be read. You can still work and download a backup.'); }
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(plans)); say('Saved on this browser. Download a backup to keep a copy.'); return true; }
    catch { say('Browser storage is unavailable or full. Download a backup before leaving.'); return false; }
  };
  const download = (name, text, type = 'text/plain') => {
    const url = URL.createObjectURL(new Blob([text], {type}));
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const cards = [...document.querySelectorAll('[data-hustle-card]')];
  const search = document.getElementById('hustle-search');
  if (search) {
    track('directory_view');
    const category = document.getElementById('hustle-category');
    const difficulty = document.getElementById('hustle-difficulty');
    const time = document.getElementById('hustle-time');
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || params.get('skill') || '';
    const setOption = (el, value) => { if ([...el.options].some(o => o.value === value)) el.value = value; };
    setOption(category, params.get('category') || ({creator:'content',consultant:'consulting',builder:'tech',connector:'marketing'}[params.get('type')]) || '');
    setOption(difficulty, params.get('difficulty') || '');
    setOption(time, params.get('time') || '');
    let limit = 12;
    const more = document.getElementById('hustle-more');
    const filter = (update = false) => {
      const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const matches = cards.filter(c => words.every(w => c.dataset.search.includes(w)) && (!category.value || c.dataset.category === category.value) && (!difficulty.value || c.dataset.difficulty === difficulty.value) && (!time.value || Number(c.dataset.hours) <= Number(time.value)));
      cards.forEach(c => c.hidden = true);
      matches.slice(0, limit).forEach(c => c.hidden = false);
      document.getElementById('hustle-count').textContent = matches.length ? 'Showing '+Math.min(limit,matches.length)+' of '+matches.length+' matching opportunities' : 'No matches. Try a broader search or clear the filters.';
      more.hidden = matches.length <= limit;
      if (update) {
        const next = new URLSearchParams();
        for (const [k,v] of [['q',search.value.trim()],['category',category.value],['difficulty',difficulty.value],['time',time.value]]) if (v) next.set(k,v);
        history.replaceState(null,'',location.pathname+(next.size ? '?'+next : '')+location.hash);
      }
    };
    const update = () => { limit = 12; filter(true); };
    search.addEventListener('input', update);
    for (const el of [category,difficulty,time]) el.addEventListener('change', update);
    document.getElementById('hustle-clear').addEventListener('click', () => { search.value='';category.value='';difficulty.value='';time.value='';update();search.focus(); });
    more.addEventListener('click', () => { const previous=limit;limit+=12;filter(); const shown=cards.filter(c=>!c.hidden);shown[previous]?.querySelector('a')?.focus(); });
    filter();
    document.getElementById('hustle-filters').hidden = false;
  }
  const form = document.getElementById('starter-form');
  if (data.page === 'guide') track('guide_view',data.hustle.id);
  let capturePlan = null;
  if (form) {
    const id = data.hustle.id;
    const fields = [...form.querySelectorAll('[data-plan-field]')];
    const checks = [...form.querySelectorAll('[data-step]')];
    const prior = plans[id];
    let prospects = prior?.prospects || [];
    fields.forEach(el => { el.value = prior ? prior.fields[el.name] || '' : data.defaults[el.name] || ''; });
    checks.forEach(el => el.checked = prior?.done.includes(Number(el.dataset.step)) || false);
    if (!prior) {
      try { const handoff=JSON.parse(sessionStorage.getItem('ash-match-handoff')||'null'); if(handoff?.id===id && ['3','5','10','20','40'].includes(handoff.hours)) { form.elements.namedItem('hours').value=handoff.hours+' hours'; sessionStorage.removeItem('ash-match-handoff'); } } catch { /* Optional handoff. */ }
    }
    const progress = () => {
      const n = checks.filter(c=>c.checked).length;
      document.getElementById('plan-progress').value = n;
      document.getElementById('plan-progress-label').textContent = n+' of 7 steps complete';
    };
    const snapshot = () => ({fields:Object.fromEntries(fields.map(el=>[el.name,el.value])),done:checks.filter(c=>c.checked).map(c=>Number(c.dataset.step)),prospects});
    capturePlan = () => { plans[id]=snapshot(); };
    const persist = () => { const isNew=!plans[id];capturePlan();save();progress();if(isNew)track('plan_started',id); };
    checks.forEach(el=>el.addEventListener('change',()=>{if(el.checked)track('step_completed',id,Number(el.dataset.step));}));
    form.addEventListener('input',persist);
    form.addEventListener('submit',event=>event.preventDefault());
    document.getElementById('save-plan').addEventListener('click',persist);
    document.getElementById('download-plan').addEventListener('click',()=>{
      const p=snapshot();
      const lines=['# '+data.hustle.title+' — my first-customer plan','https://aisidehustle.cc/side-hustles/'+id,'',...fields.map(el=>el.dataset.label+': '+p.fields[el.name]),'',...checks.map((el,i)=>(el.checked?'[x] ':'[ ] ')+data.steps[i].title+'\n'+data.steps[i].text),'','PROSPECTS',...prospects.map(p=>p.name+' | '+p.stage+' | '+p.channel+' | Follow up: '+p.followup+'\n'+p.note)];
      download(id+'-starter-plan.pdf',lines.join('\n\n'));
      track('plan_downloaded',id);
      say('Starter plan downloaded.');
    });
    const kitButton=document.getElementById('draft-customer-kit');
    let pendingDraft=null;
    const applyDraft=()=>{
      if(!pendingDraft)return;
      for(const [name,value] of Object.entries(pendingDraft))form.elements.namedItem(name).value=value;
      pendingDraft=null;document.getElementById('draft-preview').hidden=true;persist();track('offer_drafted',id);
      document.getElementById('draft-status').textContent='Your offer, sample brief, and outreach are ready to edit. Check every placeholder before using them.';
    };
    kitButton?.addEventListener('click',()=>{
      try {
        pendingDraft=createDraft(data.hustle,snapshot().fields);if(!pendingDraft)return;
        if(Object.keys(pendingDraft).some(name=>form.elements.namedItem(name).value.trim())) {
          const preview=document.getElementById('draft-preview');preview.hidden=false;preview.open=true;
          document.getElementById('draft-preview-text').textContent=Object.entries(pendingDraft).map(([k,v])=>k.toUpperCase()+'\n'+v).join('\n\n');
          document.getElementById('draft-status').textContent='You already have draft text. Review this version, then apply it if you want to replace those four fields.';
        } else applyDraft();
      } catch(error){document.getElementById('draft-status').textContent=error.message;}
    });
    document.getElementById('apply-customer-kit')?.addEventListener('click',applyDraft);
    try {
      const handoff=JSON.parse(sessionStorage.getItem('ash-offer-handoff')||'null');
      if(handoff?.id===id && typeof handoff.offer==='string' && typeof handoff.sample==='string'){
        pendingDraft={offer:handoff.offer.slice(0,5000),sample:handoff.sample.slice(0,5000)};
        const preview=document.getElementById('draft-preview');preview.hidden=false;preview.open=true;
        document.getElementById('draft-preview-text').textContent='OFFER\n'+pendingDraft.offer+'\n\nSAMPLE\n'+pendingDraft.sample;
        document.getElementById('draft-status').textContent='Your detailed planner draft is ready. Review it before replacing your saved offer and sample.';
        document.getElementById('apply-customer-kit').textContent='Replace my offer and sample';
        sessionStorage.removeItem('ash-offer-handoff');
      }
    } catch { /* Existing work remains available if a handoff cannot be read. */ }
    // An edited brief invalidates a pending replacement, so it cannot silently apply stale text.
    form.addEventListener('input',event=>{if(event.target.matches('[data-plan-field]')&&pendingDraft){pendingDraft=null;document.getElementById('draft-preview').hidden=true;document.getElementById('draft-status').textContent='Your brief changed. Draft the kit again to update it.';}});
    document.querySelectorAll('[data-copy-field]').forEach(button=>button.addEventListener('click',async()=>{
      const input=form.elements.namedItem(button.dataset.copyField);
      try {await navigator.clipboard.writeText(input.value);say('Copied. Personalize and review before sharing.');}
      catch {input.focus();input.select();say('Select and copy the highlighted text.');}
    }));
    const prospectList=document.getElementById('prospect-list');
    const stageNames={identified:'To contact',contacted:'Contacted',replied:'Replied',offer:'Offer sent',won:'Paid customer',closed:'Closed / not a fit'};
    const element=(tag,text)=>{const node=document.createElement(tag);node.textContent=text||'';return node;};
    const renderSummary=()=>{
      const summary=document.getElementById('prospect-summary');if(!summary)return;
      summary.replaceChildren();
      for(const stage of Object.keys(stageNames)){const n=prospects.filter(p=>p.stage===stage).length;summary.append(element('span',n+' '+stageNames[stage].toLowerCase()));}
    };
    const renderProspects=()=>{
      if(!prospectList)return;prospectList.replaceChildren();renderSummary();
      if(!prospects.length){prospectList.append(element('p','Add one person or business whose problem you want to understand.'));return;}
      prospects.forEach((prospect,index)=>{
        const card=element('div');card.className='prospect-card';card.append(element('h3',prospect.name));
        const grid=element('div');grid.className='journey-fields';
        for(const [key,label,options] of [['stage','Stage',stageNames],['channel','Channel',Object.fromEntries(['Undecided','Referral','Email','LinkedIn','Community','Marketplace','In person','Other'].map(s=>[s,s]))]]){
          const wrapper=element('label',label+' for '+prospect.name);const select=element('select');
          for(const [value,text] of Object.entries(options)){const option=element('option',text);option.value=value;select.append(option);}select.value=prospect[key];
          select.addEventListener('change',()=>{prospect[key]=select.value;persist();renderSummary();if(key==='stage'&&select.value==='won')track('first_customer',id);});wrapper.append(select);grid.append(wrapper);
        }
        const follow=element('label','Follow-up date for '+prospect.name);const date=element('input');date.type='date';date.value=prospect.followup;date.addEventListener('input',()=>{prospect.followup=date.value;persist();});follow.append(date);grid.append(follow);card.append(grid);
        const label=element('label','Evidence / next action for '+prospect.name);const note=element('textarea');note.rows=2;note.maxLength=500;note.value=prospect.note;note.addEventListener('input',()=>{prospect.note=note.value;persist();});label.append(note);card.append(label);
        const remove=element('button','Remove '+prospect.name);remove.type='button';remove.className='hustle-clear';remove.addEventListener('click',()=>{const removed=prospects.splice(index,1)[0];persist();renderProspects();const undo=element('button','Undo removal');undo.type='button';undo.className='hustle-clear';undo.addEventListener('click',()=>{if(prospects.length>=50)return;prospects.splice(index,0,removed);persist();renderProspects();document.getElementById('prospect-status').textContent='Prospect restored.';});const message=document.getElementById('prospect-status');message.replaceChildren(document.createTextNode('Prospect removed. '),undo);undo.focus();});card.append(remove);prospectList.append(card);
      });
    };
    document.getElementById('add-prospect')?.addEventListener('click',()=>{
      const input=document.getElementById('prospect-name'),message=document.getElementById('prospect-status');const name=input.value.trim();
      if(!name){message.textContent='Add a company name or alias first.';input.focus();return;}
      if(prospects.length>=50){message.textContent='This plan has 50 prospects. Remove an old entry before adding another.';return;}
      prospects.push({name:name.slice(0,100),stage:'identified',channel:'Undecided',followup:'',note:''});input.value='';persist();renderProspects();track('prospect_added',id);message.textContent='Prospect added. Choose a channel and a next action.';input.focus();
    });
    renderProspects();
    progress();
    document.getElementById('starter-fields').disabled = false;
    if (prior) say('Your saved plan is restored from this browser.');
  }
  const savedList = document.getElementById('saved-plans');
  const renderSaved = () => {
    if (!savedList) return;
    savedList.replaceChildren();
    const entries = data.catalog.filter(item=>plans[item.id]);
    document.getElementById('saved-empty').hidden = entries.length > 0;
    for (const item of entries) {
      const li=document.createElement('li');li.className='hustle-card';
      const title=document.createElement('h2');const a=document.createElement('a');a.href='/start/'+item.id;a.textContent=item.title;title.append(a);
      const p=document.createElement('p');p.textContent=plans[item.id].done.length+' of 7 steps complete · '+plans[item.id].prospects.length+' prospects · '+plans[item.id].prospects.filter(p=>p.stage==='won').length+' paid customers recorded';
      const open=document.createElement('a');open.href='/start/'+item.id;open.className='btn';open.textContent='Continue your plan →';
      li.append(title,p,open);savedList.append(li);
    }
  };
  renderSaved();
  const backup = document.getElementById('backup-plans');
  if (backup) {
    backup.disabled=false;
    backup.addEventListener('click',()=>{capturePlan?.();download('ai-side-hustle-backup.json',JSON.stringify({version:1,plans},null,2),'application/json');say('Backup downloaded. Restore it from My plans on another browser.');});
  }
  const restore = document.getElementById('restore-plans');
  if (restore) {
    restore.disabled=false;
    restore.addEventListener('change',async()=>{
      try {
        const file=restore.files[0];if(!file)return;
        if(file.size>8000000)throw Error('Choose a backup smaller than 8 MB.');
        const raw=JSON.parse(await file.text());
        if(raw.version!==1 || !raw.plans || typeof raw.plans!=='object')throw Error('This is not an AI Side Hustle backup.');
        const imported=clean(raw.plans);const count=Object.keys(imported).length;
        if(!count)throw Error('No recognized plans were found in this backup.');
        // Existing local work wins: importing never overwrites a newer local plan.
        const added=Object.keys(imported).filter(id=>!plans[id]).length;
        plans={...imported,...plans};const stored=save();renderSaved();
        say(added+' plan(s) restored. Existing plans were kept.'+(stored?'':' Browser storage is unavailable; download a backup.'));
      } catch(error) { say(error instanceof SyntaxError?'This file is not valid JSON. Choose an exported backup.':error.message); }
      restore.value='';
    });
  }
}
