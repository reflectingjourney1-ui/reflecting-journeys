// Admin panel login, step 2 of 2 (Cloudflare Pages Function at /api/callback).
// GitHub sends the editor back here with a one-time code. We check `state`,
// swap the code for an access token, and hand the token to the admin panel
// window that opened this popup (the standard Decap CMS popup handshake).

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)cms_oauth_state=([^;]+)/);

  if (!code || !state || !cookie || cookie[1] !== state) {
    return reply('error', { message: 'Login expired or was interrupted. Please close this window and try again.' }, url.origin);
  }

  let data;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'reflecting-journeys-cms' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    data = await res.json();
  } catch {
    return reply('error', { message: 'Could not reach GitHub. Please try again.' }, url.origin);
  }

  if (!data || !data.access_token) {
    return reply('error', { message: (data && data.error_description) || 'GitHub did not approve the login.' }, url.origin);
  }
  return reply('success', { token: data.access_token, provider: 'github' }, url.origin);
}

// Posts the result to the admin window (same site only), then closes the popup.
function reply(status, content, origin) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head>
<body style="font-family:system-ui,sans-serif;padding:2rem;color:#333">
<p>${status === 'success' ? 'Signed in. You can close this window.' : escapeHtml(content.message)}</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  var message = ${JSON.stringify(message)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(message, origin);
    window.removeEventListener('message', receive);
    ${status === 'success' ? 'setTimeout(function () { window.close(); }, 300);' : ''}
  }
  if (!window.opener) return;
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`;
  return new Response(html, {
    status: status === 'success' ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'cms_oauth_state=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
