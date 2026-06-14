# `src/assets/logo.svg`

**Location**: `src/assets/logo.svg` (25 lines, 446.54 × 115.33 viewBox)

## File Purpose

The horizontal "PIXII" wordmark — the 5 letterforms (P, I, X, I, I) drawn as filled paths in `#f3f4f4` (off-white). The "X" is constructed from rotated rounded rectangles, evoking stacked NFC cards.

## Used By

* `src/landing-components/Navbar.jsx` (top of the page, white-on-dark background).
* `src/components/Footer.jsx` (Contact modal and footer logo).

## Risks

* Color is hard-coded as `#f3f4f4`. The asset is invisible on a white surface; do not embed on a white card without inverting the fill.
* The filename is a single word; ensure Vite's asset hashing does not change the import path.
