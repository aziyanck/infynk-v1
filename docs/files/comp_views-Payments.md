# `src/components/comp_views/Payments.jsx`

**Location**: `src/components/comp_views/Payments.jsx` (127 lines)

## File Purpose

The "Payments" tab in the admin dashboard. A paginated, sortable table of all Razorpay payments with a search-by-email/phone/amount box.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect, useRef }` | `react` | State + scroll. |
| `FontAwesomeIcon` + 3 solid icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Row actions. |
| `Spinner` | `../Spinner` | Loading. |

## Exports

### `Payments` (default)
Props: `payments`, `onDeletePayment`, `isLoading`.

## Internal Logic

* Search filter: case-insensitive match on `email`, `phone`, or `amount`.
* Page size: 7 rows. `currentPage` resets to 1 on filter change.
* `formatDate(iso)` — locale string; falls back to "N/A".
* Per-row actions:
  * Trash icon → `onDeletePayment(payment.id)`.
  * Eye icon → console.log only (no detail view yet).
  * "View on Razorpay" link → opens the dashboard URL `https://dashboard.razorpay.com/app/payments/{payment.id}` in a new tab.
* Render: search input + table + pagination footer.

## Used By

* `src/pages/AdminDashboard.jsx` (activeTab === 'payments').

## Risks

* The `id` used to build the Razorpay dashboard link is actually the **payment id** but Razorpay's URL expects the payment id, not the order id. Confirm in `delete-payments` / `list-payments` which column is returned.
* The detail "view" is a `console.log` placeholder.
