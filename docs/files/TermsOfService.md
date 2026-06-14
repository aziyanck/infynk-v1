# `src/pages/legal/TermsOfService.jsx`

**Location**: `src/pages/legal/TermsOfService.jsx` (112 lines)

## File Purpose

Static Terms of Service page (7 sections covering user agreement, ordering, payment, refund, user responsibilities, data access, contact).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `Link` | `react-router-dom` | Brand link. |

## Exports

### `TermsOfService` (default)

## Internal Logic

* Pure markup. Mentions a ₹300/yr renewal cost (different from the dashboard / pricing).

## Used By

* `src/App.jsx` (lazy-loaded at `/terms-of-service`).

## Risks

* The "Subscription & Pricing" section states a ₹300/yr renewal cost, but the Terms of Service itself also says "After the first order, users can renew their profile access for ₹300 per year". The actual product catalogue in `Pricing.jsx` shows different renewal figures.
