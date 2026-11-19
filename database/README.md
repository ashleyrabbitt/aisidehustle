# Saved plan sync

Apply saved_plans.sql once to the dedicated AI Side Hustle Supabase project. Enable email sign-in. Configure a production SMTP sender and set the sign-in and sign-up email templates to show {{ .Token }}. Test delivery to a mailbox outside the organization. The browser accepts the code directly on My plans.

Set AISIDEHUSTLE_SUPABASE_URL and AISIDEHUSTLE_SUPABASE_PUBLISHABLE_KEY on the service serving aisidehustle.cc only after testing the database and email configuration. Use the dedicated project URL and its publishable key. The application renders the account interface when both values pass validation. Removing either setting restores the browser-only interface.

An account opens its own tab workspace. Signed-in edits sync after a brief pause, when a tab regains focus, and when the connection returns. Concurrent edits prompt the reader to pick a version. Existing browser plans can be copied explicitly after sign-in. Their original local copies remain available when signed out. Back up pending edits before closing an offline tab.

The browser SDK is the unmodified dist/umd/supabase.js from the @supabase/supabase-js 2.119.1 npm package. A local copy and the package’s license are in field-guide/assets/vendor. No external JavaScript host is required.

Before enabling on the public site, sign in with two independent test accounts, check that each sees only its own rows, edit one account from two devices, and restore an existing browser plan. Verify that both local and email-authenticated workflows work on the canonical domain.
