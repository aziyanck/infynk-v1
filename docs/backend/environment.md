# Backend — Environment Variables

These variables are configured at the **Supabase project** level (not in the repo) and read via `Deno.env.get(...)` at runtime. None of them are visible in the Vite build.

## Required for all functions

| Var | Used in | Notes |
|-----|---------|-------|
| `SUPABASE_URL` | all | Auto-provisioned by Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | all | Bypasses RLS. Never expose to the browser. |

## Required for specific functions

| Var | Function | Notes |
|-----|----------|-------|
| `RAZORPAY_KEY_ID` | `create-order` | |
| `RAZORPAY_KEY_SECRET` | `create-order`, `verify-payment` | HMAC secret for order + payment signature. |
| `RAZORPAY_WEBHOOK_SECRET` | `razorpay-webhook` | HMAC secret for webhook signatures. Distinct from `RAZORPAY_KEY_SECRET`. |
| `RESEND_API_KEY` | `verify-payment` | Optional. If missing, emails are not sent but the function still succeeds. |

## Local development (`.env`)

The repo's `.env` (gitignored) currently contains:
```
VITE_SUPABASE_URL=https://yowckahgoxqfikadirov.supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```
> The two `VITE_*` vars are the anon client only. The bare `SUPABASE_*` vars are read by the Supabase CLI for `supabase functions serve` and **must not be committed**. See `docs/improvements.md` for the leak risk.

## Risks

* The same secret `RAZORPAY_KEY_SECRET` is used for **two different** HMAC inputs (order signature in `verify-payment`, payment captured signature in `razorpay-webhook` would use `RAZORPAY_WEBHOOK_SECRET`). Make sure the dashboard configuration matches.
* `RESEND_API_KEY` failure is **silent** — the function returns 200 even if Resend rejected the email. Wrap in a try/catch and surface 5xx if you want a real delivery guarantee.
