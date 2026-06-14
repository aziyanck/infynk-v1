# `src/pages/GetInfo.jsx`

**Location**: `src/pages/GetInfo.jsx` (584 lines)

## File Purpose

The order intake form + Razorpay checkout. Collects name, email, phone, address, plan, card type, qty, account type, and company. Drives the entire purchase flow: `create-order` → Razorpay → `verify-payment`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useRef }` | `react` | State + refs. |
| `PhoneInput` | `react-phone-number-input` | International phone input with flag/dial code. |
| `react-phone-number-input/style.css` | same | Default styles. |
| Many `lucide-react` icons | `lucide-react` | CreditCard, User, Mail, MapPin, Building2, Loader2, ArrowLeft, ChevronDown. |
| `gsap` | `gsap` | Animation engine. |
| `useGSAP` | `@gsap/react` | Hook. |
| `supabase` | `../supabaseClient` | `functions.invoke` to call Edge Functions. |
| `PaymentSuccess` | `../components/PaymentSuccess` | Overlay. |
| `logo` | `../assets/logo.svg` | Header logo. |

## Exports

### `GetInfo` (default)

## Constants

```js
const RAZORPAY_KEY_ID = "rzp_live_SWWEjjUiISx5no";

const PRICING_CONFIG = {
  "PVC Card":       { plans: { 1_year: 999,  2_year: 1199, 3_year: 1399 }, single_item: 150 },
  "Wooden Card":    { plans: { 1_year: 1499, 2_year: 1699, 3_year: 1899 }, single_item: 350 },
  "Metal Card":     { plans: { 1_year: 2199, 2_year: 2349, 3_year: 2499 }, single_item: 850 },
};
```

> **Note**: The Edge Function's `_shared/pricingConfig.ts` has *different* numbers (PVC 1199/1399/1599 + single 200, Wooden 1299/1499/1699 + single 350). The frontend's table is what the user sees; the Edge Function's table is what gets charged. They are out of sync.

## Internal State

| State | Purpose |
|-------|---------|
| `fullName, email, phoneNumber, address, accountType, companyName` | Form fields. |
| `planDuration, cardType` | Selected plan + material. |
| `loading` | True while waiting for `create-order` or Razorpay SDK. |
| `paymentStatus` | `'idle' | 'verifying' | 'success' | 'failed' | 'payment_success_user_failed'`. |
| `paymentData` | `{ orderId, paymentId }` from Razorpay. |
| `qty, totalAmount` | Quantity and computed total. |

## Internal Logic

### Total calculation
```js
React.useEffect(() => {
  const cfg = PRICING_CONFIG[cardType] || PRICING_CONFIG["PVC Card"];
  const planPrice = cfg.plans[planDuration] || 0;
  const extraQty = Math.max(0, qty - 1);
  const extraCardPrice = cfg.single_item * extraQty;
  setTotalAmount(planPrice + extraCardPrice);
}, [planDuration, qty, cardType]);
```

### `loadRazorpay(src)`
Injects `<script src="https://checkout.razorpay.com/v1/checkout.js">` and resolves `true` on load or `false` on error.

### `handlePayment()`
1. Validates that name, email, phone are set.
2. `supabase.functions.invoke("create-order", { body: { planName, qty, cardType } })`.
3. `loadRazorpay(...)`; throw if it fails.
4. Build the `options` object with `key`, `amount`, `currency`, `order_id`, `handler`, `prefill`, `notes`, `theme.color = getComputedStyle(...).--brand-color || #2563eb`.
5. Open the Razorpay modal; the `handler` calls `setPaymentStatus('verifying')`, then `supabase.functions.invoke("verify-payment", { body: { razorpay_*, userData } })`.
6. If `verifyData.success === true` → `'success'`; if `paymentVerified && !success` → `'payment_success_user_failed'`; else → `'failed'`.
7. Subscribe to `payment.failed` to alert and mark `'failed'`.

### `handleFormSubmit(e)`
Trivial wrapper that prevents default and calls `handlePayment` when not already loading.

### Overlay
When `paymentStatus !== 'idle'`, render `<PaymentSuccess status paymentData userData />` as a full-screen overlay.

## Dependencies

* `components/PaymentSuccess`.
* `supabaseClient` → `functions/v1/create-order` and `functions/v1/verify-payment`.
* `https://checkout.razorpay.com/v1/checkout.js` (browser SDK).

## Used By

* `src/App.jsx` (lazy-loaded at `/getinfo`).

## Risks

* **Frontend / backend price mismatch** (see constants above). The user is shown one price and charged a different one.
* `Razorpay` is loaded live from the CDN — the page fails if the user is offline or if the CDN is blocked.
* The hard-coded Razorpay key in source should be replaced by an env var (`VITE_RAZORPAY_KEY_ID`).
* `paymentStatus = 'failed'` does not have a dedicated overlay branch in `PaymentSuccess`; actually it does — the `failed` block shows an X icon and a Try Again button. (Verified by reading `PaymentSuccess.jsx`.)
* The `Razorpay` script is added to `document.body` and **never removed** after success.
