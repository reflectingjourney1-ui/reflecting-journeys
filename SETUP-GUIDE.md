# Reflecting Journeys — Technical Notes

A static website (plain HTML, CSS and JavaScript, no build step) hosted on
**Netlify**, with an admin panel (**Decap CMS**) at `/admin/`.
Running cost: **$0**. The only paid item is the domain name.

## How it fits together

- **Code** lives in a GitHub repository. Every change pushed to the `main`
  branch is published by Netlify automatically within about a minute.
- **Editable content** (texts, contact details, testimonials, main photos)
  lives in `content/site.json`. The admin panel edits that file; the pages
  read it when they load.
- **Photos uploaded in the admin panel** go to `images/uploads/`.
- **Contact form** submissions are collected by Netlify Forms
  (free plan: 100 per month) and emailed to the address set in
  Netlify → Forms → Form notifications.

## Admin panel login (GitHub)

The admin panel signs in with the site owner's **GitHub account**, using
Netlify's built-in GitHub login. One-time setup:

1. In GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `Reflecting Journeys admin`
   - Homepage URL: the site address, e.g. `https://reflectingjourneys.netlify.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Create it, then **Generate a new client secret**.
2. In Netlify → the site → **Project configuration → Security → OAuth →
   Install provider → GitHub**, paste the Client ID and Client secret.
3. In `admin/config.yml`, `backend.repo` must be `GITHUB_USERNAME/REPOSITORY`.

Then: open `https://SITE-ADDRESS/admin/` → **Login with GitHub** → edit →
**Publish → Publish now**.

## Netlify settings this site relies on

- **Build settings:** build command empty, publish directory `/`.
- **Forms:** form detection **enabled** (Project configuration → Forms).
- **Form notifications:** an email notification to the owner's address.
- Pretty URLs are on by default (`/about` serves `about.html`).

## Changing the site address (e.g. adding the custom domain)

The full site address appears in each page's `<head>` (canonical and
social-preview tags), in `sitemap.xml` and in `robots.txt`. Replace the old
address with the new one in all of them, then publish.

## Images

Content images have pre-sized WebP copies in `images/resp/`
(480/720/960 px wide) referenced by `srcset`. A new photo chosen in the admin
panel replaces the page image directly (full size, no copies).
