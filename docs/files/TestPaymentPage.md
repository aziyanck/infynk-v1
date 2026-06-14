# `src/pages/TestPaymentPage.jsx`

**Location**: `src/pages/TestPaymentPage.jsx` (71 lines)

## File Purpose

A test harness for the `PaymentSuccess` component. Lets a developer toggle between `idle`, `verifying`, `success`, and `failed` to visually inspect the overlay. **Dead code** — not in the route table.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState }` | `react` | State. |
| `PaymentSuccess` | `../components/PaymentSuccess` | The component being tested. |

## Exports

### `TestPaymentPage` (default)

## Internal Logic

* Bottom toolbar with four buttons (`idle`, `verifying`, `success`, `failed`).
* Renders `<PaymentSuccess status={status} />` when `status !== 'idle'`, with a "Close Test View" button overlaid.

## Used By

Nothing.

## Risks

None — test only. Should be deleted from `App.jsx`'s lazy imports.
