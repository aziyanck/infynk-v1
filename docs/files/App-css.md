# `src/App.css`

**Location**: `src/App.css` (118 lines)

## File Purpose

Defines the `poppins-*` utility classes for the Poppins font (weights 100-900 in both normal and italic). Currently only the `LandingPage` imports it (`import '../App.css'`).

## Imports

None.

## Internal Logic

```css
html { scroll-behavior: smooth; }
#root { margin: 0; padding: 0; }
```

Plus 20 utility classes like `.poppins-thin { font-family: "Poppins", sans-serif; font-weight: 100; }`, …, `.poppins-black-italic`, etc.

## Dependencies

* Poppins font is loaded from Google Fonts via `index.html`'s inline `<style>` block.

## Used By

* `src/pages/LandingPage.jsx` (the only file that imports `../App.css`).

## Risks

* Poppins is loaded over the network from `fonts.googleapis.com`, which is a render-blocking external call. The `App.css` file expects it to be available globally. If the network call fails, the `poppins-*` classes will fall back to the browser default sans-serif.
* The class names are never used in the source — the landing page sets font weights via Tailwind utilities (`font-bold`, `font-medium`, etc.). This file is essentially dead code.
