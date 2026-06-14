# API — Payment Flow (end-to-end)

```mermaid
sequenceDiagram
    actor U as User (browser)
    participant FE as GetInfo.jsx
    participant CO as create-order (EF)
    participant RZ as Razorpay
    participant VP as verify-payment (EF)
    participant DB as Supabase DB
    participant EM as Resend

    U->>FE: Fills form, clicks "Pay"
    FE->>CO: POST { planName, qty, cardType }
    CO->>DB: (none — just computes)
    CO-->>FE: { id: "order_...", amount: paise }
    FE->>RZ: open Razorpay Checkout
    RZ-->>U: payment popup
    U->>RZ: pays
    RZ-->>FE: handler({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
    FE->>VP: POST { razorpay_*, userData }
    VP->>VP: HMAC verify
    VP->>DB: INSERT payments (status=paid)
    VP->>DB: auth.admin.createUser (8-char temp pwd)
    VP->>DB: UPDATE payments SET user_id = new auth id
    VP->>EM: POST /emails (welcome or error)
    VP-->>FE: { success } or { paymentVerified: true, error: "UserCreationError" }
    FE->>U: render PaymentSuccess (status = success | failed | payment_success_user_failed)
```

## Failure modes

| Stage | Failure | User sees |
|-------|---------|-----------|
| `create-order` | Invalid card/plan/qty | 400, frontend shows raw error. |
| Razorpay popup | User closes | Nothing — return to form. |
| Razorpay payment | Bank declined | Razorpay shows error. Frontend `e.error.metadata` is not handled. |
| `verify-payment` HMAC mismatch | Tampered signature | 400 `"Invalid Signature"`. Frontend status `failed`. |
| `verify-payment` Auth createUser fails | Email collision / Supabase down | `payment_success_user_failed` — user is told to contact support. The `payments` row exists but `user_id` is null. |
| Resend | No API key | Welcome email not sent, but function returns success. |
| Webhook | `payment.captured` event fires | **Second `payments` row** with a different shape. |
