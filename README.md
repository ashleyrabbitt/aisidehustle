# AI Side Hustle

The AI Side Hustle field guide is a standalone Node application. It serves the homepage, four guides, workflow player, local artwork and editable downloads. Briefs live in each visitor’s browser. The application requires no Waymaker API, database, credentials or package installation.

Run the site with `node start.mjs`. Set `PORT` to change the listening port. Run `node --test field-guide/studio.test.mjs service.test.mjs` to check the independent pages, downloads and legacy routing.

The independent production service uses this repository on aisidehustle.live. The .cc domain is the canonical edition and also hosts the historical directory, course, blog, and saved plans. Historical paths on .live forward to their original .cc URLs. The equivalent core module for the shared .cc deployment is in `frontend/sidehustle` in the Waymaker repository. When changing both editions, release the field-guide module to both repositories and verify both domains.
