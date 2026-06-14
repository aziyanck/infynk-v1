# Backend — Architecture (Deno Edge Functions)

The "backend" is a collection of 16 Deno-served functions on Supabase. There is **no long-running server**; each invocation is a short-lived isolate.

## Runtime

| Item | Value |
|------|-------|
| Language | TypeScript |
| Runtime | Deno (1.x) |
| `import_map` | `./functions/<name>/deno.json` |
| Entrypoint | `./functions/<name>/index.ts` |
| `verify_jwt` | `true` for all (per `supabase/config.toml`) |
| Policy | `oneshot` (one isolate per request) |
| Inspector port | 8083 |

## Function groups

| Group | Functions |
|-------|-----------|
| Public ordering | `create-order`, `verify-payment`, `razorpay-webhook` |
| Auth | `user-login`, `admin-login`, `create-user` |
| User profile | `get-user-profile` (auth), `increment-view-count` (public) |
| Admin CRUD | `list-users`, `list-payments`, `delete-user`, `delete-payments`, `assign-route`, `remove-route`, `renew-expiry`, `toggle-route-status` |
| Shared | `_shared/pricingConfig.ts` |

## Cross-cutting patterns

### CORS

Every function returns the same header block:
```ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```
`razorpay-webhook` is the only one without CORS (server-to-server).

### Auth

Three patterns:
1. **Service role only** (`create-order`, `increment-view-count`, `renew-expiry`, `toggle-route-status`, `create-user`, `razorpay-webhook`) — no caller check.
2. **Service role + caller JWT** (`list-payments`, `delete-payments`, `get-user-profile`) — forwards `Authorization` to `supabase.auth.getUser()`. Note: does **not** check role.
3. **Service role + caller JWT + role check** (`assign-route`, `remove-route`, `delete-user`, `list-users`) — explicitly requires `app_metadata.role === "admin"`.

### Service role

All functions use `SUPABASE_SERVICE_ROLE_KEY` from the environment. The **only** place the browser sees the service role is the deployed functions' process env, never the client bundle.

### Logging

Most functions use `console.log` (visible in Supabase logs). `verify-payment` logs to `console.error` on the user-creation failure branch. `create-order` has no logging. `get-user-profile` logs the user id.

## Hot file references

* `docs/files/edge-*.md` — one per function with request/response details.
* `docs/api/endpoints.md` — full API catalog.
* `docs/api/payment-flow.md` — end-to-end sequence.
* `docs/api/auth-flow.md` — login flow.

## Risks

* No idempotency on `verify-payment` or `create-order` (duplicate calls = duplicate charges/users).
* No global rate limit on public endpoints.
* `create-user` is anonymous and accepts `role: "admin"` — the single largest security risk.
* `list-payments` and `delete-payments` don't check role.
* The `verify-payment` and `razorpay-webhook` paths write **different shapes** to `payments`.
* Pricing config is duplicated three times.
