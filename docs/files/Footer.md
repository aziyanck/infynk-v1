# `src/pages/Land/Footer.jsx`

**Location**: `src/pages/Land/Footer.jsx` (217 lines)

## File Purpose

The landing page footer. Renders the CTA ("Let's Work Together" + "Start to Tap" button), a 4-column links grid, and a bottom bar with social icons.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useRef, useEffect }` | `react` | State + refs. |
| `useNavigate` | `react-router-dom` | "Start to Tap" navigates to `/getinfo`. |
| `FontAwesomeIcon` + brand/solid icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-brands-svg-icons` + `@fortawesome/free-solid-svg-icons` | Social icons + icons in the contact modal. |
| `gsap, useGSAP` | `gsap`, `@gsap/react` | Modal slide-up animation. |
| `logo` | `../../assets/logo.svg` | Brand mark. |

## Exports

### `Footer` (default)

## Internal Logic

* Hard-coded `socialLinks` (Instagram, LinkedIn, Twitter, Facebook — all `#`).
* Hard-coded `footerLinks` (Product, Company, Legal) with anchor URLs to landing sections and the legal routes.
* `handleLinkClick(e, linkName)` intercepts clicks on the "Contact" link to open the contact modal instead of navigating.
* `closeModal` plays a slide-down + fade-out timeline.
* `useGSAP` plays a slide-up + fade-in timeline whenever `showContact` becomes true.
* The "Contact Us" modal shows `contact@pixiic.com` and `+91 9188802136`.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* Social link `url: '#'` is a placeholder.
* Phone number is hard-coded in two places (`Footer.jsx` and the email template).
