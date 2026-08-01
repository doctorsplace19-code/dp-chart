# WorkOccMed — workoccmed.com

The public marketing website for **WorkOccMed** (a Doctors Place company):
DOT physicals, drug & alcohol testing, and occupational-health compliance,
nationwide.

This is a **static website** — hand-authored HTML/CSS/JS with a set of Node.js
build scripts that generate the location and guide pages. There is **no
application framework** (no React/Next/Vue) and **no backend** in this project.
It deploys as static files to Vercel.

---

## 1. Tech stack

| Item | Detail |
|---|---|
| Type | Static HTML/CSS/JS (no framework) |
| Styling | Inline CSS + Google Fonts (Inter; the `/preview` redesign uses Plus Jakarta Sans) |
| Build tooling | Plain Node.js scripts (Node ≥ 18). **No npm dependencies.** |
| Hosting | Vercel (static deployment) |
| Analytics | Google tag (gtag.js) + Google Ads conversion tag, inline in each page `<head>` |
| Maps | Google Maps JavaScript API (find-a-location page) |

There is **no `node_modules`** — the build scripts use only Node built-ins
(`fs`, `path`, etc.). `package.json` exists to expose the build scripts; its
dependency lists are intentionally empty, so there is no lockfile.

---

## 2. Project structure

```
/                         repo root (static site)
├── index.html            homepage
├── dot-physical.html     service & guide pages (hand-authored)
├── drug-test.html
├── consortium.html
├── return-to-duty.html
├── find-a-location.html  uses Google Maps JS API
├── guides.html, *.html   guides / SEO content
├── preview.html          design preview of a redesigned homepage (noindex)
├── states/               50 generated state pages
├── cities/               550 generated city pages
├── newsletter/           newsletter page(s)
├── images/               photos, icons
├── robots.txt
├── sitemap.xml           generated
├── search-index.json     generated (title/description/URL of every page)
├── search.html           client-side site search (reads search-index.json)
├── vercel.json           Vercel config: clean URLs, redirects, security headers
├── .vercelignore         excludes build scripts from the deployed output
│
├── geo-facts.js          per-state / per-city data used by the generator
├── generate-state-pages.js   generates states/*.html AND cities/*.html
├── generate-guides.js        generates guide pages
├── generate-search-index.js  writes search-index.json
├── generate-sitemap.js       writes sitemap.xml
├── enhance-city-seo.js       in-place SEO pass over cities/*.html
├── apply-megamenu.js         nav mega-menu helper
├── package.json
├── .env.example
└── README.md
```

---

## 3. Install / run / build / deploy

### Install
Nothing to install — no dependencies. You only need **Node ≥ 18** for the build
scripts and any static file server to preview.

```bash
git clone <repo-url>
cd workoccmed
```

### Run locally (preview)
Serve the folder with any static server, e.g.:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

(Or `npx serve .`) Because the live site uses clean URLs, open pages without the
`.html` on the live host; locally you may need the `.html` suffix.

### Build (regenerate generated pages)
Run these after editing `geo-facts.js` or the generator templates. They rewrite
the generated files in place:

```bash
npm run build          # states + cities + guides + search index + sitemap
# or individually:
npm run build:states   # states/*.html + cities/*.html
npm run build:guides   # guide pages
npm run build:search   # search-index.json
npm run build:sitemap  # sitemap.xml
```

> Note: several page HTML files have been **hand-edited after generation**
> (e.g. the legal footer). Re-running the generator will overwrite those edits,
> so reconcile the generator templates before a full regenerate.

### Deploy (Vercel)
The site is a static deployment. Any push to the connected Git branch triggers a
Vercel build that simply serves the files (no build command needed).

```bash
# via Git (recommended): push to the connected branch → Vercel auto-deploys
git push origin main

# or via Vercel CLI:
npx vercel        # preview
npx vercel --prod # production
```

`vercel.json` handles clean URLs (`/dot-physical` → `dot-physical.html`),
redirects (e.g. `/order` → the portal), and security response headers.
`.vercelignore` keeps the Node build scripts out of the served output.

---

## 4. External services & integrations

This static site has **no backend of its own**. It relies on:

| Service | Where | Purpose |
|---|---|---|
| **portal.dot-physical.net** (separate Next.js app) | `/order`, `/sign-in`, form POSTs | Ordering, client/employer portal, and the APIs the forms submit to |
| **Google Maps JavaScript API** | find-a-location.html | Location search / map (key is inline; restrict by referrer) |
| **Google tag (gtag.js) + Google Ads** | every page `<head>` | Analytics + conversion tracking |
| **Google Fonts** | every page | Web fonts |

### Forms that require a backend
All forms POST to the **portal** (portal.dot-physical.net) — this repo contains
no form handlers:

- **Corporate invoicing** (`corporate-invoicing.html`) → portal contact API
- **Newsletter / blog subscribe** (`newsletter/`) → portal `blog-subscribe` API
- **Find a Location** (`find-a-location.html`) → Google Maps API (client-side)

Ordering, sign-in, and the employer/partner portal all live in the separate
portal application; this site only links to them.

---

## 5. Answers to the handover questions

1. **Framework & version:** None — static HTML/CSS/JS. Build scripts run on
   Node ≥ 18 with no npm dependencies.
2. **Where the source lives:** a Git repository (this folder is the
   `doctors-place/workoccmed` path within a larger monorepo). See §3.
3. **Connected to GitHub:** Yes — the repo is hosted on GitHub and Vercel
   deploys from it.
4. **Serverless functions / DBs / external services:** This site has **none of
   its own**. External services it depends on: the portal app
   (portal.dot-physical.net), Google Maps, Google Analytics/Ads, Google Fonts.
5. **Features needing backend services:** ordering, sign-in, the portal, and the
   three forms above — all handled by the portal app, not this repo.
6. **Live Vercel deployment tied to this codebase:** Yes — the production
   Vercel project for workoccmed.com deploys from this repository/branch.

---

## 6. Notes for the next developer

- **Security:** the Google Maps API key is inline in `find-a-location.html` and
  must be restricted by HTTP referrer in Google Cloud Console. `vercel.json`
  already sets HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and a baseline CSP.
- **Large asset:** `images/wom-provider.png` (~4 MB) should be compressed before
  wide use on production pages.
- **The `/preview` page** is a noindex homepage-redesign mockup, not the live
  homepage.
