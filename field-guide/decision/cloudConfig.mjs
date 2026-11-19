export function planCloudConfig(env = process.env) {
  const url = env.AISIDEHUSTLE_SUPABASE_URL?.trim();
  const key = env.AISIDEHUSTLE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(url) ||
      !/^sb_publishable_[a-zA-Z0-9_-]+$/.test(key)) return null;
  return { url, key };
}

export const accountPanel = `<section class="backup-row" id="cloud-plans" aria-labelledby="cloud-heading">
<h2 id="cloud-heading">Use your plans on another device</h2>
<p id="cloud-identity"></p>
<form id="cloud-email"><label>Email address<input required type="email" autocomplete="email" name="email"></label>
<button type="submit" class="secondary">Email me a sign-in code</button></form>
<form id="cloud-code" hidden><label>Code from your email<input required name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10"></label>
<button type="submit" class="secondary">Sign in</button></form>
<div id="cloud-actions" hidden><button type="button" id="cloud-import" class="secondary">Copy browser plans to my account</button>
<button type="button" id="cloud-retry" class="secondary">Sync now</button>
<button type="button" id="cloud-logout" class="secondary">Sign out</button></div>
<p role="status" aria-live="polite" id="cloud-status"></p><div id="cloud-conflicts"></div>
</section>`;
