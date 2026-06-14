# `supabase/functions/razorpay-webhook/index.ts`

**Location**: `supabase/functions/razorpay-webhook/index.ts` (93 lines)

## Purpose

Razorpay's server-to-server callback. When a `payment.captured` event fires, the function writes a `payments` row from the `notes` field. **Completely separate from `verify-payment`**, which writes a richer row.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/razorpay-webhook` | **HMAC via `RAZORPAY_WEBHOOK_SECRET`.** No Supabase JWT. |

## Verification

1. Read raw body text.
2. `HMAC-SHA256(RAZORPAY_WEBHOOK_SECRET, bodyText).hex()`.
3. Compare to `x-razorpay-signature` header.
4. Reject 400 on mismatch.

## Logic

1. If `event === "payment.captured"`, extract `entity.notes.user_name` and `entity.notes.user_plan`.
2. `supabase.from("payments").insert({ payment_id, amount, name, plan, paid: true, created_at })`.
3. Always return 200 to stop Razorpay from retrying — even on Supabase error, the function logs and returns 200 (this is intentional per Razorpay best practice).

## CORS

None (Razorpay server-to-server, no browser involved).

## Environment

| Var | Required |
|-----|----------|
| `RAZORPAY_WEBHOOK_SECRET` | yes |
| `SUPABASE_URL` | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | yes |

## Used By

* Configured in the Razorpay dashboard as the webhook URL for the live/test mode account. Frontend does not call it.

## Risks

* **Two parallel payment insert paths.** `verify-payment` writes `razorpay_payment_id` + `razorpay_order_id` + many more columns; this function writes `payment_id` + `name` + `plan`. A single paid order can produce **two** rows in `payments`, with mismatching column names. This is a data-integrity bug; pick one path.
* `verify-payment` only fires on the **client side**, so if the user closes the tab after paying but before the function runs, only the webhook row exists. The frontend does not retry.
* No idempotency: a `payment.captured` event delivered twice produces two rows.
