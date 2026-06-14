# `supabase/functions/verify-payment/index.ts`

**Location**: `supabase/functions/verify-payment/index.ts` (183 lines)

## Purpose

The "happy path" finaliser. After the user pays via Razorpay, the frontend calls this function with the order id, payment id, signature, and the form's `userData`. The function verifies the HMAC-SHA256 signature, writes a `payments` row, creates a Supabase Auth user with an 8-character random password, and emails the credentials.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/verify-payment` | Anon or user (HMAC guards the rest) |

## Request body

```json
{
  "razorpay_order_id": "order_ABC",
  "razorpay_payment_id": "pay_XYZ",
  "razorpay_signature": "...",
  "userData": {
    "full_name": "...",
    "email": "...",
    "phone": "...",
    "address": "...",
    "account_type": "personal|business",
    "company_name": "...",
    "plan": "1_year|2_year|3_year",
    "card_type": "PVC Card|Wooden Card",
    "qty": 1
  }
}
```

## Logic

1. OPTIONS preflight.
2. Build a service-role Supabase client.
3. HMAC-SHA256(`RAZORPAY_KEY_SECRET`, `${order_id}|${payment_id}`) hex digest; compare to `razorpay_signature`. Mismatch → 400 `"Invalid Signature"`.
4. Recompute the amount from `PRICING_CONFIG[card_type].plans[plan] + single_item * (qty-1)` (defensive — the order amount was trusted in `create-order` but is now re-validated).
5. Insert a `payments` row with status `paid` and the computed `amount`. Get the new `id` back.
6. Generate `tempPassword = crypto.randomUUID().slice(0, 8)` (8 hex chars).
7. `supabaseAdmin.auth.admin.createUser({ email, password: tempPassword, email_confirm: true, user_metadata: { name }, app_metadata: { role: "user", plan } })`.
8. Backfill `payments.user_id` with the new auth user id.
9. Branch:
   * `authError` → use the "technical error" template; respond `{ success: false, paymentVerified: true, error: "UserCreationError", message: "..." }`.
   * `authData.user` → use the "welcome" template; respond `{ success: true, message: "Processed successfully" }`.
10. If `RESEND_API_KEY` is set, POST to `https://api.resend.com/emails` with `from: "Pixiic <pixiic@supports.pixiic.com>"`. Resend failure is logged, not raised.

## CORS

`Access-Control-Allow-Origin: *`, allows `authorization, x-client-info, apikey, content-type`.

## Environment

| Var | Required | Notes |
|-----|----------|-------|
| `SUPABASE_URL` | yes | |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | |
| `RAZORPAY_KEY_SECRET` | yes | Used for HMAC. |
| `RESEND_API_KEY` | optional | If missing, the function still succeeds but no email is sent. |

## Used By

* `src/pages/GetInfo.jsx` (after `Razorpay` checkout success).

## Risks

* **No idempotency.** If the function is invoked twice with the same `razorpay_payment_id`, two payments rows and two Auth users are created. Add a unique index on `payments.razorpay_payment_id` and a `createUser` retry strategy.
* `email_confirm: true` — newly created users are immediately able to sign in with the 8-char password, but `enable_confirmations = false` is also set in `config.toml`, so there is no double-check.
* `tempPassword = crypto.randomUUID().slice(0, 8)` yields hex chars only. Easy to brute force; rotate on first login.
* The function trusts the `userData.card_type` and `userData.plan`; it recomputes the amount but does not check that the **Razorpay order amount** matches. Cross-check `razorpay.orders.fetch(order_id).amount` for stronger guarantees.
* The welcome email template embeds the `tempPassword` in plain text.
* `getTechnicalErrorEmailHtml` is only sent for *user creation* failure. Payment insert failure throws before email is sent at all — these payments are simply lost (Razorpay captured money; no record).
