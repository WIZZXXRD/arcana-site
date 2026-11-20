# Arcana — official website v1.0

An owner-approved early **public website preview**, intended for sharing with friends. This is not the commercial launch of the Android app.

A bilingual, dependency-free static website for **Arcana: Tarot & Astrology**, by **Wrong Wizard**. Prepared for `https://wizzxxrd.github.io/arcana-site/`. The Android app is **coming soon**, not publicly available on Google Play.

## Preview locally

Install Node.js (no npm packages required), then run from this directory:

```powershell
npm run preview
```

If PowerShell blocks `npm.ps1`, use `npm.cmd run preview` (and `npm.cmd run build` / `npm.cmd run check`) without changing execution policy.

Open **http://127.0.0.1:4173/arcana-site/**. Press Ctrl+C to stop. This deliberately serves the GitHub Pages subdirectory. HTML can also be opened directly, but HTTP preview is recommended for language storage and realistic navigation. No account service or credentials are needed.

The HTML is already generated and can be hosted without Node or a build step. To edit copy/layout, update the sources and regenerate:

```powershell
npm run build
npm run check
```

`npm run build` overwrites the eight localized HTML pages, `robots.txt` and `sitemap.xml`. CSS, JavaScript and SVG/PNG files are authored assets. Do not edit generated HTML alone.

## File inventory

| Files | Purpose |
| --- | --- |
| `index.html`, `ru/index.html` | English/Russian landing pages |
| `privacy.html`, `ru/privacy.html` | Implementation-based privacy review drafts |
| `terms.html`, `ru/terms.html` | Terms review drafts |
| `account-deletion.html`, `ru/account-deletion.html` | Public informational deletion pages; no request form |
| `404.html` | Bilingual GitHub Pages error page |
| `assets/site.css` | Responsive Cosmic Night design, focus/reduced-motion/print styles |
| `assets/site.js` | Browser-language detection, saved language preference, palette preview |
| `assets/tarot.svg`, `assets/favicon.svg` | Original website artwork and brand mark |
| `assets/social.svg`, `assets/social.png` | Original social sharing artwork, vector and 1200×630 raster |
| `scripts/content.mjs` | EN/RU landing-page copy |
| `scripts/legal-en.mjs`, `scripts/legal-ru.mjs` | EN/RU legal/deletion copy |
| `scripts/build.mjs` | Deterministic HTML template and sitemap generator (copyright year uses UTC year) |
| `scripts/preview.mjs` | Loopback-only, allowlisted static preview server |
| `scripts/check.mjs` | Link/anchor, metadata, translation and credential-pattern checks |
| `scripts/browser-check.mjs` | Optional real Chromium QA; no test dependencies |
| `docs/PRODUCTION_HANDOFF.md` | Legal/operator and deletion integration requirements |
| `docs/QA.md` | Verification evidence and remaining review |
| `package.json` | Convenience commands; zero dependencies |
| `.gitignore`, `.nojekyll`, `robots.txt`, `sitemap.xml` | Repository/Pages/search configuration |

## Design and accessibility

Cosmic Night: midnight navy, quiet violet atmosphere, muted gold linework and large editorial serif headings. Original SVG card artwork is a website illustration, explicitly distinguished from in-app cards. No Android source or Tarot artwork is copied. System fonts avoid font-service requests. Sections cover Tarot, astrology, numerology, daily ritual, Explore, local Journal, all three app themes and Premium.

The site uses static semantic HTML, native links and FAQ disclosures, a skip link, visible focus, accessible theme buttons and a live palette label. The header stays reachable without a mobile menu. All eight main pages have localized titles, descriptions, canonical and language-alternate URLs, Open Graph metadata, and one primary heading. Layout adapts from 320px upward. Reduced motion and text enlargement are supported. No animation loop, dependencies, database, forms, analytics, ad trackers, APIs or API keys.

Language links preserve the page type. The neutral English home entry selects Russian when the saved preference or supported browser language is Russian; otherwise English. Explicit translated/legal URLs remain stable, including browser back/forward. The switch saves `arcana-site-language` locally; blocked storage is handled. Without JavaScript, both languages and all content/navigation still work.

## Publish on GitHub Pages (manual)

1. For the public website preview, keep all draft notices and unavailable web-deletion disclosures visible. Complete the requirements in `docs/PRODUCTION_HANDOFF.md` before the Android app production release; preview publication is not legal approval or a complete web deletion service.
2. Run `npm run build` and `npm run check`; review both languages and responsive previews. Optional: `node scripts/browser-check.mjs` with an installed Chromium browser. Review `git diff` and `git status`; `.vs/` and `.qa/` are ignored.
3. With owner authorization, commit and push the reviewed files to **WIZZXXRD/arcana-site** on `main`. This public preview release explicitly authorizes that commit and push.
4. In the repository's **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/ (root)**, and save. `.nojekyll` enables direct static publishing. No workflow, secrets or cloud infrastructure are required.
5. After Pages reports publication, check `https://wizzxxrd.github.io/arcana-site/` and every EN/RU legal/deletion URL, switch language, and test reload/back/forward on mobile. GitHub Pages availability and account settings are external and have not been changed by this implementation.
6. Only after publication and acceptance, configure the Android public URLs through its separate approved release process: `ARCANA_PRIVACY_POLICY_URL`, `ARCANA_TERMS_URL`, `ARCANA_ACCOUNT_DELETION_URL`. This task does not edit Android configuration.

All ordinary navigation/assets are relative to their document. The 404 page uses the explicit `/arcana-site/` deployment prefix because GitHub may serve it at arbitrary missing paths. Canonical/social/sitemap URLs intentionally use the supplied production host; change the `origin` in `scripts/build.mjs` if the destination changes. `robots.txt` is included, although crawlers ordinarily discover robots rules only at the host root; the project sitemap and page metadata remain available under the project path.

## Factual sources and precedence

Reference: the separate, private Android project (not included in this repository). Source document names: `ARCANA_SPEC.md`, `docs/PHASE6_PRODUCT_POLISH_AND_JOURNAL.md`, `docs/PHASE7_PRODUCTION_READINESS.md`, `docs/PHASE7_5_GOOGLE_AUTH_AND_PREMIUM_RECOVERY.md`, `docs/PRIVACY_POLICY_DRAFT.md`, `docs/TERMS_OF_SERVICE_DRAFT.md`, `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md`. The November 20, 2026 Phase 7.5 account model supersedes historical guest access and installation-bound recovery claims in Phase 7. Drafts describe implementation, not deployed production certification. No secret/configuration/private-source files are copied into this website.
