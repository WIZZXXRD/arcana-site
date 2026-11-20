# Website QA — v1.0

Initial local verification and public-preview release checks: 2026-11-21. The owner authorized committing and pushing the website preview. No cloud infrastructure deployment or Android modifications are part of this release.

## Executed checks

- `npm run build`: regenerates all eight localized HTML pages and the sitemap.
- `npm run check`: validates all eight pages and 228 local links, image/script/style references and fragment targets; one H1 and language tag per page; canonical, alternate-language and social metadata; no forms, remote script/image embeds or unresolved copy; EN/RU key, list and legal-section parity; common credential patterns and sensitive file extensions. Also validates the social PNG signature and 1200×630 dimensions. This is a candidate scan of current website files, not a security audit of Git history.
- `node scripts/browser-check.mjs`: actual installed headless Chromium, using the loopback preview at `/arcana-site/`. No browser packages or API keys. The harness uses a temporary isolated profile, hidden process and `--no-sandbox` because the Windows execution sandbox prevented the test renderer from responding with the browser's additional sandbox enabled. It visits only local website resources. The browser and preview server are stopped when the run finishes.
- All eight pages rendered at **320, 360, 768 and 1440 CSS pixels**, with no horizontal document overflow or broken images. Lazy images are explicitly decoded for this check.
- All eight pages reflowed at **200% base text size** on a 390px viewport. Enlarged Russian legal navigation and grid widths were corrected after the initial run exposed overflow.
- Actual keyboard activation of the native FAQ, keyboard Tab to the visible skip link, and a nonempty focus outline.
- Theme-preview controls change the palette and maintain one pressed state; live label updates. Without JavaScript, the palette is static and the inactive controls are hidden.
- Reduced-motion preference disables smooth scrolling. No looping animation exists.
- Language switch preserves the corresponding legal page and saves the language choice. Russian browser-language detection at the neutral home, explicit English choice, browser back/forward and denied local-storage handling passed.
- All pages retain their HTML content and links with JavaScript disabled.
- HTTP 200 for all eight page paths; HTTP 404 with bilingual content for a missing page in the preview server.
- **Zero website console/runtime errors and zero external website network requests** during the browser checks. The social-vector rasterization occurs before website logging begins; raw SVG viewing can cause a browser-generated host-root favicon request, independent of the HTML pages, which each declare their favicon.
- Original desktop and mobile screenshots reviewed: landing hero, daily ritual, Journal, theme preview, desktop Privacy and mobile Russian deletion page. The initial intrinsic image-height problem was corrected before final review.

The browser harness saves local screenshots to ignored `.qa/` and regenerates `assets/social.png` from the original SVG. It leaves its isolated disposable profile under the OS temporary directory. The website has no runtime or build dependencies. The social image is about 54 KB; the initial page does not load it as a visible asset.

## Limits and final release review

This is browser-engine and screenshot QA, not a full WCAG conformance certification or a human screen-reader audit. Physical phones/tablets, Safari/Firefox, high-contrast mode, assistive technology and independent Russian/English editorial review should be included in release acceptance. Focus and contrast styling are implemented; exhaustive automated contrast analysis was not run.

Local checks verify the GitHub Pages subdirectory layout. Public hosting settings and deployment must be checked separately after the authorized preview push. After manual publication, recheck paths, error handling, metadata/social previews, both locales, storage preferences and navigation on the actual host. External Google/GitHub policy and Play management links are explicit third-party destinations; the site does not load their content until a visitor follows a link.

Legal drafts and the external authenticated deletion flow remain pending. See `PRODUCTION_HANDOFF.md`. No legal approval, deployed OAuth/billing/deletion acceptance or complete Play compliance is claimed.

## Public preview publication audit

All 30 publication files were checked against an explicit website allowlist. No email address, private checkout/user path, credential candidate or Android artifact was found in the publication set. Private checkout and IDE-state details were removed from documentation. A visible EN/RU public-preview notice was added to every main page. Legal draft notices, app coming-soon language and the unavailable authenticated web-deletion disclosure remain visible. IDE state, QA captures, environments, local configuration and credential-file patterns are ignored. The final release reruns the build, static checks and full local browser matrix; only the allowlisted website files are staged. Public preview approval does not approve legal drafts or complete the deletion service.
