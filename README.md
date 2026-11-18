# AI Side Hustle

Run the independent Node service with `node start.mjs`. Run `node --test field-guide/studio.test.mjs service.test.mjs field-guide/decision.test.mjs` to check the editorial pages, catalog, fit tools, downloads and legacy routing.

The core application serves the homepage, guide library, program reviews, field guide, 77 playbooks, work-style quiz, fit matcher, shortlist, offer builder and saved-plan workspace. Browser plans retain the original storage key and JSON backup format. The core needs no account, database, package install or Waymaker API.

The canonical .cc installation mounts this module under `frontend/sidehustle`. Release shared changes there and here. The .live service renders the same core routes and forwards older archive and course URLs to .cc.

Playbooks are grouped by category under `field-guide/decision/catalog`. The public guide data originated in Waymaker’s side-hustle templates and deep resources. Prices, task times and launch goals in templates are illustrative. Dated program reviews under `field-guide/editorial/stories.mjs` contain their primary sources.
