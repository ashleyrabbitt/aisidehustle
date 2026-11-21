import { articles, reviews } from './stories.mjs';
import { escapeHtml as e, button, shell } from './shared.mjs';
import { newsletter } from '../content.mjs';

export { articles, reviews };
const art = {
  'affiliate-marketing-with-ai':['testing','Two microphones and test notes on a mint worktable','affiliate-marketing','amazon-associates'],
  'build-a-small-game':['games','A game designer testing a pixel-art platformer','indie-game-dev','roblox-devex'],
  'get-paid-for-clipping':['studio','A video editor working at a home studio','ai-video-production','content-rewards'],
  'faceless-video-channel':['studio','A video editing station with a microphone','faceless-youtube-channel','youtube-partner-program'],
  'sell-a-content-package':['hero','A creator setting up a product shoot','ai-content-agency'],
  'measure-ai-time-savings':['market','A market seller checking a restock worksheet','automation-consultant'],
  'test-a-digital-product':['florist','A florist working through a quote brief','etsy-digital-downloads','monetise']
};
const storyUrl = s => '/guides/'+s.slug;
const reviewUrl = r => '/program-reviews/'+r.slug;
const photo = (name,alt,priority=false) => `<img src="/studio-assets/${name}.webp" alt="${e(alt)}" width="${priority?1344:900}" height="${priority?896:600}" ${priority?'fetchpriority="high"':'loading="lazy"'}>`;
const featured = [articles[0],articles[1],articles[2]];
const arrow = '<span aria-hidden="true">↗</span>';
const flag = name => '<span class="overline">'+e(name)+'</span>';
const guideCard = s => `<article class="story-card"><a href="${storyUrl(s)}"><div class="story-photo">${photo(...art[s.slug].slice(0,2))}</div><div class="story-copy">${flag(s.category)}<h3>${e(s.title)}</h3><p>${e(s.description)}</p></div></a></article>`;
const reviewRow = r => `<a class="review-row" href="${reviewUrl(r)}"><div><h3>${e(r.name)}</h3><p>${e(r.verdict)}</p></div>${arrow}</a>`;
const sources = s => `<section class="source-list"><h2>Sources</h2><ul>${s.map(x=>`<li><a href="${e(x.url)}">${e(x.label)} ↗</a></li>`).join('')}</ul></section>`;
const date = '<time datetime="2026-11-18">November 18, 2026</time>';
export function homePage() {
  const body=`<section class="ed-hero field-cover"><div class="ed-wrap hero-grid"><div class="cover-copy"><h1>Find a side hustle <em>you can test this week.</em></h1><p>Choose a task you know, make a small sample with AI, and put it in front of someone who could pay for it.</p><div class="hero-actions">${button('/assessment/side-hustle','Find my side hustle')}<a class="under-link" href="https://wealthexperiment.live/agent-side-hustle/#workshop">The Agent-Powered Side Hustle · $149</a></div></div><figure class="cover-image">${photo('hero','An independent maker photographing handmade pottery in her studio',true)}</figure></div></section>
  <nav class="topic-bar" aria-label="Browse by topic"><div class="ed-wrap"><a class="all-ideas" href="/side-hustles">All 77 ideas →</a>${[0,1,2,4,3,6].map(i=>`<a href="${storyUrl(articles[i])}">${e(articles[i].category)}</a>`).join('')}</div></nav>
  <section class="ed-wrap editorial-section"><div class="section-title"><h2>The latest guides</h2><a href="/guides">All guides →</a></div><div class="story-grid">${featured.map(guideCard).join('')}</div></section>
  <section class="pp-feature"><div class="ed-wrap"><img src="/studio-assets/bakery-preorders.webp" width="1180" height="787" loading="lazy" alt="Bread parcels and a handwritten preorder sheet at a small bakery"><div>${flag('Pocket product workshop')}<h2>Turn a pickup list into a product.</h2><p>See how one recurring bakery task becomes a spreadsheet. Try the batch calculation, download the file, then test an idea from your own field.</p>${button('/field-guide/pocket-product-workshop','Open the workshop')}</div></div></section>
  <section class="review-band"><div class="ed-wrap review-split"><div>${flag('Program reviews')}<h2>Which programs are worth your time?</h2><p>See who gets paid, which results are public, and what to test before you commit time or money.</p>${button('/program-reviews','Compare programs','outline')}</div><div class="review-links">${['roblox-devex','content-rewards','monetise'].map(id=>reviewRow(reviews.find(r=>r.slug===id))).join('')}</div></div></section>
  <section class="ed-wrap editorial-section"><div class="section-title"><h2>Put AI to work</h2></div><div class="tool-list">${[['/guides/measure-ai-time-savings','Check your hourly earnings','Compare the cost and time of doing a job yourself with an AI-assisted version.'],['/field-guide/agent-workflows','Watch an AI workflow','Follow one client request from research notes to a checked deliverable.'],['/field-guide','Make a digital product','Try a finished example, download the template, and test it with a buyer.'],['/workflow-library','Use a ready-made skill','Scope a first client project and prepare a sample for delivery.']].map(([u,t,d])=>`<a href="${u}"><h3>${t}</h3><p>${d}</p>${arrow}</a>`).join('')}</div></section>
  <section class="ed-wrap bulletin"><div><h2>Try one idea this week.</h2><p>Get practical side hustle experiments from AI Side Hustle.</p></div>${button(newsletter,'Get weekly tips')}</section>
  <section class="ed-wrap bulletin" aria-labelledby="agent-workshop"><div><h2 id="agent-workshop">The Agent-Powered Side Hustle</h2><p>Bring a skill and build a sample you can show a client. Join Ashley on Zoom on December 16 and 30, 2026, from 7–9 p.m. Eastern. One payment covers both sessions.</p></div>${button('https://wealthexperiment.live/agent-side-hustle/register','Register and pay $149')}</section>
  <div class="ed-wrap more-links"><a href="/field-guide#workshops">All live workshops →</a><a href="/digital-products">Digital product course →</a><a href="/blog">Browse the article archive →</a></div>`;
  return shell('/','Find a side hustle you can test this week','Compare 77 side hustle ideas, explore AI workflows and check the evidence behind earning programs.',body);
}
export function guidesPage() {
  return shell('/guides','Side hustle guides','Practical guides to earning with AI, from game design and clipping to affiliate sales.',`<div class="ed-wrap editorial-section"><div class="page-intro">${flag('The guidebook')}<h1>Side hustle guides</h1><p>See the work, the buyer, and the first test for each idea.</p></div><div class="story-grid">${articles.map(guideCard).join('')}</div><p class="archive-link"><a href="/field-guide/pocket-product-workshop">Hands-on workshop: build a bakery pickup planner →</a></p><p class="archive-link"><a href="/blog">Browse the full AI Side Hustle article archive →</a></p></div>`);
}
export function reviewsPage(){
  return shell('/program-reviews','Side hustle program reviews','Compare the payout model, evidence, costs and first test for five real programs.',`<div class="ed-wrap editorial-section"><div class="page-intro">${flag('Research desk')}<h1>Side hustle program reviews</h1><p>What can you earn, what does it cost to try, and who actually gets paid? Start with the evidence for your kind of work.</p></div><div class="review-layout"><div>${reviews.map(reviewRow).join('')}</div><aside class="note-box"><h2>How we review</h2><p>We check the program’s own terms, look for earnings data that identifies the population measured, and spell out costs the headline leaves out.</p><p>Each verdict includes a small test and a reason to stop. These are desk reviews. The sources and review date appear on every page.</p></aside></div></div>`);
}
function calculator(){
  const inputs=[['fee','Customer payment ($)',150],['other','Other delivery costs ($)',10],['cost','Extra AI cost per job ($)',6],['before','Hours before using AI',5],['after','Hours with AI, including review',3]];
  return `<section class="calc"><h2>Compare your hourly earnings</h2><p>Use a completed job or try the example below. Include sales, revisions and checking time in both estimates.</p><form id="rate-form"><div class="calc-grid">${inputs.map(([n,t,v])=>`<label>${t}<input required type="number" min="${['before','after'].includes(n)?'0.01':'0'}" step="any" name="${n}" value="${v}"></label>`).join('')}</div><button class="ed-button solid">Calculate</button><output aria-live="polite">Example before tax and overhead: $28.00/hr before AI and $44.67/hr with AI.</output></form><script defer src="/studio-assets/earnings.js"></script></section>`;
}
export function articlePage(s){
  const [im,alt,idea,review]=art[s.slug], url=storyUrl(s);
  const sidebar=`<aside class="read-side"><b>In this guide</b>${s.sections.map((x,i)=>`<a href="#section-${i+1}">${e(x.title)}</a>`).join('')}<a href="/side-hustles/${idea}">Open the playbook →</a></aside>`;
  return shell(url,s.title,s.description,`<div class="ed-wrap"><a class="crumb" href="/guides">← All guides</a><div class="article-intro"><div>${flag(s.category)}<h1>${e(s.title)}</h1><p>${e(s.description)}</p><small>AI Side Hustle · ${date}</small></div><figure>${photo(im,alt)}</figure></div><div class="read-grid">${sidebar}<article class="read-body">${s.sections.map((x,i)=>`<section id="section-${i+1}"><h2>${e(x.title)}</h2>${x.paragraphs.map(p=>'<p>'+e(p)+'</p>').join('')}</section>`).join('')}${s.slug==='measure-ai-time-savings'?calculator():''}${sources(s.sources)}<div class="read-next">${button('/start/'+idea,'Start my plan')}${review?'<a href="/program-reviews/'+review+'">Read the program review →</a>':''}</div></article></div></div>`,im,{article:true});
}
export function reviewPage(r) {
  const story=articles.find(a=>art[a.slug][3]===r.slug);
  return shell(reviewUrl(r),r.name+' review',r.description,`<div class="ed-wrap editorial-section"><a class="crumb" href="/program-reviews">← All program reviews</a><div class="page-intro">${flag('Program review')}<h1>${e(r.name)}</h1><p>${e(r.description)}</p><small>Reviewed ${date}</small></div><div class="review-layout"><article class="read-body">${[['What the evidence shows',r.evidence],['What we still don’t know',r.unknown],['A small test to run',r.test],['When to pause',r.stop]].map(([t,p])=>`<section><h2>${t}</h2><p>${e(p)}</p></section>`).join('')}${sources(r.sources)}</article><aside class="note-box">${flag('Our verdict')}<h2>${e(r.verdict)}</h2>${story?button(storyUrl(story),'Read the practical guide','outline'):''}</aside></div></div>`,story?art[story.slug][0]:'hero',{article:true});
}
