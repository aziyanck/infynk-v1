# `src/pages/Land/About.jsx`

**Location**: `src/pages/Land/About.jsx` (77 lines)

## File Purpose

The "About" section. Short brand story on the left, four stat cards on the right (0.2s scan speed, 256 bit, 24/7 AI, 100% secure).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `gsap, ScrollTrigger, useGSAP` | gsap, gsap/ScrollTrigger, @gsap/react | Animation. |

## Exports

### `About` (default)

## Internal Logic

* Title + paragraph on the left, 2x2 grid of stat tiles on the right.
* Same scroll-triggered reveal pattern as Services / Features.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* Stats are hard-coded; "256 bit" is mislabelled (likely meant "most customizable" per the implementation, not encryption).
