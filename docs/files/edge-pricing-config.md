# `supabase/functions/_shared/pricingConfig.ts`

**Location**: `supabase/functions/_shared/pricingConfig.ts` (18 lines)

## Purpose

The single source of truth for **server-side** pricing, shared between `create-order` and `verify-payment`. Note the **mismatch with the frontend**:

| Card Type | Plan | Server (`pricingConfig.ts`) | Frontend (`GetInfo.jsx` PRICING_CONFIG) | Frontend (`Land/Pricing.jsx`) |
|-----------|------|------------------------------|------------------------------------------|--------------------------------|
| PVC | 1y | **1199** | 999 | 999 |
| PVC | 2y | **1399** | 1199 | 1199 |
| PVC | 3y | **1599** | 1399 | 1399 |
| Wooden | 1y | **1299** | 1499 | 1499 |
| Wooden | 2y | **1499** | 1699 | 1699 |
| Wooden | 3y | **1699** | 1899 | 1899 |
| Metal | any | **not defined** | 2199 / 2349 / 2499 | 2199 / 2349 / 2499 |

* Extra card price: PVC `200`, Wooden `350`, Metal `?` (frontend uses 850; not used server-side).

## Used By

* `supabase/functions/create-order/index.ts` — to compute the Razorpay order amount.
* `supabase/functions/verify-payment/index.ts` — to recompute and re-verify the amount server-side.

## Risks

* **Three different sources of truth** for the same data. Recommend:
  1. Move this file to a Supabase table (`pricing_plans`) and read it from both functions.
  2. Replace the local `PRICING_CONFIG` in `GetInfo.jsx` with a fetch from a new `get-pricing` Edge Function.
  3. Update `Land/Pricing.jsx` to read from the same source.
* The **Metal** card has no server-side config. Any order with `cardType: "Metal Card"` will return 400 `"Invalid Card Type"` from `create-order` and never reach `verify-payment`. The frontend UI happily lets users pick it.
