// Reader-facing resources. Each first run includes a concrete check.
export default {
  "site": "ash",
  "title": "AI skills for a first client project",
  "category": "Side hustle skill library",
  "intro": "Turn a rough request into a scope, build a work sample, or outline a niche digital product. Download a reusable skill and try it with the example before using client material.",
  "quickTitle": "Try a skill with a sample brief",
  "quickSteps": [
    "Download the skill and open its SKILL.md file.",
    "Give your assistant the instructions and example.",
    "Compare the draft with the check in the guide."
  ],
  "starter": "client-scope",
  "placeholder": "Try scope, sample or niche",
  "related": [
    [
      "Free offer planner",
      "/tools/first-offer"
    ],
    [
      "Product Launch Lab",
      "/tools/product-launch-lab"
    ],
    [
      "Side hustle resources",
      "/side-hustle-resources"
    ]
  ],
  "primerTitle": "How to install and test a skill",
  "primer": [
    [
      "Use a skill",
      "Download its ZIP. In a client that accepts skill ZIPs, import it using the client’s skills settings. For a folder-based client, extract the named folder into its documented skills directory. In an ordinary chat, paste the instructions from SKILL.md, then the sample request."
    ],
    [
      "Test the output",
      "Run the worked example, inspect it against the acceptance check, then repeat with one new brief. Keep a copy of the instructions with the version you used."
    ]
  ],
  "resources": [
    {
      "id": "client-scope",
      "name": "One-page client scope",
      "goal": "Scope client work",
      "benefit": "Clarify what the client will receive, what they supply, and how both parties know the job is finished.",
      "inputs": "Client request, audience, draft assets, delivery format, requested deadline, revision allowance, price if agreed and any outstanding dependencies.",
      "steps": [
        "Extract the client's desired result and the work they actually asked for. Separate confirmed commitments from assumptions. Ask the smallest question that would change price or timing.",
        "Describe each deliverable as a countable item with a file format, owner and acceptance criterion. Set treatment for client-provided assets, an agreed revision round and out-of-scope additions.",
        "Build the sequence around receipt of required inputs. If the deadline, price or reviewer is missing, leave a clearly marked field for confirmation.",
        "Write a short client-ready scope ending with an approval question. Leave it as a draft for the freelancer to review."
      ],
      "prompt": "Scope this sample request: a salon wants three appointment reminder emails in a Google Doc within five business days after receiving its existing booking policy. One revision is included. The salon sends the emails itself. Nobody has agreed a price.",
      "example": "Deliver one Google Doc containing three emails, each with a subject line, body and editable booking link. The five-business-day clock starts when the salon supplies its booking policy. One consolidated revision is included. The salon handles sending. Fee: awaiting agreement.",
      "check": "A client can identify the deliverable, who supplies inputs, when timing starts, how to request a revision and which items still require agreement.",
      "kind": "Skill",
      "file": "client-scope.zip",
      "downloadLabel": "Download skill (.zip)"
    },
    {
      "id": "sample-delivery",
      "name": "Build a client-ready sample",
      "goal": "Prepare a sample",
      "benefit": "Create a small, usable example and show exactly how the buyer would adapt it.",
      "inputs": "Buyer type, job they need done, one realistic fictional scenario, output format, verified constraints and details the buyer must fill in.",
      "steps": [
        "Choose one representative unit of the larger offer. Give the fictional client and scenario a visible sample label.",
        "Draft the actual unit in the format the buyer will receive. Use bracketed placeholders for unknown facts and include only real claims supported by the brief.",
        "Add a brief handoff explaining what to replace, where the item goes in the buyer's workflow, and how to check it before use.",
        "Test the sample against the scenario. Return the item, the customization checklist and a one-sentence description of what the full service would deliver."
      ],
      "prompt": "Create one sample reminder SMS for a fictional mobile dog groomer. It goes out the day before service. Include appointment time, reply instructions and a reschedule link. Stay under 145 characters before replacements. The business has no cancellation fee in this brief.",
      "example": "Sample SMS: 'Hi [name], your dog’s grooming visit is tomorrow at [time]. Reply YES to confirm or reschedule here: [link].' Handoff: replace the three fields, test the link, and count the final characters after substitution.",
      "check": "A buyer can use the sample with only the listed replacements. The copy follows the requested format and includes no invented fees, promises or client results.",
      "kind": "Skill",
      "file": "sample-delivery.zip",
      "downloadLabel": "Download skill (.zip)"
    },
    {
      "id": "niche-product-brief",
      "name": "Niche digital product brief",
      "goal": "Plan a digital product",
      "benefit": "Keep the first version narrow enough to build and specific enough to test with prospective users.",
      "inputs": "Buyer segment, repeated task, evidence from conversations or observation, available time, current workaround and an example of a finished result.",
      "steps": [
        "Describe the buyer at the moment the task occurs. Identify the trigger, current workaround and evidence of friction. Label each unsupported point as an assumption.",
        "Choose the smallest artifact that completes one task. Specify its format, fields, one worked example and completion condition. List features to postpone.",
        "Write a product promise tied to what the artifact actually produces. Treat any price as a test hypothesis unless a real transaction supports it.",
        "Design a short use test with a realistic input, observable success measure, participant count and decision rule. Return a one-page brief with the first build task."
      ],
      "prompt": "Create a two-hour product brief for independent craft fair sellers. Two sellers said they rebuild a packing list for each show. Test a printable with three other sellers. No one has paid. The goal is to finish a booth packing list in ten minutes.",
      "example": "First version: a one-page checklist covering inventory, payment, display and weather, with blank rows for custom items. Show a completed example for a candle booth. Test three sellers planning a real show. Advance if two finish in ten minutes without help; pricing remains untested.",
      "check": "The brief identifies a specific buyer, one finished result, a buildable file and a pass/fail use test. It distinguishes observed demand signals from purchases.",
      "kind": "Skill",
      "file": "niche-product-brief.zip",
      "downloadLabel": "Download skill (.zip)"
    }
  ]
};
