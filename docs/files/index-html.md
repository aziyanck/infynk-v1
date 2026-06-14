# `index.html`

**Location**: `index.html`

## File Purpose

Vite's HTML entry point. The browser loads this first; it sets up the document, fonts, favicon, meta tags, and then injects the React bundle via the `<script type="module" src="/src/main.jsx">` tag.

## Imports

None. Pure HTML with inline CSS and meta tags.

## Internal Logic

* `<style>` — imports Poppins from Google Fonts. Poppins is used by the brand classes in `src/App.css`.
* `<meta name="description">` — describes the product for SEO and link previews.
* `<meta name="keywords">` — SEO keywords.
* `<link rel="icon" type="image/svg+xml" href="/src/assets/logo-favicon.svg">` — the favicon. Note: the file path is `/src/...` (not `/public/...`); Vite resolves it.
* `<title>Pixiic</title>` — page title.
* `<div id="root">` — the React mount point.
* `<script type="module" src="/src/main.jsx">` — the actual JS entry that bootstraps React.

## Dependencies

* Reads `src/assets/logo-favicon.svg` at runtime.
* Loads `src/main.jsx` as an ES module.
* Loads the `Poppins` font from Google Fonts (external network call).

## Used By

The browser, indirectly. Every page in the SPA renders inside the `#root` div defined here.

## Risks

* The Google Fonts import is a render-blocking network call. Replacing it with a self-hosted font (or `font-display: swap`) would improve performance.
* The description / keywords are static, but several pages (legal) would benefit from per-page `<title>` and `<meta>` (currently the SPA changes them at runtime via React, but search engines may not see the latest).
