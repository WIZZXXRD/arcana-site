# ARCANA — Brand identity v1.0

**Approved direction:** Arcana logotype and geometric gold emblem from the official Cosmic Night website header (21 November 2026). Brand attribution: Wrong Wizard.

## Canonical appearance

- **Emblem:** Fine-line golden triangular symbol, concentric circle/crosshair motif. The existing `assets/favicon.svg` is the original site reference.
- **Wordmark:** Uppercase `ARCANA`, elegant serif, deliberately spaced; keep the visual proportions and calm editorial treatment of the public website header.
- **Website typography:** `Georgia, "Times New Roman", serif`; size `1.65rem`, `letter-spacing: .19em`, normal weight. This is the original live-site styling and should **not** be silently restyled.
- **Gold accents:** `#D8BB82` (emblem), `#D9BD87` (site accent).
- **Wordmark:** `#F3EFE8`; **Cosmic Night background:** `#0B1020`.
- **Layout:** Symbol left, uppercase wordmark right; maintain comfortable negative space. Do not stretch, squash, add glow, gradients, or extra ornament.

## Reusable assets

- `arcana-symbol.svg` — transparent-background standalone symbol, based on the exact geometry of the original favicon; for avatars and small icons.
- `arcana-lockup.svg` — complete vector lockup. All letters are **outlined SVG paths**, so it renders without font installation or downloaded font files.

**Typeface note:** The current website header uses Georgia (system font). To avoid bundling or redistributing proprietary font files, the outlined SVG wordmark uses a closely matched open-font serif (Liberation Serif) rather than literal Georgia glyph outlines. Treat the existing site header screenshot as the typographic appearance reference, and visually approve any logo replacement before altering the live website.

## Rules across website and Android

1. Preserve the current website header and footer appearance. This package only adds reusable assets and does **not** replace working navigation.
2. On Android, use the emblem alone for adaptive launcher icon, notification-scale marks and other tiny sizes; use complete horizontal lockup where the text remains legible.
3. Reproduce the dark/gold palette and sufficient contrast on Splash, Google Sign-In, Premium and Play Store promotional art; keep accessibility and responsive behavior.
4. Never use website branding to claim that the Android app is publicly released before it actually is.
5. Do not place text on an Android adaptive icon at small sizes. Respect mask/safe area and test on a physical device.
6. Keep brand assets versioned in both repositories. Changes to geometry, wordmark, colors or type require deliberate design review.
7. Do not commit font files, secret configuration, credentials or paid/proprietary artwork to the public site.

**Status:** Visual direction approved. Website behavior and Android build artifacts unchanged by this brand-source checkpoint. Android UI integration should receive its normal build/accessibility tests before release.
