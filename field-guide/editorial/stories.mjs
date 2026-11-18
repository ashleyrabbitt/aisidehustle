const link = (label, url) => ({ label, url });
const section = (title, ...paragraphs) => ({ title, paragraphs });
const ftc = link("FTC guide to endorsements and affiliate links", "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking");
const amazonWindow = link("Amazon Associates US referral window", "https://affiliate-program.amazon.com/help/node/topic/G9SMD8TQHFJ7728F");
const amazonRates = link("Amazon Associates US standard commissions", "https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ");
const youtubeRules = link("YouTube channel monetization policies", "https://support.google.com/youtube/answer/1311392");
const youtubeEntry = link("YouTube Partner Program eligibility", "https://support.google.com/youtube/answer/72851");
const youtubeDisclosure = link("YouTube guidance on disclosing generative AI", "https://support.google.com/youtube/answer/14328491");
const clipTerms = link("Content Rewards creator terms", "https://contentrewards.com/terms");
const devEx = link("Roblox Developer Exchange program guide", "https://create.roblox.com/docs/production/monetization/developer-exchange");
const robloxResults = link("Roblox creator earnings report, November 2026", "https://about.roblox.com/newsroom/2026/11/building-the-next-era-of-creation-on-roblox");
const monetiseOffer = link("Monetise US offer and included tools", "https://www.monetise.com/all-offers/offer");
const monetiseTerms = link("Monetise US terms and refund windows", "https://www.monetise.com/policy/terms?country=US");

export const articles = [
  {
    slug: "affiliate-marketing-with-ai",
    category: "Affiliate marketing",
    title: "Affiliate marketing with AI, now and into 2027",
    description: "Follow a buyer from a real product question to a credited sale. Then test where that journey might change in 2027.",
    sections: [
      section("Start with a decision you can help someone make",
        "Say a bakery owner needs a microphone for filming beside a noisy mixer. Record the same sentence with two microphones, at the same distance, with the mixer on. Publish both samples. Explain which one you would take back to that kitchen and why. A shopper now has a reason to visit your page and a way to check your judgment.",
        "Join a program that permits the sites and channels you use. Make an approved tracking link for the recommendation. Explain beside it that a qualifying purchase can earn you a commission. Record the merchant, product, market and date you checked the terms. A click, an order and a commission that survives returns are three different events."),
      section("Give AI the comparison notes",
        "Supply your test log and dated manufacturer specifications. Ask AI to draft a table with a source for every specification, a separate column for your observations and blanks for anything missing. Listen to both recordings before you publish. A summary cannot establish how a microphone sounded in your kitchen.",
        "For Amazon US, the usual window to add a qualifying item to the cart is 24 hours after arrival through your link. An order or a new visit through another Associate’s link can end that window sooner. Each advertiser has its own rules for crediting a sale. Verify the permitted placement before sending a promotional email or posting the link on another channel."),
      section("What could change in 2027",
        "Pew studied browsing by 900 US adults in March 2025. Traditional search results received clicks on 8% of visits with an AI summary and 15% without one. That observation concerns Google visits in that sample. It gives publishers a reason to test their traffic assumptions.",
        "One 2027 scenario is that assistants answer more basic shopping questions before people visit your site. A second is that buyers still seek demonstrations for difficult choices. Test both with the same comparison: offer a searchable written answer and a short demonstration with a link to the full recordings. Track which attracts shoppers who go on to purchase. Commission credit inside any shopping assistant depends on the merchant’s actual tracking arrangement."),
      section("Read the numbers after returns",
        "For each permitted placement, record qualified visits, outbound clicks, cleared commissions and production hours. If 100 outbound clicks produce $12 in cleared commission, that is $0.12 per click. At four hours of production, the first reporting period returns $3 per hour before expenses. These are example numbers. Compare future periods before buying traffic or ordering more test equipment.")
    ],
    sources: [ftc, amazonWindow, amazonRates, link("Pew Research Center study of Google AI summaries and clicks", "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/")]
  },
  {
    slug: "build-a-small-game",
    category: "Game making",
    title: "Make a tiny game people choose to play twice",
    description: "Build one playable loop in Roblox Studio, observe five playtests and decide whether a second level deserves your weekend.",
    sections: [
      section("Give the player one interesting choice",
        "Try a two-minute café rush. Customers order drinks, and the player decides which to make first as the queue grows. Build one room, two orders, a score and a restart button. Write down what you want a player to understand in ten seconds. This scope is small enough to change after watching someone play."),
      section("Let AI draft the scaffolding",
        "Describe the game states in plain language and ask an assistant to draft the order timer, restart behavior and a list of ways the timer can fail. Implement one part at a time in Studio. Test two rapid restarts, leaving mid-round and running out of time while an order is being served. Keep the first working version before changing the rules.",
        "You choose the pace, test on a phone and decide whether a mistake feels fair. Use placeholder objects you made or assets licensed for the intended use. A generated character that resembles a famous mascot adds work when you need to replace it."),
      section("Watch five first rounds",
        "Invite five people who enjoy short games. Give each the same build and let them begin without instructions from you. Note who starts the first order, who finishes a round, who chooses to restart and where they hesitate. Ask one question afterward: What made you want another round, or what stopped you?",
        "A useful early decision rule is to revise the opening whenever multiple players stall in the same place. If players finish but nobody voluntarily replays, change the core choice before producing more levels. With five testers, these are design clues. Show the next build to another group."),
      section("Consider the business after the loop works",
        "Roblox allows eligible creators to exchange Earned Robux through DevEx. Roblox reported a median of about $1,500 across twelve months for participating creators in the period ending June 2026. That figure describes people who reached the program. Budget your prototype as learning time and track the cost of each playtest before commissioning assets.",
        "A second route is a commissioned mini-game for a buyer with an audience, such as a museum running a holiday event. Show the playable sample and price one venue, one event and one revision. Ask whether the buyer wants a quote before building their version.")
    ],
    sources: [robloxResults, devEx]
  },
  {
    slug: "get-paid-for-clipping",
    category: "Clipping",
    title: "How to price your first video clip",
    description: "Compare a fixed editing fee with a campaign that pays for verified views. Use a real editing brief to find your break-even point.",
    sections: [
      section("Choose who pays",
        "A podcaster might buy three finished vertical clips for a flat fee. Agree on the source recording, length, captions, delivery date, approval and one round of edits. A performance campaign pays under a different arrangement. Open its current brief and record how it counts views, eligible channels, the remaining budget, minimum payout and per-clip cap."),
      section("Find the sentence that earns the cut",
        "Start with an authorized recording and a written brief. Ask AI to flag five timecoded moments in the transcript where the speaker asks and answers one clear question. Have it include the preceding sentence and the reason each moment might stand alone. Listen to the full exchange. Rejoin a qualifying phrase if removing it changes the speaker’s meaning.",
        "Build one vertical cut with an opener that matches the speaker’s actual point. Fix names and numbers in the auto-captions. Check permission for the music, footage, edits and publishing account. Follow the sponsor’s disclosure requirements and make the commercial relationship clear to viewers."),
      section("Calculate what the views have to earn",
        "Suppose a campaign offers $2 per thousand eligible views, its creator fee is 10%, and you want $18 for one hour of work. You need 10,000 eligible views for $18 after that fee, assuming approval, sufficient budget and no other costs. A $10 per-clip cap would make the target unreachable. Replace every assumption with the campaign’s current numbers.",
        "Count researching campaigns, pitching, waiting through revisions and managing uploads in your time log. An editing job with a smaller headline price can yield more per hour when the buyer pays an agreed amount on acceptance."),
      section("Run a three-clip trial",
        "Choose one authorized source and set a time ceiling. Record minutes per cut, approved submissions, eligible views and actual payouts. After three clips, compare cash received per hour with your own minimum. If the economics fail, use a permitted portfolio sample to pitch a fixed-price edit, or leave that campaign.")
    ],
    sources: [clipTerms, ftc, link("YouTube on reviewing automatic captions", "https://support.google.com/youtube/answer/6373554")]
  },
  {
    slug: "faceless-video-channel",
    category: "Faceless video",
    title: "Build a faceless channel around something you can show",
    description: "Use your hands, screen or original footage to teach a task. AI can speed up the edit while viewers still get a demonstration worth watching.",
    sections: [
      section("Pick a question with a visible answer",
        "A maker selling crochet patterns could film a close-up of the first row curling, undo it and show the exact change in tension. A spreadsheet specialist could screen-record reconciling two sample orders. In both formats the viewer sees the problem, the fix and the result without seeing the presenter’s face."),
      section("Record the evidence before writing the script",
        "Capture a clean take of the work. Keep the mistake if it helps a beginner recognize their own. Give the transcript to AI and ask for a shot list with the viewer’s question, a timestamp for each step and a suggested caption. Check the steps against the video. Record a pickup when the answer depends on something the camera missed.",
        "YouTube reviews originality across a channel. Mass-produced videos with little variation and compilations with minimal original contribution can be ineligible for monetization. Its disclosure rules also cover realistic synthetic depictions and meaningful AI alterations. Check the upload guidance for your footage."),
      section("Decide what a successful view does",
        "For a tutorial channel, success might be finishing the demonstration, downloading the worksheet or requesting help. Give viewers one relevant next step. Publish three videos answering different questions from the same audience. Compare how often viewers reach the result and how many take that next step. Read requests for follow-ups before scripting the fourth."),
      section("Give ad revenue time",
        "YouTube’s full ad-revenue route includes a review and thresholds for subscribers plus qualified watch hours or Shorts views. Before eligibility, a small channel can test demand for its own paid workshop or relevant service. Keep those sales separate from platform ad income. Use your first month to learn which tutorials people finish and whether a buyer appears.")
    ],
    sources: [youtubeRules, youtubeEntry, youtubeDisclosure]
  },
  {
    slug: "sell-a-content-package",
    category: "Content creation",
    title: "Turn one interview into a content package a client can approve",
    description: "Sell an interview, a useful article and two social posts with a clear review process and a measurable job for the finished content.",
    sections: [
      section("Build around a question the buyer already hears",
        "Ask a local wedding florist which email she answers most often. If couples keep asking what happens to arrangements after the ceremony, propose a short interview, an FAQ article and two posts pointing to it. Show where the florist could link the FAQ in her inquiry reply. Handling a recurring question gives her a reason to commission the work again."),
      section("Draft only from approved material",
        "Agree who can appear in the photographs and what can be recorded. Ask the florist to explain a typical handoff, an exception and a mistake couples can avoid. Give your assistant the authorized transcript. Ask it to group matching passages under those three headings, keep a timestamp with each and flag missing details.",
        "Write the FAQ from the checked passages. Ask the client to confirm venue access, transport responsibilities and any fee before publication. One post can show a room before and after a move the florist actually arranged. The second can answer the timing question in her own words. Get her sign-off on both."),
      section("Quote the complete job",
        "Include preparation, the interview, transcript checks, photo selection, revisions, approval and invoicing in your estimate. For example, a $240 package with $20 of direct expenses and four hours of total work leaves $55 per hour before taxes and overhead. With two extra hours of edits, it falls to about $37. Put one revision round and the charge for additional work in the proposal."),
      section("Ask for the second order",
        "Two weeks after publication, ask how often the florist used the FAQ in a reply and what couples asked next. Record links clicked, inquiries that mention the piece, and whether the client wants the next FAQ. If she uses the article but never shares the posts, offer the next job around the article and inquiry email alone.")
    ],
    sources: [link("YouTube explains common automatic transcription errors", "https://support.google.com/youtube/answer/6373554")]
  },
  {
    slug: "measure-ai-time-savings",
    category: "AI workflows",
    title: "Does AI actually raise your hourly earnings?",
    description: "Time two comparable jobs from intake through approval. Subtract tool costs and rework to find out where an assistant earns its place.",
    sections: [
      section("Measure one ordinary job",
        "Choose a repeatable deliverable, such as turning an event recording into a recap. On the next job, time intake, transcription, research, drafting, fact-checking, revisions and delivery. Include the minutes you spend obtaining approval. Record serious errors and the number of corrections requested. Keep the client’s acceptance criteria beside the time log."),
      section("Change one part of the next job",
        "Give AI an approved transcript with names removed where appropriate. Ask it to group quotes by topic, list their timestamps and flag phrases that could mean two things. Verify every quote against the recording and write the lead yourself. Use the same acceptance criteria. Count the setup time and any rework, even if you abandon its draft."),
      section("Put the change in dollars",
        "Suppose both jobs bring in $120. The manual version takes three hours and costs $6, leaving $38 per hour. The assisted version takes two hours and costs $12, leaving $54 per hour. Both figures are before tax and overhead. If an extra revision takes an hour, the assisted job drops to $36 per hour.",
        "A 2025 study of 5,172 customer-support workers found that access to an AI assistant increased issues resolved per hour by 15% on average. The effect varied by worker. Your service has its own buyers and quality bar, so repeat the comparison on three similar assignments before changing your quote."),
      section("Decide where the recovered time goes",
        "Keep a step delegated if the final work meets the same standard and the savings survive review. Take a step back when errors consume the time you saved. An hour freed on Tuesday becomes extra income only when someone buys more work, pays for a better outcome, or the hour reduces a real cost. Log how you actually used it.")
    ],
    sources: [link("Generative AI at Work, Quarterly Journal of Economics", "https://doi.org/10.1093/qje/qjae044")]
  },
  {
    slug: "test-a-digital-product",
    category: "Digital products",
    title: "Find a pocket product in someone's existing workaround",
    description: "Turn a dog sitter’s handoff or a market seller’s stock count into one useful download. Test the task and the price before building a bundle.",
    sections: [
      section("Ask to see the last time",
        "Find a person who repeats the task. Ask a market seller to show you how they decided what to restock after their last stall. Where did they write the closing count? Which number did they need at home? Watch the sequence and ask what an error costs. Repeated effort and an existing workaround are better starting clues than a compliment about your idea."),
      section("Build the smallest complete version",
        "Imagine the seller uses one notebook page for stock and another for shopping. A single sheet could carry opening count, units sold, damage, closing count and next order. Use fictional sample items. Ask AI to suggest confusing labels, supply three edge cases and draft a one-page instruction sheet. Test your formulas manually for a sold-out item and a damaged item.",
        "Deliver a blank copy and a completed example. Ask the seller to complete yesterday’s count without your help. Watch which field needs an explanation. Delete any field they never use and add an example beside the field that slowed them down."),
      section("Make the first offer specific",
        "Offer one buyer the editable file, a short setup walkthrough and a clear price. A request for the free sample measures curiosity. A paid order establishes willingness to pay at those terms. A buyer who uses it at their next market tells you something about continuing value. Ask whether you may quote their exact feedback after that second use."),
      section("Price the support as well as the file",
        "List payment fees, storefront fees, refunds and time spent answering questions. At an illustrative $8 of contribution per sale after direct costs, a $64 design expense takes eight sales to recover, before paying for your time. Compare fees for direct traffic and marketplace discovery on the storefront you choose. A listing still needs a way to reach the buyer.")
    ],
    sources: [link("Gumroad pricing for direct and discovery sales", "https://gumroad.com/pricing"), link("Gumroad fee details and processing costs", "https://gumroad.com/help/article/66-gumroads-fees")]
  }
];

export const reviews = [
  {
    slug: "roblox-devex", name: "Roblox Developer Exchange", verdict: "Promising for game makers with returning players",
    description: "A way for eligible creators to exchange Earned Robux for money. The useful early signal for a new game is whether players return on their own.",
    evidence: "Roblox reports more than 42,000 DevEx participants and a median of roughly $1,500 received in the twelve months ending June 30, 2026, among participating creators. Roblox describes millions of creators monetizing on the platform overall. Its published standard exchange rate yields $114 for 30,000 eligible Earned Robux at that rate.",
    unknown: "The reported median excludes creators who never reach DevEx and does not deduct development costs. We did not find a first-time developer’s probability of earning back their hours in the cited material.",
    test: "Build one playable loop. Track completed rounds, voluntary replays and returns on the following day. When you introduce a purchase, track eligible earnings and development hours separately.",
    stop: "Hold additional spending if players keep leaving before the first meaningful choice. Fix that moment and repeat the test before purchasing art or promotion.",
    sources: [robloxResults, devEx]
  },
  {
    slug: "content-rewards", name: "Content Rewards", verdict: "Test one campaign with a time limit",
    description: "Creators submit authorized clips or original brand content to campaigns. Content Rewards Inc. operates the marketplace. Payment depends on the campaign model.",
    evidence: "The November 17 creator terms list a 10% creator fee on CPM and pool payouts. CPM campaigns pay against verified views and may include minimums and caps. Fixed-per-post and retainer deals have different rules and fees. A funded campaign can run down its available budget.",
    unknown: "The terms establish a payment mechanism. They do not supply a median net hourly rate or the share of new clippers who earn a payout. An advertised rate alone cannot tell you what one hour of editing will return.",
    test: "For one campaign, save the brief and your permitted distribution channels. Calculate the eligible views required to cover your time after fees. Submit one suitable edit and follow it through approval and settlement.",
    stop: "Pass on a campaign if the cap cannot cover your minimum or the brief leaves rights unclear. If a trial earns less than your floor, compare a fixed-fee editing job before producing more speculative clips.",
    sources: [clipTerms, link("Content Rewards platform overview", "https://contentrewards.com/about")]
  },
  {
    slug: "monetise", name: "Iman Gadzhi’s Monetise", verdict: "Test demand before paying for training",
    description: "A paid digital-product training and AI software bundle. This review examines the public US offer and terms. We did not enroll or audit purchaser accounts.",
    evidence: "The offer reviewed on November 18, 2026 displayed $1,995 and listed course material, software and support. The seller describes continued support for up to three years under conditions. The US terms give the core Monetise purchase a seven-day refund window, beginning at the first payment for installment plans.",
    unknown: "The seller presents testimonials and performance claims. We could not verify median net profit across all purchasers, including people who made no sales, or a cohort-level recovery rate after expenses. There is insufficient evidence here to estimate your likelihood of a profit.",
    test: "Interview three prospective buyers, build a sample and offer it at a real price first. If your contribution after variable expenses is $20 per sale, recovering a $1,995 course fee alone requires 100 sales. Identify the exact obstacle a paid lesson or tool would help you solve.",
    stop: "Defer the purchase if your decision depends on earning back the fee promptly. Get the exact SKU, access duration, total installment cost and refund deadline in writing before checkout.",
    sources: [monetiseOffer, monetiseTerms, link("FTC advice on evaluating business coaching offers", "https://consumer.ftc.gov/articles/when-business-offer-or-coaching-program-scam")]
  },
  {
    slug: "amazon-associates", name: "Amazon Associates US", verdict: "Worth a small trial for buyer-focused publishers",
    description: "A referral program for publishers who can help a reader choose a specific product and send that reader through an eligible link.",
    evidence: "Amazon publishes category-specific commission rates and its rules for qualifying purchases. A typical referral session gives the visitor up to 24 hours to add a qualifying item to the cart, and certain events close the session sooner. These terms make the economics of a small test measurable.",
    unknown: "Amazon’s published rules do not show what a new publisher with your audience will earn. A review page may attract readers who already own the product or who buy later through another route.",
    test: "Publish one original comparison answering a pre-purchase question. Use the required Amazon identification and clearly disclose the relationship near the recommendation. Record outbound clicks, qualifying transactions and settled commissions after returns.",
    stop: "If you have relevant traffic and clicks but few credited purchases, check the audience, product choice, country and links. Compare settled earnings with the hours and cost of maintaining the page before expanding.",
    sources: [amazonWindow, amazonRates, link("Amazon Associates operating policies", "https://affiliate-program.amazon.com/help/operating/policies"), ftc]
  },
  {
    slug: "youtube-partner-program", name: "YouTube Partner Program", verdict: "A longer-term option for original video",
    description: "YouTube offers creators a route to ad and Premium revenue after they meet eligibility rules and pass channel review.",
    evidence: "For the full ad-revenue route, YouTube lists 1,000 subscribers plus either 4,000 qualified public watch hours in twelve months or 10 million qualified public Shorts views in ninety days. In eligible countries, lower thresholds unlock selected features earlier. Original tutorials can work without showing the presenter’s face.",
    unknown: "Crossing a threshold triggers a review process. The cited policies provide no median take-home income for new faceless channels. Upload frequency alone offers little evidence that a channel will qualify.",
    test: "Make three original demonstrations for one audience. Track completion, qualified watch time, repeat viewers and production hours. If there is a linked product, account for its income separately from potential ad revenue.",
    stop: "Pause a format if viewers repeatedly leave before the demonstration begins. Rebuild the opening or demonstrate another problem. A library of interchangeable, minimally varied videos also risks ineligibility under the channel policies.",
    sources: [youtubeEntry, youtubeRules, link("Features in the expanded YouTube Partner Program", "https://support.google.com/youtube/answer/13429240")]
  }
];
