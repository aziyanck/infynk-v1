# `src/components/PaymentSuccess.jsx`

**Location**: `src/components/PaymentSuccess.jsx` (167 lines)

## File Purpose

The full-screen payment status overlay used by `GetInfo.jsx`. Handles four states: `verifying`, `success`, `failed`, `payment_success_user_failed`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef }` | `react` | Refs. |
| `useGSAP` | `@gsap/react` | Hook. |
| `gsap` | `gsap` | Animation. |
| `Loader2, CheckCircle, XCircle, MessageCircle` | `lucide-react` | Icons. |
| `useNavigate` | `react-router-dom` | Imported but **not used**. |

## Exports

### `PaymentSuccess` (default)
Props: `status` ('verifying' | 'success' | 'failed' | 'payment_success_user_failed'), `userData` ({ name, email, paymentId }).

## Internal Logic

* `useGSAP` runs a fade-in + scale-up timeline on the card on mount.
* Renders a different body for each `status`:
  * `verifying` → blue spinner + "Verifying" + "Please wait while we secure your payment…"
  * `success` → green check + "Payment Verified" + a "Design My Card" WhatsApp button.
  * `failed` → red X + "Verification Failed" + "Try Again" button (reloads the page).
  * `payment_success_user_failed` → orange message icon + "Action Required" + "Contact Support" WhatsApp button.
* `handleWhatsAppRedirect` builds a pre-filled `wa.me` URL to `9188802136`.

## Used By

* `src/pages/GetInfo.jsx`.

## Risks

* `useNavigate` is imported but never used.
* The `failed` reload is a hard `window.location.reload()` which loses form data.
