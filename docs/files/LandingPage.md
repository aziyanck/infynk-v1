# `src/pages/LandingPage.jsx`

**Location**: `src/pages/LandingPage.jsx` (136 lines)

## File Purpose

The marketing landing page. The only page that is *eagerly* loaded (it's the entry URL `/`).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | JSX + `useRef` for the animation scopes. |
| `useNavigate` | `react-router-dom` | "Get Started" / "Sign In" / "Order Now" buttons navigate via `useNavigate`. |
| `FontAwesomeIcon` | `@fortawesome/react-fontawesome` | Renders the arrow icon next to "Order Now". |
| `faArrowRight` | `@fortawesome/free-solid-svg-icons` | The right arrow. |
| `gsap` | `gsap` | Animation engine. |
| `useGSAP` | `@gsap/react` | Hook that registers the cleanup on unmount. |
| `ScrollTrigger` | `gsap/ScrollTrigger` | Used by the other Land sections (registered here, hoisted via module-scope `gsap.registerPlugin`). |
| `NfcAnimation` | `./Land/NfcAnimation` | The animated 3D card visual. |
| `Services` | `./Land/Services` | Services section. |
| `Features` | `./Land/Features` | Features section. |
| `Pricing` | `./Land/Pricing` | Pricing section. |
| `About` | `./Land/About` | About section. |
| `Footer` | `./Land/Footer` | Footer. |
| `Chatbot` | `../components/Chatbot` | Floating chatbot. |
| `logo` | `../assets/logo.svg` | The brand mark in the header. |
| `../App.css` | `src/App.css` | Loads the Poppins utility classes. |

## Exports

### `LandingPage` (default)
A functional component.

## Internal Logic

* **Refs** for the animation scope: `containerRef`, `heroTextRef`, `cardRef`.
* **`handleNavigation`** — navigates to `/getinfo`.
* **`useGSAP` timeline** — runs on mount, scoped to `containerRef`:
  * Animate each child of `heroTextRef.current` (`y: 100, opacity: 0 → 0/1`, stagger 0.1, ease `power4.out`).
  * Animate `cardRef.current` (`scale: 0.8, opacity: 0 → 1, ease: power3.out`), starting 1 s before the text animation ends.
* **Structure**:
  * Fixed-position `mix-blend-difference` header with logo, anchor nav (`#services`, `#features`, `#pricing`, `#about`), Sign In button (`/user`), and Get Started button.
  * Hero section with the giant "DIGITAL IDENTITY" typography on the left and the 3D NFC animation on the right.
  * Renders each section in order: `Services`, `Features`, `Pricing`, `About`, `Footer`, `Chatbot`.

## Dependencies

* All Land sections.
* `components/Chatbot`.
* `assets/logo.svg`.

## Used By

* `src/App.jsx` (eager-loaded at `/`).

## Risks

* GSAP `ScrollTrigger` is registered here even though the landing page itself doesn't use it. The other Land sections call `gsap.registerPlugin(ScrollTrigger)` themselves — a duplicate but harmless.
* The Poppins font is loaded via `App.css` (network call) — see `docs/improvements.md` for the perf impact.
