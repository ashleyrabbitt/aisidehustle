import { workingSessionCta } from './sidehustleWorkingSession.js';
import { escapeHtml as e } from '../editorial/shared.mjs';
import { SIDEHUSTLE_CATALOG as catalog } from './catalog.mjs';

// Also embedded in the browser. Recommendations are transparent rules, not market forecasts.
export function rankHustles(items, preferences) {
  const levels = { beginner: 0, intermediate: 1, advanced: 2 };
  const level = levels[preferences.experience] ?? 0;
  const hours = Math.max(1, Math.min(80, Number(preferences.hours) || 5));
  const budget = Math.max(0, Math.min(10000, Number(preferences.budget) || 0));
  const stopWords = new Set(['and','for','with','the','some','using','work','skills','would','like','want','have','experience']);
  const words = String(preferences.skills || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  const range = value => (String(value).replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
  return items.map(item => {
    const time = range(item.timeCommitment), cost = range(item.startupCost);
    let minHours = time[0] ?? 999, maxHours = Math.max(...time, minHours);
    if (/minutes\/day/.test(item.timeCommitment)) { minHours *= 7 / 60; maxHours *= 7 / 60; }
    else if (/hours\/day/.test(item.timeCommitment)) { minHours *= 7; maxHours *= 7; }
    const reasons = [], tradeoffs = [];
    let score = 0;
    if (preferences.category && item.category === preferences.category) { score += 8; reasons.push('Matches your preferred type of work.'); }
    else if (preferences.category) { score -= 4; tradeoffs.push('A different type of work from your preference.'); }
    const haystack = [item.title, ...item.skills, item.description].join(' ').toLowerCase();
    const matched = [...new Set(words.filter(word => word.length > 2 && !stopWords.has(word) && haystack.includes(word)))];
    if (matched.length) { score += Math.min(matched.length, 3) * 4; reasons.push('Related to your skills: ' + matched.slice(0, 3).join(', ') + '.'); }
    if ((levels[item.difficulty] ?? 2) <= level) { score += 4; reasons.push('Within the experience level you selected.'); }
    else { score -= 9; tradeoffs.push('The template calls for ' + item.difficulty + ' experience; allow time to learn or narrow the scope.'); }
    if (maxHours <= hours) { score += 6; reasons.push('The full time estimate fits your weekly budget.'); }
    else if (minHours <= hours) { score += 1; tradeoffs.push('Only the lower end of the time estimate fits. Start with a smaller scope.'); }
    else { score -= 8; tradeoffs.push('The time estimate exceeds your weekly budget. Test a smaller task first.'); }
    if (/weekend/.test(item.timeCommitment)) tradeoffs.push('This template assumes a concentrated weekend; check whether you can reserve that time.');
    if (Math.max(...cost, 0) <= budget) { score += 5; reasons.push('The full setup estimate fits your budget.'); }
    else if ((cost[0] ?? 0) <= budget) { score += 1; tradeoffs.push('Only the low end of the setup estimate fits. Price the specific tools you need.'); }
    else { score -= 8; tradeoffs.push('The setup estimate exceeds your budget. Validate demand before spending.'); }
    return { item, score, reasons, tradeoffs };
  }).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, 3);
}

// Strictly template-based. No private values are sent to an AI service.
export function buildCustomerDraft(hustle, fields) {
  const clean = v => String(v || '').trim().slice(0, 600);
  const audience = clean(fields.audience), problem = clean(fields.problem), deliverable = clean(fields.deliverable);
  if (!audience || !problem || !deliverable) throw Error('Add your customer, their problem, and one small deliverable first.');
  const price = clean(fields.price) || '[agree a price and currency]';
  const turnaround = clean(fields.turnaround) || '[agree a delivery window]';
  const revisions = clean(fields.revisions) || '[agree a revision limit]';
  return {
    offer: `I help ${audience} with ${problem}. My first ${hustle.title.toLowerCase()} pilot includes ${deliverable}. Proposed price: ${price}. Delivery window: ${turnaround}. Revisions: ${revisions}. Confirm the required inputs and start date together. Additional deliverables need a separate agreement.`,
    sample: `Create one demonstration of ${deliverable} for a fictional ${audience} scenario focused on ${problem}.\n\nUse your own or permissioned materials. Show the starting problem, your finished output, and what you checked. Label it as a demonstration. Ask one intended customer what is useful or missing; record their actual response.\n\nAI prompt: Help me outline this small ${hustle.title} sample. Suggest a quality checklist and the inputs I need. Ask for missing information. Do not invent client results, testimonials, or demand. I will create and review the final sample.`,
    outreach: `Hi [name],\n\n[Add one specific, truthful reason this is relevant to them.]\n\nI'm exploring how to help ${audience} with ${problem}. My small pilot would include ${deliverable}. Would this be useful enough to discuss, or is there a different part of the problem that matters more?\n\nIf helpful, I can share a short demonstration. No worries if this is not a priority.\n\n[Your name]`,
    followup: `Hi [name], a brief follow-up on ${deliverable}. [Add a useful detail or answer a question they raised.] Is this something you would like to explore? If the timing is wrong, I will leave it here.\n\n[Your name]`,
  };
}

// Only allowlisted action names, catalog IDs, and integer step indexes leave the browser.
// Dedupe within a tab session. No cookie, user ID, form text, or automatic form tracking.
export function journeyEvent(event, hustle = '', step) {
  try {
    if (location.hostname !== 'aisidehustle.cc' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
    const names = ['directory_view', 'guide_view', 'match_completed', 'plan_started', 'step_completed', 'offer_drafted', 'prospect_added', 'first_customer', 'plan_downloaded'];
    if (!names.includes(event) || !/^[a-z0-9-]{0,90}$/.test(hustle)) return;
    const payload = { event, hustle };
    if (Number.isInteger(step) && step >= 0 && step < 7) payload.step = step;
    const marker = 'ash-event:' + JSON.stringify(payload);
    try { if (sessionStorage.getItem(marker)) return; } catch { /* Storage is optional. */ }
    if (navigator.sendBeacon?.('/api/sidehustle-events', new Blob([JSON.stringify(payload)], { type: 'application/json' }))) {
      try { sessionStorage.setItem(marker, '1'); } catch { /* Measurement never blocks work. */ }
    }
  } catch { /* Offline or blocked measurement never blocks work. */ }
}

export function matcherBrowser(rank, track) {
  const form = document.getElementById('match-form');
  const data = JSON.parse(document.getElementById('match-data').textContent);
  const result = document.getElementById('match-results');
  const status = document.getElementById('match-status');
  const node = (tag, text, cls) => { const n = document.createElement(tag); n.textContent = text; if (cls) n.className = cls; return n; };
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const prefs = Object.fromEntries(new FormData(form));
    const matches = rank(data, prefs);
    result.replaceChildren();
    for (const [i, { item, reasons, tradeoffs }] of matches.entries()) {
      const card = node('article', '', 'hustle-card');
      card.append(node('span', 'Option ' + (i + 1), 'hustle-tag'), node('h3', item.title), node('p', item.description));
      const dl = document.createElement('dl'); dl.className = 'match-facts';
      for (const [label, value] of [['Experience', item.difficulty], ['Weekly time estimate', item.timeCommitment], ['Setup estimate', item.startupCost]]) dl.append(node('dt', label), node('dd', value));
      card.append(dl, node('h4', 'Why it may fit'));
      const good = node('ul', ''); reasons.forEach(text => good.append(node('li', text))); card.append(good);
      card.append(node('h4', tradeoffs.length ? 'What to consider' : 'Before you commit'));
      const limits = node('ul', ''); (tradeoffs.length ? tradeoffs : ['Check your actual costs, delivery time, and customer demand with a small test.']).forEach(text => limits.append(node('li', text))); card.append(limits);
      const links = node('div', '', 'actions');
      const start = node('a', 'Build my first-customer plan →', 'btn'); start.href = '/start/' + item.id;
      start.addEventListener('click', () => {
        try { sessionStorage.setItem('ash-match-handoff', JSON.stringify({id:item.id,hours:prefs.hours})); } catch { /* User can enter it manually. */ }
      });
      const guide = node('a', 'Read the guide', 'card-link'); guide.href = '/side-hustles/' + item.id;
      links.append(start, guide); card.append(links); result.append(card);
    }
    document.getElementById('match-result-section').hidden = false;
    status.textContent = 'Three options to compare. Check the tradeoffs before choosing.';
    document.getElementById('match-result-heading').focus(); track('match_completed');
  });
  form.addEventListener('input', () => { if (!document.getElementById('match-result-section').hidden) { document.getElementById('match-result-section').hidden = true; status.textContent = 'Your answers changed. Match again to update your options.'; } });
  document.getElementById('match-fields').disabled = false;
}

export const JOURNEY_STYLES = `
.match-form{padding:28px;border:1px solid var(--line);border-radius:18px;background:var(--panel);max-width:900px}.match-form fieldset{border:0;padding:0;min-width:0}.match-form legend{font-size:24px;font-weight:800;margin-bottom:24px}.journey-fields{display:grid;grid-template-columns:1fr 1fr;gap:20px}.journey-fields .wide{grid-column:1/-1}.match-form .actions{margin-top:26px}.match-results{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:24px 0 60px}.match-results h3{font-size:23px;margin:12px 0}.match-results h4{margin:18px 0 6px}.match-results ul{padding-left:20px;color:#c1d0c8;font-size:14px;margin:4px 0 14px}.match-results li+li{margin-top:8px}.match-results .actions{margin-top:auto}.match-facts{width:100%;border-block:1px solid var(--line);padding:14px 0;margin:0}.match-facts dt{font-size:12px;color:var(--muted)}.match-facts dd{margin:0 0 10px;font-size:15px}.journey-section{margin:28px 0;padding:26px;border:1px solid var(--line);border-radius:14px;background:var(--panel);scroll-margin-top:20px}.journey-section h2{margin-top:0}.journey-section .journey-fields label{margin-top:0}.journey-section>label{margin:18px 0}.journey-section .small{margin-bottom:20px}.journey-section textarea{resize:vertical}.journey-section .actions{margin:16px 0}.journey-nav{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 28px}.journey-nav a{padding:8px 12px;border:1px solid var(--line);border-radius:30px;text-decoration:none;font-size:13px}.prospect-card{padding:20px 0;border-top:1px solid var(--line)}.prospect-card h3{font-size:18px;margin:0 0 16px;overflow-wrap:anywhere}.prospect-card label{margin-top:12px}.prospect-summary{display:flex;flex-wrap:wrap;gap:10px}.prospect-summary span{padding:8px 12px;border:1px solid #365747;border-radius:8px;font-size:13px}.hustle-page .plan-fields+.journey-section{margin-top:24px}.journey-section input[type=date]{min-width:0}.journey-status{min-height:24px;color:#8dd9b4;font-size:14px}.hustle-page .checklist strong{color:#6ee7b7;font-size:13px;display:block;margin-bottom:5px}.hustle-page .copy-area{min-height:150px}
@media(max-width:960px){.match-results{grid-template-columns:1fr}.match-results .hustle-card{display:block}.match-results .actions{margin-top:20px}.match-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.match-facts dd{margin:0}}@media(max-width:600px){.journey-fields{grid-template-columns:1fr}.journey-fields .wide{grid-column:auto}.match-form,.journey-section{padding:20px}.hustle-page .journey-nav a{font-size:12px}.hustle-page .actions .btn{max-width:100%;white-space:normal}.starter-shell{min-width:0}.starter-shell>div{min-width:0}}
`;

export function matcherBody(categories) {
  const data = catalog.map(({id,title,description,category,difficulty,timeCommitment,startupCost,skills}) => ({id,title,description,category,difficulty,timeCommitment,startupCost,skills}));
  return `<div class="wrap"><section class="hustle-hero"><div><p class="eyebrow">SIDE HUSTLE MATCHER</p><h1>Which side hustle fits your week?</h1><p class="lede">Find three side hustles to compare, with honest tradeoffs and a practical path to your first customer.</p><p class="small">Free · No account · About two minutes</p></div><aside class="hustle-note"><h2>How the match works</h2><ol><li>Tell us what you can bring.</li><li>Compare three starting points.</li><li>Make one small offer and test it.</li></ol></aside></section><nav class="decision-links" aria-label="Other ways to choose"><a href="/shortlist">Compare by customer access →</a><a href="/work-style">Explore my work style →</a></nav><form id="match-form" class="match-form"><fieldset id="match-fields" disabled><legend>What works for you right now?</legend><div class="journey-fields"><label class="wide">Skills you would like to use<input name="skills" maxlength="160" placeholder="For example: writing, research, design" required></label><label>Weekly hours available<select name="hours"><option value="3">3 hours</option><option value="5" selected>5 hours</option><option value="10">10 hours</option><option value="20">20 hours</option><option value="40">40 hours</option></select></label><label>Maximum setup budget (USD)<select name="budget"><option value="0">$0 — use what I have</option><option value="100" selected>Up to $100</option><option value="300">Up to $300</option><option value="1000">Up to $1,000</option></select></label><label>Experience in this kind of work<select name="experience"><option value="beginner">Beginner</option><option value="intermediate">Some experience</option><option value="advanced">Experienced</option></select></label><label>Preferred type of work<select name="category"><option value="">Open to different kinds</option>${Object.entries(categories).map(([id,title])=>`<option value="${e(id)}">${e(title)}</option>`).join('')}</select></label></div><div class="actions"><button type="submit" class="btn">Find my three starting points →</button><a href="/side-hustles">Browse all ideas</a></div></fieldset></form><p id="match-status" class="journey-status" role="status"></p><p class="small">Matches use the catalog’s skills, experience, and estimated costs and time. They are starting hypotheses, not verified demand or income predictions. When nothing fits every preference, we show the closest options and their tradeoffs. Answers stay in this page; we count the matching action without collecting your answers.</p><noscript><p>Enable JavaScript to get matches, or <a href="/side-hustles">compare all opportunities</a>.</p></noscript><section id="match-result-section" hidden aria-labelledby="match-result-heading"><h2 id="match-result-heading" tabindex="-1">Three possibilities. One small next step.</h2><div id="match-results" class="match-results"></div>${workingSessionCta("assessment_results")}</section></div><script type="application/json" id="match-data">${JSON.stringify(data).replace(/</g,'\\u003c')}</script><script>(${matcherBrowser.toString()})(${rankHustles.toString()},${journeyEvent.toString()});</script>`;
}

export function customerWorkspaceFields() {
  const field = (name, label, placeholder, rows = 0) => `<label>${label}${rows ? `<textarea rows="${rows}"` : '<input type="text"'} name="${name}" data-plan-field data-label="${label}" maxlength="${rows ? 5000 : 600}" placeholder="${e(placeholder)}">${rows ? '</textarea>' : ''}</label>`;
  return `<section class="journey-section" id="first-offer"><p class="eyebrow">MAKE SOMETHING SMALL AND USEFUL</p><h2>Shape your first offer</h2><p class="small">Choose a deliverable you can finish and review. Fill in the customer and problem above, then add the scope here.</p><div class="journey-fields">${field('deliverable','One small deliverable','For example: one article with an outline and one revision')}${field('price','Proposed price and currency','For example: $150 USD — validate with a buyer')}${field('turnaround','Delivery window','For example: 7 days after receiving the brief')}${field('revisions','Revision limit','For example: one round within the agreed scope')}</div><div class="actions"><button type="button" class="btn" id="draft-customer-kit">Draft my offer, sample & outreach</button></div><p id="draft-status" class="journey-status" role="status"></p><p class="small">This assembles editable templates from your answers. Review the draft before using it. Nothing is sent to customers or an AI service.</p><details id="draft-preview" hidden><summary>Review draft before applying</summary><pre class="prompt" id="draft-preview-text"></pre><button type="button" class="secondary" id="apply-customer-kit">Replace my offer and message drafts</button></details></section><section class="journey-section" id="sample"><h2>Make one useful sample</h2>${field('sample','My sample brief and AI prompt','Draft your kit above or write a small sample brief here.',7)}<button type="button" class="secondary" data-copy-field="sample">Copy sample brief</button></section><section class="journey-section" id="outreach"><h2>Start a real conversation</h2><p class="small">Personalize each message. Use a relevant, permitted channel and respect a request to stop.</p>${field('outreach','My first outreach message','Draft your kit above or write your message here.',7)}<button type="button" class="secondary" data-copy-field="outreach">Copy outreach</button>${field('followup','My follow-up message','One useful follow-up, when appropriate.',5)}<button type="button" class="secondary" data-copy-field="followup">Copy follow-up</button></section><section class="journey-section" id="prospects"><p class="eyebrow">SMALL CONVERSATIONS, USEFUL EVIDENCE</p><h2>Your first customer tracker</h2><p class="small">Use company names or aliases. Records stay in this browser and your exported backup. Up to 50 prospects per plan.</p><div id="prospect-summary" class="prospect-summary" role="status"></div><label style="margin-top:20px">Prospect or company alias<input id="prospect-name" maxlength="100" placeholder="For example: local bakery"></label><div class="actions"><button type="button" class="secondary" id="add-prospect">Add prospect</button></div><p id="prospect-status" class="journey-status" role="status"></p><div id="prospect-list"></div></section>`;
}
