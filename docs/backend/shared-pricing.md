# Backend — Shared Pricing Config

`supabase/functions/_shared/pricingConfig.ts` is the only `_shared/` file. It is **not** a directory; there is no `index.ts` to import — the functions directly `import { PRICING_CONFIG } from "../_shared/pricingConfig.ts"`.

## Shape

```ts
export const PRICING_CONFIG = {
  "PVC Card":    { plans: { "1_year": 1199, "2_year": 1399, "3_year": 1599 }, single_item: 200 },
  "Wooden Card": { plans: { "1_year": 1299, "2_year": 1499, "3_year": 1699 }, single_item: 350 },
};
```

`Metal Card` is not in the shared config. Any request with `cardType: "Metal Card"` returns 400 from `create-order`.

## Used by

* `create-order/index.ts` — to compute the Razorpay order amount in paise.
* `verify-payment/index.ts` — to recompute the amount server-side as a sanity check.

## Risks

* The frontend has **two** copies of this config (`GetInfo.jsx` PRICING_CONFIG and `Land/Pricing.jsx` plans), and they differ from the backend. See `docs/files/edge-pricing-config.md` for the table.
* Recommendation: move this to a `pricing_plans` table, fetch from a new `get-pricing` Edge Function, and consume from the React side too.
