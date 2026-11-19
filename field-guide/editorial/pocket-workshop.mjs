import { button, shell } from './shared.mjs';

export const pocketPath = '/field-guide/pocket-product-workshop';
export const pocketTitle = 'Build a pocket product from one repeated task';
export const pocketDescription = 'Find a buyer problem, try a real preorder calculator, and download a working spreadsheet and offline opportunity worksheet.';

function worksheet(){
  return `<section class="pp-pad" id="worksheet" aria-labelledby="worksheet-title">
<h2 id="worksheet-title">What evidence do you have for your idea?</h2>
<p>Think about the last time someone did the task. Answer three questions to choose your next test.</p>
<form id="pocket-evidence">
<label>Your idea<input name="idea" placeholder="A preorder planner for Saturday bread pickups" maxlength="200"></label>
<label>Whose work have you seen?<select name="buyer"><option value="none">I have a possible audience in mind</option><option value="interview">A buyer described their last attempt</option><option value="seen">I saw their actual workaround</option></select></label>
<label>How often does the problem occur?<select name="repeat"><option value="unknown">I still need to ask</option><option value="once">I have one example</option><option value="recurs">I have examples from two occasions</option></select></label>
<label>What has a buyer agreed to?<select name="action"><option value="none">No specific commitment yet</option><option value="test">A time to try the sample</option><option value="paid">Payment for a clearly described version</option></select></label>
<label>Evidence and source<textarea name="notes" maxlength="2000" rows="3" placeholder="Date, buyer role and what you observed. Leave private customer details out."></textarea></label>
<p class="pp-next" aria-live="polite"><strong>Your next test</strong> <span id="pocket-next">Ask a potential buyer to show you the last time they did this task.</span></p>
<button type="button" class="ed-button solid" data-export-idea>Download my test plan ↓</button><span role="status" class="pp-feedback"></span>
</form></section>`;
}

function batchCalculator(){
  return `<section id="calculator" class="pp-calc"><div><h2>Try the baker’s batch calculation.</h2><p>Change the numbers for one bread variety and pickup window. “Ready loaves” means usable stock available for that same pickup.</p></div>
<form id="pocket-batches"><div class="pp-fields"><label>Confirmed loaves<input name="ordered" type="number" min="0" max="100000" step="1" value="19" required></label>
<label>Ready loaves<input name="ready" type="number" min="0" max="100000" step="1" value="2" required></label>
<label>Loaves per batch<input name="yield" type="number" min="1" max="100000" step="1" value="6" required></label></div>
<output aria-live="polite">Bake 3 batches. After filling orders for 19 loaves, 1 loaf remains.</output></form></section>`;
}

export function renderPocketWorksheet(css,js) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My pocket product worksheet | AI Side Hustle</title><style>body{margin:0;background:#f5f8ed;color:#17382b;font:17px/1.55 system-ui,sans-serif}main{margin:auto;max-width:850px;padding:clamp(16px,4vw,48px)}h1{line-height:1.06;font-size:clamp(32px,5vw,54px)}button{cursor:pointer;background:#145338;color:white;padding:11px 16px;border:0;border-radius:6px;font-weight:700}button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #c16a00;outline-offset:2px}${css}</style></head><body><main><p>AI Side Hustle</p><h1>My pocket product worksheet</h1><p>Use this file offline. Download your test plan before closing it.</p>${worksheet()}${batchCalculator()}</main><script>${js}</script></body></html>`;
}

export function pocketWorkshop(){
  const body=`<link rel="stylesheet" href="/studio-assets/pocket-workshop.css"><div class="pp-page"><header class="pp-lead ed-wrap"><a class="crumb" href="/field-guide">← Digital product field guide</a><p class="overline">Pocket product workshop</p><h1>One baker. One pickup list.<br><em>One useful product.</em></h1><p>A baker closes Saturday orders and counts the same messages twice. Follow that task into a working spreadsheet, then use the worksheet to test a problem of your own.</p><div class="pp-actions">${button('#calculator','Try the calculator')}<a href="#worksheet">Test my product idea ↓</a></div></header>
<figure class="pp-cover ed-wrap"><img src="/studio-assets/bakery-preorders.webp" width="1180" height="787" fetchpriority="high" alt="Bread ready for pickup beside an order sheet, with a baker attaching a label to a wrapped loaf."><figcaption>A preorder-to-batch planner for a small bakery. Worked example with fictional orders.</figcaption></figure>
<div class="ed-wrap pp-content"><section><h2>Follow the work before designing the file.</h2><div class="pp-steps">
<article><div class="pp-art pp-messages" aria-hidden="true"><span>12 country loaves</span><span>+ 7 for Saturday</span></div><h3>1. Find the repeat decision</h3><p>Ask a baker to walk you through their last pickup. Where did they combine orders? When did the number change? Write down the workaround and the last error it caused.</p></article>
<article><div class="pp-art pp-math" aria-hidden="true"><b>19 − 2 = 17</b><span>loaves still needed</span></div><h3>2. Build one useful calculation</h3><p>Start with one variety and one pickup. Count confirmed loaves, subtract ready stock, and round up to whole batches. A buyer can check the result by hand.</p></article>
<article><div class="pp-art pp-pickup" aria-hidden="true"><b>Saturday pickup</b><span>3 batches × 6</span><span>1 loaf left</span></div><h3>3. Watch someone use it</h3><p>Give a baker the blank sheet and an anonymized order list. Ask them to plan a pickup without your help. Record the first field they hesitate over and whether the result changes their plan.</p></article>
</div></section>
${batchCalculator()}
<section class="pp-delivery"><div><h2>Open the product a buyer would get.</h2><p>The Excel file includes a completed pickup, a reusable planning sheet and instructions. Copy a new sheet for each pickup and keep each bread variety on its own row.</p></div><a class="ed-button solid" data-action="sample_download" download href="/studio-assets/bakery-pickup-planner.xlsx">Download the Excel planner ↓</a></section>
<section class="pp-workflow"><div><p class="overline">Agent workflow</p><h2>Who does which part?</h2><p>ChatGPT sorts anonymous order notes. Claude drafts the spreadsheet. You reconcile one pickup by hand. Muse or a reminder bot helps you follow up after the test.</p></div>${button('/field-guide/agent-workflows#flow-bakery','Play the bakery handoffs','outline')}</section>
<section><h2>Find a pocket in a market you know.</h2><p>Start where you can reach a buyer and see their current process. These are research leads to investigate.</p><dl class="pp-leads"><div><dt>Independent tutors</dt><dd>After three lessons, what takes longest to explain to a parent? Ask to see a redacted update. Test a one-page progress note with a tutor who has agreed to try it.</dd></div><div><dt>Event photographers</dt><dd>What goes missing between booking and shoot day? Review a fictional shot list with a photographer. Test a family grouping checklist at a rehearsal before proposing a paid pack.</dd></div><div><dt>Home bakers</dt><dd>How does a late change affect the batch count? Compare two recent pickups. Test the blank planner beside the existing method and check the totals together.</dd></div></dl></section>
${worksheet()}<p class="pp-offline"><a href="/studio-assets/pocket-product-worksheet.html" data-action="sample_download" download>Take the interactive worksheet offline ↓</a> <span>Single HTML file · works without an account or internet connection.</span></p>
<section class="pp-sell"><h2>Ask for a buying decision.</h2><p>Invite the tester to use the revised sheet for their next pickup. Show the exact file, the price, and how they will receive it. Record what they paid, how long support took and what they used again. A second paid use or a referral is a reason to test a wider audience.</p><div class="pp-actions">${button('/field-guide/test-your-offer','Run the seven-day buyer test')}<a href="/guides/measure-ai-time-savings">Check earnings per hour →</a></div></section></div></div><script defer src="/studio-assets/pocket-workshop.js"></script>`;
  return shell(pocketPath,pocketTitle,pocketDescription,body,'bakery-preorders');
}
