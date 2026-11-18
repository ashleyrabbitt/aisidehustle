import { escapeHtml as e, shell, button } from '../editorial/shared.mjs';
import { playbooks, SIDEHUSTLE_CATALOG } from './catalog.mjs';
import { CATEGORIES, opportunityIndex, starterBody, savedPlansBody, OPPORTUNITY_STYLES } from './sidehustleOpportunities.js';
import { matcherBody } from './sidehustleJourney.js';
import { offerBuilderBody, OFFER_STYLES } from './sidehustleOfferBuilder.js';
import { workingSessionBody, SESSION_STYLES } from './sidehustleWorkingSession.js';
import { shortlistHustles, STARTING_SKILLS, CUSTOMER_ACCESS } from './shortlist.mjs';
import { questions, profiles, calculateSideHustleType } from './work-style.mjs';

const books = new Map(playbooks.map(t=>[t.id,t]));
const list = arr => arr?.length ? '<ul>'+arr.map(t=>'<li>'+e(t)+'</li>').join('')+'</ul>':'';
const details = (title,inside) => inside ? '<details class="book-fold"><summary>'+e(title)+'</summary><div>'+inside+'</div></details>':'';
const label = s => s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,s=>s.toUpperCase()).replace(/Ai /g,'AI ');
const sections = (arr,fn) => (arr||[]).map(fn).join('');
function formatField(value) {
  if (Array.isArray(value)) return value.length?'<ul>'+value.map(v=>'<li>'+formatField(v)+'</li>').join('')+'</ul>':'';
  if (value && typeof value==='object') return '<dl class="structured">'+Object.entries(value).filter(([,v])=>v!==''&&v!=null).map(([k,v])=>'<dt>'+e(label(k))+'</dt><dd>'+formatField(v)+'</dd>').join('')+'</dl>';
  return e(value);
}
const external = source => {
  try { const u=new URL(source.url); if (u.protocol==='https:' || u.protocol==='http:') return '<li><a href="'+e(u.href)+'">'+e(source.name)+' ↗</a></li>'; } catch {}
  return '<li>'+e(source.name)+'</li>';
};
function guide(t) {
  const r=t.resources||{}, audience=t.audience||{}, customers=t.customerPlan||{};
  const prompts=sections(r.aiPrompts,p=>details(p.task,'<pre data-prompt>'+e(p.prompt)+'</pre><button type="button" data-copy>Copy prompt</button><span class="copy-status" role="status"></span>'));
  const decisions=sections(r.decisionTrees,d=>details(d.question,sections(d.options,x=>`<h4>${e(x.choice)}</h4><p>${e(x.pickIf)}</p><p><b>Try this:</b> ${e(x.nextStep)}</p>`)));
  const phases=sections(t.phases,ph=>details(ph.name+(ph.duration?' · '+ph.duration:''),`<p>${e(ph.description)}</p><ol class="task-list">${sections(ph.tasks,task=>`<li><h4>${e(task.title)}</h4><p>${e(task.description)}</p><div class="task-meta">${task.aiAssisted?'AI-assisted · ':''}${task.estimatedHours!=null?e(task.estimatedHours)+'h estimate':''}</div>${task.deliverable?'<p><b>Deliverable:</b> '+e(task.deliverable)+'</p>':''}${task.tools?.length?'<p><b>Tools:</b> '+e(task.tools.join(', '))+'</p>':''}</li>`)}</ol>`));
  const group=(id,title,html)=>html?`<section id="${id}"><h2>${title}</h2>${html}</section>`:'';
  const related=playbooks.filter(x=>x.categoryId===t.categoryId&&x.id!==t.id).slice(0,3);
  const read=`<div class="ed-wrap"><a class="crumb" href="/side-hustles">← All side hustle ideas</a><div class="page-intro book-head"><span class="overline">${e(t.category)} · Playbook</span><h1>${e(t.title)}</h1><p>${e(t.description)}</p>${button('/start/'+t.id,'Start my plan')}</div><div class="book-grid"><aside class="note-box book-facts"><h2>At a glance</h2><dl>${[['Experience',t.difficulty],['Time per week',t.timeCommitment],['Setup budget',t.startupCost],['Time to start',t.timeToStart]].map(([k,v])=>'<dt>'+k+'</dt><dd>'+e(v)+'</dd>').join('')}</dl><p>Planning estimates. Time a small pilot and check actual tool prices before setting a budget.</p><a href="/assessment/side-hustle">Compare my fit →</a></aside><article class="read-body">
  ${group('first-customer','Who would buy this?',`<p>${e(audience.role||'Choose a buyer you can reach.')} ${e(audience.industry||'')}</p>${list(audience.painPoints)}<h3>Find your first customers</h3><p>${e(customers.launchStrategy)}</p>${list(customers.firstCustomerTactics)}${details('Channels and content ideas',list(customers.primaryChannels)+list(customers.contentIdeas))}${r.validationSources?.length?details('Sources to check for demand','<ul>'+r.validationSources.map(external).join('')+'</ul>'):''}`)}
  ${group('decisions','Decisions to make',decisions)}
  ${group('roadmap','Your launch roadmap','<p>Use the targets as planning examples. Open a phase to see its tasks, expected deliverables, and where AI can help.</p>'+list(t.steps)+phases)}
  ${group('ai','Working with AI',`<p><b>Skills</b> · ${e(t.skills.join(', '))}</p><p><b>Tools in the playbook</b> · ${e(t.tools.join(', '))}</p>${details('AI roles and first assignments',sections(r.recommendedAiTeam,p=>'<h4>'+e(label(p.personaId.replaceAll('-',' ')))+'</h4><p>'+e(p.firstTask)+'</p><p>'+e(p.why)+'</p>'))}${prompts}${details('Tool comparisons',sections(r.toolComparisons,c=>'<h4>'+e(c.category)+'</h4><p>'+e(c.recommendation)+'</p>'+list((c.options||[]).map(o=>o.name+' · '+o.bestFor))))}`)}
  ${group('delivery','Offers and delivery',details('Example offer packages',sections(t.offers,o=>'<h4>'+e(o.name)+' · '+e(o.price)+'</h4>'+list(o.features)))+details('Launch checklist',sections(r.launchReadinessChecklist?.toolsAndSubscriptions,x=>'<h4>'+e(x.item)+'</h4><p>'+e(x.why)+'</p>'))+details('Example product or service specification',r.productScaffold?formatField(r.productScaffold):''))}
  ${group('practice','What to watch for',[[r.whatItTakes,'What the work takes'],[r.whereTheyFail,'Where the work breaks down'],[r.theDip,'When momentum slows']].map(([v,k])=>v?details(k,'<p>'+e(v)+'</p>'):'').join('')+details('Example weekly routine',sections(r.routine,x=>'<p><b>'+e(x.when)+'</b> · '+e(x.what)+'</p>'))+details('Common mistakes',sections(r.commonMistakes,x=>'<h4>'+e(x.mistake)+'</h4><p>'+e(x.why)+'</p><p>'+e(x.prevention)+'</p>')))}
  <section><h2>Try one offer this week</h2><p>Choose one deliverable. Record the hours, expenses and buyer response in your plan.</p>${button('/start/'+t.id,'Open my starter plan')}${related.length?'<h3>Related playbooks</h3><ul>'+related.map(x=>'<li><a href="/side-hustles/'+x.id+'">'+e(x.title)+'</a></li>').join('')+'</ul>':''}</section></article></div></div>`;
  return shell('/side-hustles/'+t.id,t.title+' side hustle playbook',t.description,read);
}
const options=(values,selected)=>values.map(({value,label})=>`<option value="${e(value)}"${value===selected?' selected':''}>${e(label)}</option>`).join('');
const pairs = values => values.map(([value,label])=>({value,label}));
function shortlist(params) {
  const fields=[
    ['startingSkill','Which skill do you want to use?',STARTING_SKILLS],['customerAccess','Who can you reach?',CUSTOMER_ACCESS],
    ['weeklyTime','Weekly time',pairs([['under-5','Up to 5 hours'],['5-10','5–10 hours'],['10-20','10–20 hours'],['20-plus','20+ hours']])],
    ['budget','Setup budget',pairs([['under-200','Up to $200'],['200-1000','Up to $1,000'],['1000-plus','Flexible']])],
    ['personality','Preferred work',pairs([['creative','Creative'],['analytical','Analytical'],['independent','Independent'],['social','Social']])]
  ];
  const answers=Object.fromEntries(fields.flatMap(([key,,opts])=>opts.some(o=>o.value===params.get(key))?[[key,params.get(key)]]:[]));
  const results=Object.keys(answers).length?shortlistHustles(playbooks,answers):null;
  const body=`<div class="ed-wrap editorial-section"><a class="crumb" href="/assessment/side-hustle">← Side hustle matcher</a><div class="page-intro"><h1>Build your shortlist</h1><p>Start with the buyers you can reach and the work you want to do. Compare three ideas and the question to ask before choosing.</p></div><form class="choice-form" action="/shortlist#results"><div class="calc-grid">${fields.map(([k,t,opts])=>`<label>${t}<select name="${k}"><option value="">Any</option>${options(opts,answers[k])}</select></label>`).join('')}</div><button class="ed-button solid">Compare ideas →</button></form><section id="results">${results?`<h2>Your shortlist</h2>${results.droppedFilters.length?'<p>We broadened these preferences to find options: '+results.droppedFilters.map(k=>e(fields.find(f=>f[0]===k)[1])).join(', ')+'.</p>':''}<div class="pick-grid">${results.picks.map(({template:t,reason,question})=>`<article class="note-box"><span class="overline">${e(t.category)}</span><h3><a href="/side-hustles/${t.id}">${e(t.title)}</a></h3><p>${e(reason)}</p><p>${e(question)}</p><p>${e(t.timeCommitment)} · ${e(t.startupCost)}</p><a href="/start/${t.id}">Test this idea →</a></article>`).join('')}</div>`:''}</section></div>`;
  return shell('/shortlist','Build your side hustle shortlist','Compare ideas by starting skill, customer access, available time, setup budget and work preferences.',body);
}
function workStyle() {
  const init = (profiles,score) => {
    const form=document.querySelector('#workstyle-form'), out=document.querySelector('#workstyle-result');
    form.addEventListener('submit',ev=>{
      ev.preventDefault(); const type=score(Object.fromEntries(new FormData(form))), profile=profiles[type];
      const title=document.createElement('h2'), summary=document.createElement('p'), link=document.createElement('a');
      title.textContent=profile.title; summary.textContent=profile.description+' Examples: '+profile.examples+'.';
      link.href='/side-hustles?type='+type;link.textContent='Browse ideas for this work style →';
      out.replaceChildren(title,summary,link);out.hidden=false;out.focus();
    });
    form.addEventListener('input',()=>{out.hidden=true;});
  };
  const body=`<div class="ed-wrap editorial-section"><a class="crumb" href="/assessment/side-hustle">← Side hustle matcher</a><div class="page-intro"><h1>What kind of work suits you?</h1><p>Answer ten questions about how you prefer to earn and work. Use the result as a starting point for comparing ideas.</p></div><form class="choice-form" id="workstyle-form">${questions.map(q=>`<fieldset><legend>${e(q.question)}</legend>${q.options.map(o=>`<label><input required type="radio" name="${e(q.id)}" value="${e(o.value)}"> ${e(o.label)}</label>`).join('')}</fieldset>`).join('')}<button class="ed-button solid">See my work style →</button></form><div class="note-box" id="workstyle-result" tabindex="-1" hidden aria-live="polite"></div><noscript><p><a href="/shortlist">Use the shortlist without JavaScript</a>.</p></noscript></div><script>(${init.toString()})(${JSON.stringify(profiles)},${calculateSideHustleType.toString()});</script>`;
  return shell('/work-style','Side hustle work style','Explore four ways to work through ten short preference questions.',body);
}
export const decisionPaths = ['/working-session','/side-hustles','/assessment/side-hustle','/my-side-hustles','/tools/first-offer','/shortlist','/work-style',...playbooks.flatMap(t=>['/side-hustles/'+t.id,'/start/'+t.id])];
export function decisionPage(path,params) {
  if(path==='/shortlist')return shortlist(params);
  if(path==='/work-style')return workStyle();
  const id=path.split('/')[2], book=books.get(id);
  if(path.startsWith('/side-hustles/')&&book)return guide(book);
  const opt={workspace:true,style:OPPORTUNITY_STYLES};
  let title,description,body;
  if(path==='/working-session'){title='Side hustle working session with Ashley';description='Scope and test an AI-assisted offer with Ashley.';body=workingSessionBody();opt.style+=SESSION_STYLES;}
  else if(path==='/side-hustles'){title='Side hustle idea directory';description='Compare 77 ideas by skill, cost, experience and weekly hours.';body=opportunityIndex();}
  else if(path==='/assessment/side-hustle'){title='Find a side hustle that fits';description='Compare three ideas with reasons and tradeoffs.';body=matcherBody(CATEGORIES);}
  else if(path==='/my-side-hustles'){title='My saved side hustle plans';description='Reopen, download or restore your saved local plans.';body=savedPlansBody();}
  else if(path==='/tools/first-offer'){title='Build your first AI-assisted offer';description='Prepare an offer, sample and follow-up.';body=offerBuilderBody(SIDEHUSTLE_CATALOG.find(x=>x.id===params.get('hustle')));opt.style+=OFFER_STYLES;}
  else if(path.startsWith('/start/')&&book){title=book.title+' starter plan';description='Create and save your first-customer plan.';body=starterBody(id);}
  else return null;
  return shell(path,title,description,body,'hero',opt);
}
