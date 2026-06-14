# `src/pages/Land/Pricing.jsx`

**Location**: `src/pages/Land/Pricing.jsx` (256 lines)

## File Purpose

The "Pricing" section of the landing page. Shows 3 cards (PVC, Wooden, Metal) with their 1/2/3-year plans and animated strikethrough → new price reveal.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `useNavigate` | `react-router-dom` | "Select Plan" navigates to `/getinfo`. |
| `FontAwesomeIcon, faCheck, faArrowRight` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Check + arrow icons. |
| `gsap, ScrollTrigger, useGSAP` | gsap, gsap/ScrollTrigger, @gsap/react | Animation. |

## Exports

### `Pricing` (default)

## Internal Logic

* Three hard-coded arrays: `pvcPlans`, `woodenPlans`, `metalPlans`. Each plan has `duration`, `originalPrice` (strikethrough), `price` (new), and a features list.
* The animation timeline animates `.original-price` (scale 0.6, color change), `.strike-line` (width 0→100%), and `.new-price` (fade in).
* "Select Plan" buttons call `useNavigate('/getinfo')`.

## Pricing snapshot (frontend, not what gets charged)

| Card | 1y | 2y | 3y | Extra card |
|------|----|----|----|------------|
| PVC | 999 | 1199 | 1399 | 150 |
| Wooden | 1499 | 1699 | 1899 | 350 |
| Metal | 2199 | 2349 | 2499 | 850 |

> The Edge Function's `_shared/pricingConfig.ts` uses different numbers (PVC 1199/1399/1599, single 200, Wooden 1299/1499/1699, single 350, **no Metal**). The Metal plan can be ordered from the frontend but is **not handled** by the Edge Function.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* **Pricing drift** between frontend display and Edge Function computation. See `docs/improvements.md`.
* The "Metal Card" plan throws `"Invalid Card Type"` in `create-order` because `_shared/pricingConfig.ts` only has PVC and Wooden.
