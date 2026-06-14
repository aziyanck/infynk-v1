# `src/pages/Land/Services.jsx`

**Location**: `src/pages/Land/Services.jsx` (112 lines)

## File Purpose

The "Services" section of the landing page. A static list of 5 services with scroll-triggered reveal animation.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `FontAwesomeIcon, faArrowRight` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Right arrow on hover. |
| `gsap, ScrollTrigger` | `gsap`, `gsap/ScrollTrigger` | Animation. |
| `useGSAP` | `@gsap/react` | Hook. |

## Exports

### `Services` (default)

## Internal Logic

* `services` is a hard-coded array of 5 items: Instant Sharing, Custom Design, Real-time Updates, Custom Colour, AI Assistant.
* GSAP timeline triggered when the section scrolls into view (`start: "top 70%"`):
  * Title children slide up + fade in.
  * List children stagger in.
* Each row has an id, title, description, and a hover-revealed arrow icon.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* Hard-coded copy; no CMS / i18n.
