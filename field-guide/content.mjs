export const origin = 'https://aisidehustle.cc';
export const newsletter = 'https://preview.mailerlite.io/forms/2626017/200636496666953394/share';
export const guide = '/field-guide';
export const routes = {
  skills: '/workflow-library',
  find: guide + '/find-a-niche',
  build: guide + '/make-a-digital-product',
  agents: guide + '/agent-workflows',
  sell: guide + '/test-your-offer',
};

export const examples = {
  florist: {
    title: 'The wedding florist’s quote brief', short: 'Florist quote brief', image: 'florist',
    alt: 'A florist fills in a green worksheet beside flower samples and a binder.',
    buyer: 'Independent wedding florists', format: 'Brief + worked example',
    task: 'Collect the details needed for a first estimate in one client conversation.',
    signal: 'Ask a florist to show you the last inquiry that required a second email. Which missing answer held up the estimate?',
    before: '“We need flowers for a small wedding. What would it cost?”',
    fields: ['Event date and venue access time', 'Guest tables and ceremony pieces', 'Budget range and who approves', 'Details to confirm before quoting'],
    sample: ['May 15 · access from 11 am', '8 tables · 1 ceremony arrangement', '$900–$1,200 · couple approves', 'Venue collection time still unknown'],
    test: 'Give the brief to two florists with a fictional inquiry. Watch which fields they skip and whether they can draft the next email.',
    file: 'florist-quote-brief.csv',
  },
  sitter: {
    title: 'The pet sitter’s first-visit sheet', short: 'Pet sitter handoff', image: 'pet',
    alt: 'A green leash and house key sit beside a pet sitter’s paper handoff sheet.',
    buyer: 'Solo pet sitters taking on new households', format: 'Intake sheet + checklist',
    task: 'Turn a meet-and-greet into a clear first-visit handoff for a backup sitter.',
    signal: 'Ask a sitter what they last had to text an owner about during a visit. Look for the same missing detail in a second story.',
    before: '“Everything you need is somewhere in our messages.”',
    fields: ['Visit window and check-in method', 'Owner-approved routine', 'Location of supplies', 'Agreed escalation contact'],
    sample: ['Friday 4–5 pm · text on arrival', 'Follow the owner’s written evening routine', 'Lead on the hook by the door', 'Use the contact on the private booking record'],
    test: 'Give a blank sheet and fictional notes to a sitter. Can a second person find the visit time and lead without asking the first sitter?',
    file: 'pet-visit-handoff.csv',
  },
  market: {
    title: 'The market vendor’s restock sheet', short: 'Market restock sheet', image: 'market',
    alt: 'Folded market linens, kraft tags and a pencil sit beside an inventory tally sheet.',
    buyer: 'Makers selling at weekend markets', format: 'Spreadsheet + sample row',
    task: 'Use the last stall’s stock count to decide what to bring next Saturday.',
    signal: 'Ask a vendor how they decided what to pack after their last sellout. See whether a notebook, receipts or a spreadsheet already does the job.',
    before: '“Did the olive towels sell out or did I bring too few?”',
    fields: ['Item', 'Units packed', 'Units sold', 'Next event target'],
    sample: ['Olive tea towel', '12', '9', '12'],
    test: 'Ask a maker to enter one real item after a market. Check that the next restock quantity makes sense when nothing sells and when everything sells.',
    file: 'market-restock.csv',
  },
};

export const workflows = [
  {
    id: 'brief', name: 'Make the florist brief',
    steps: [
      {role:'Researcher', tool:'ChatGPT', title:'Find the missing question', input:'Three anonymized inquiry notes from a florist.', output:'A short list of missing details, each tied to a note.', prompt:'Read these anonymized inquiries. Quote the words behind each missing detail. Put assumptions in a separate list. Which single question would most reduce a follow-up email?'},
      {role:'Maker', tool:'Claude', title:'Build a one-page first draft', input:'The verified questions and the florist’s preferred order.', output:'A blank quote brief and one fictional completed example.', prompt:'Turn these verified questions into a one-page editable florist quote brief. Group them in the order a client can answer them. Add a fictional example and leave unknowns visibly blank.'},
      {role:'Reviewer', tool:'You', title:'Try the brief on an awkward inquiry', input:'The draft and an inquiry without a confirmed venue.', output:'A revised field for unknowns and a sample ready to share.', prompt:'Read the example as a first-time client. Can I answer each field without guessing? Can the florist see what to ask next? Fix one point of friction before sharing.'},
      {role:'Coordinator', tool:'Muse or a reminder bot', title:'Bring feedback back to the maker', input:'An agreed test date and a blank feedback log.', output:'A reminder to review the tester’s actual feedback.', prompt:'Draft a reminder for Friday to review my florist brief test. Include these questions: What did the tester skip? What did they ask for? Show me the reminder and time before scheduling.'},
    ],
  },
  {
    id:'restock', name:'Test a restock sheet',
    steps: [
      {role:'Researcher', tool:'Grok or ChatGPT', title:'Find the vendor’s own language', input:'Public vendor discussions or interview notes you supply.', output:'Two recurring stock-count problems with source links or note IDs.', prompt:'From these sources, pull only firsthand descriptions of how makers count leftover stock. Include a link or note ID and a short quote. Flag questions we still need to ask a vendor.'},
      {role:'Maker', tool:'Claude', title:'Draft a sheet you can check by hand', input:'One stock-count problem and a fictional item.', output:'A table with packed, sold, remaining, target and restock quantities.', prompt:'Draft a restock table for a vendor. If 12 units were packed, 9 sold and the next-event target is 12, show the remaining and restock calculations. Flag missing entries and sales above packed stock.'},
      {role:'Reviewer', tool:'You', title:'Check the awkward rows', input:'Three cases: zero sales, a sellout and a missing count.', output:'Expected values checked by hand and one fix for an ambiguous cell.', prompt:'With 12 packed and 9 sold, 3 remain. To reach 12, I need 9. Check a sellout and a missing count. Ask a vendor which number they would actually use to pack.'},
      {role:'Coordinator', tool:'Muse or a spreadsheet bot', title:'Prepare the next market review', input:'The market date and an empty experiment log.', output:'A draft follow-up and a reminder you choose whether to use.', prompt:'Prepare a private post-market review for Sunday. Ask what sold out, what came home, and whether the sheet changed a packing decision. Leave the message as a draft for me to review.'},
    ],
  },
  {
    id:'bakery', name:'Plan a bakery pickup',
    steps:[
      {role:'Researcher',tool:'ChatGPT',title:'Separate confirmed orders from questions',input:'Fictional notes: 12 country loaves confirmed, 7 more confirmed, and an inquiry about 4.',output:'19 confirmed loaves. Keep the 4-loaf inquiry in a separate follow-up list.',prompt:'Group these anonymized notes by pickup and bread variety. Count confirmed quantities only. Return one line per order with its note ID, then a separate list of unclear orders. Show the sum.'},
      {role:'Maker',tool:'Claude',title:'Translate the count into whole batches',input:'19 confirmed loaves, 2 ready for this pickup and a yield of 6 per batch.',output:'17 loaves needed. Round up to 3 batches. After pickup, 1 loaf remains.',prompt:'Design one spreadsheet row for confirmed loaves, ready stock and batch yield. Give formulas for whole batches and remaining stock. Treat an empty input as unknown and flag a zero batch size. Check the example by hand.'},
      {role:'Reviewer',tool:'You',title:'Test the last-minute change',input:'A client cancels 4 of the 19 loaves. Ready stock and yield stay the same.',output:'15 confirmed, 13 needed, 3 batches and 5 extra. The baker verifies the decision.',prompt:'Reconcile the confirmed total against the source notes. Then check no orders, enough ready stock, a missing yield and a cancellation. Note the expected result before opening the sheet.'},
      {role:'Coordinator',tool:'Muse or a reminder bot',title:'Collect feedback after the pickup',input:'An agreed review time and the test sheet, with customer details removed.',output:'A private reminder to compare planned and actual counts after pickup.',prompt:'Draft a reminder for my agreed review time. Ask how many loaves were collected, what had to be recalculated, and whether the baker would use the file next week. Show me the draft and time before scheduling.'}
    ]
  },
];

export const guideMeta = [
  [routes.skills,'AI skills for a first client project','Download reusable skills to scope client work, deliver a sample and plan a niche product with a worked example.'],
  [routes.find,'Find a pocket opportunity','Identify one recurring task, find real buyer evidence and write a one-page product brief.'],
  [routes.build,'Make a digital product','Build a useful first edition with a blank template, a worked example and a buyer test.'],
  [routes.agents,'Put an AI work crew to work','Watch practical agent workflows and copy the instructions for ChatGPT, Claude, Muse and a reminder bot.'],
  [routes.sell,'Test an offer with real buyers','Choose a distribution channel, write a sample offer and measure sales, costs and delivery time.'],
];
