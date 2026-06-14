# `src/pages/Land/NfcAnimation.jsx`

**Location**: `src/pages/Land/NfcAnimation.jsx` (151 lines)

## File Purpose

The animated 3D-style NFC card visual used in the landing page hero. Despite the project importing `three`, `@react-three/drei`, `@react-three/fiber`, and `maath`, this component is implemented with hand-drawn SVG and a GSAP timeline. No actual 3D rendering.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `gsap` | `gsap` | Animation engine. |
| `useGSAP` | `@gsap/react` | Hook. |

## Exports

### `NfcAnimation` (default)

## Internal Logic

* Four refs: `containerRef`, `cardRef`, `phoneContentRef`, `rippleRef`.
* Initial state:
  * Card off-screen (`x: 50, y: 50, rotation: 10, opacity: 0`).
  * Phone content hidden (`opacity: 0, scale: 0.8`).
  * Ripple hidden (`scale: 0, opacity: 0`).
* `useGSAP` timeline (repeating with `repeatDelay: 2`):
  1. Card slides in (`x: -20, y: -20, rotation: -5`).
  2. Card settles (`x: 0, y: 0, scale: 0.95`).
  3. Ripple expands (`scale: 1.5, opacity: 0.5`) and fades out — the "tap" effect.
  4. Phone content scales in (`back.out(1.7)`).
  5. Hold for 1.5 s.
  6. Reverse: content fades out, card flies off.
* Renders an SVG containing a phone body, screen, notch, a profile mockup (avatar, name, buttons), a ripple circle, and the NFC card with chip + wave icons.

## Dependencies

None at runtime beyond GSAP.

## Used By

* `src/pages/LandingPage.jsx`.

## Risks

* Heavy bundle for a small visual (151 lines, but the only function of the file).
* The 3D packages in `package.json` are dead weight given this implementation.
