# `src/pages/Land/Features.jsx`

**Location**: `src/pages/Land/Features.jsx` (97 lines)

## File Purpose

The "Features" section of the landing page. Highlights 4 features in a 2x2 grid with the same scroll-triggered reveal animation pattern.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `FontAwesomeIcon` + 4 icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-brands-svg-icons` + `@fortawesome/free-solid-svg-icons` | Section icon. |
| `gsap, ScrollTrigger, useGSAP` | gsap, gsap/ScrollTrigger, @gsap/react | Animation. |

## Exports

### `Features` (default)

## Internal Logic

* `features` — array of 4 items (NFC Tech, Lightning Fast, Secure, Universal).
* Same animation pattern: title stagger, then grid items stagger.
* Layout: left column has the title and a tagline, right column is the 2x2 grid.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

None.
