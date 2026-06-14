# `supabase/functions/create-order/index.ts`

**Location**: `supabase/functions/create-order/index.ts` (71 lines)

## Purpose

Create a Razorpay order for a given plan, card type, and quantity. Returns the order id and the amount in paise.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/create-order` | Anon or user. |

## Request body

```json
{ "planName": "1_year", "qty": 2, "cardType": "PVC Card" }
```

## Logic

1. OPTIONS preflight.
2. Read `PRICING_CONFIG[cardType]`. Unknown card → 400 `"Invalid Card Type"`.
3. Read `selectedConfig.plans[planName]`. Unknown plan → 400 `"Invalid Plan Selected"`.
4. Validate `qty >= 1`. Else `"Invalid Quantity"`.
5. `amount_inr = planPrice + selectedConfig.single_item * (qty - 1)`.
6. `amount_paise = amount_inr * 100`.
7. Call `razorpay.orders.create({ amount, currency: "INR", receipt: "receipt_" + randomShort })`. Return the order JSON.

## CORS

`Access-Control-Allow-Origin: *`, allows `authorization, x-client-info, apikey, content-type`.

## Environment

| Var | Required |
|-----|----------|
| `RAZORPAY_KEY_ID` | yes |
| `RAZORPAY_KEY_SECRET` | yes |

## Used By

* `src/pages/GetInfo.jsx` (before opening Razorpay Checkout).

## Risks

* **Pricing drift with the frontend.** The local `PRICING_CONFIG` in `GetInfo.jsx` (PVC 999/1199/1399, Wooden 1499/1699/1899, Metal 2199/2349/2499) is **different** from `supabase/functions/_shared/pricingConfig.ts` (PVC 1199/1399/1599, Wooden 1299/1499/1699). The user may see one price, but the server charges another. There is no Metal card type server-side at all; selecting Metal → 400.
* `receipt` is a random short string, not a UUID. Two concurrent orders for the same user could collide.
* No idempotency key.
