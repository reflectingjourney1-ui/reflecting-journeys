# Reflecting Journeys — Technical Notes

A static website (plain HTML, CSS and JavaScript, no build step) hosted on
**Netlify**, with an admin panel (**Decap CMS**) at `/admin/`.
Running cost: **$0**. The only paid item is the domain name.

## How it fits together

- **Code** lives in a GitHub repository. Every change pushed to the `main`
  branch is published by Netlify automatically within about a minute.
- **Editable content** (texts, contact details, testimonials, main photos)
  lives in `content/` — one small file per admin-panel section (contact, home,
  services, about, testimonials, cta, photos). The admin panel edits those
  files; `script.js` reads them when a page loads.
- **Photos uploaded in the admin panel** go to `images/uploads/`.
- **Contact form** messages are sent by **Web3Forms** (free) straight to
  reflectingjourney1@gmail.com. The form's access key is in `contact.html`;
  manage it at web3forms.com (log in with that Gmail). If the site moves to a
  new domain, add it in the form's settings there.

## Admin panel login (GitHub)

The admin panel signs in with the site owner's **GitHub account**, using
Netlify's built-in GitHub login. One-time setup:

1. In GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `Reflecting Journeys admin`
   - Homepage URL: the site address, e.g. `https://reflecting-journeys.netlify.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Create it, then **Generate a new client secret**.
2. In Netlify → the site → **Project configuration → Security → OAuth →
   Install provider → GitHub**, paste the Client ID and Client secret.
3. In `admin/config.yml`, `backend.repo` must be `GITHUB_USERNAME/REPOSITORY`.

Then: open `https://SITE-ADDRESS/admin/` → **Login with GitHub** → edit →
**Publish → Publish now**.

## Netlify settings this site relies on

- **Build settings:** build command empty, publish directory `/`.
- Pretty URLs are on by default (`/about` serves `about.html`).

## Changing the site address (e.g. adding the custom domain)

The full site address appears in each page's `<head>` (canonical and
social-preview tags), in `sitemap.xml` and in `robots.txt`. Replace the old
address with the new one in all of them, then publish.

## Images

Content images have pre-sized WebP copies in `images/resp/`
(480/720/960 px wide) referenced by `srcset`. A new photo chosen in the admin
panel replaces the page image directly (full size, no copies).

## Why the repository is public

The site is hosted on a free Netlify team. On free plans Netlify only publishes
changes to a *private* repository when they come from the team's own Git
account; a *public* repository has no such limit. Keeping the repository public
lets every edit made in the admin panel go live. It contains no passwords or
keys (the admin-login secret is stored only in Netlify).
