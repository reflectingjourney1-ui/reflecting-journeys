// Admin panel login, step 1 of 2 (Cloudflare Pages Function at /api/auth).
// Sends the editor to GitHub to approve access, remembering a one-time `state`
// value in a cookie so the reply can be checked in /api/callback.
//
// Settings (Cloudflare → this project → Settings → Variables and Secrets):
//   GITHUB_CLIENT_ID      the GitHub OAuth app's Client ID
//   GITHUB_CLIENT_SECRET  the GitHub OAuth app's client secret (type: Secret)

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();

  const github = new URL('https://github.com/login/oauth/authorize');
  github.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  github.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  github.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
  github.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store',
    },
  });
}
