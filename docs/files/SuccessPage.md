# `src/pages/SuccessPage.jsx`

**Location**: `src/pages/SuccessPage.jsx` (41 lines)

## File Purpose

A standalone "Payment Successful" page. **Dead code** — declared in `App.jsx` as a lazy import but never added to the route table. The real success overlay is `components/PaymentSuccess.jsx` (used by `GetInfo.jsx`).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `CheckCircle` | `lucide-react` | The green check icon. |

## Exports

### `PaymentSuccess` (default) — a self-contained success page.

## Internal Logic

* Renders a centred card with a green `CheckCircle`, "Payment Successful!" heading, and a "Go to Home" button that does `window.location.href = "/"`.
* Includes a CSS keyframe for the fade-in animation.

## Dependencies

None.

## Used By

Nothing. Should be deleted.

## Risks

If anyone adds a `<Route path="/success" element={<SuccessPage />} />` it would work, but a hard `window.location.href = "/"` is bad UX (full reload).
