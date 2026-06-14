# `supabase/config.toml`

**Location**: `supabase/config.toml` (454 lines)

## File Purpose

Local-development configuration for the Supabase project (`project_id = "infynk-v1"`). Defines:
* API + DB ports (`54321`, `54322`, `54320`, `54329`).
* Auth (JWT 1h, refresh rotation 10s, signup enabled, 6-char min password, no email confirmation).
* Edge Runtime (Deno 1, `oneshot` policy, inspector 8083).
* Realtime, Studio (port 54323), Inbucket mail catcher (port 54324), Analytics (port 54327).
* **All 11 currently-registered Edge Functions** with `verify_jwt = true` (note: the source folder contains 15 function directories, but only 11 are listed here — see "Risks").

## Registered functions (as of this file)

| Function | verify_jwt | Purpose |
|----------|------------|---------|
| `create-user` | true | Bootstrap admin user. |
| `list-users` | true | Admin: fetch all users. |
| `assign-route` | true | Admin: bind slug to a user. |
| `remove-route` | true | Admin: unbind a slug. |
| `get-user-profile` | true | Public: fetch profile by slug. |
| `login-user` | true | **Note:** the source folder contains `user-login` (and `admin-login`) but not `login-user`. The actual deployed function is named `user-login`. |
| `admin-login` | true | Admin: sign in. |
| `user-login` | true | User: sign in. |
| `toggle-route-status` | true | Admin: enable/disable a route. |
| `razorpay-webhook` | true | Razorpay callback. |
| `create-order` | true | Create a Razorpay order. |
| `verify-payment` | true | Verify HMAC + create Auth user. |

> Source folder has 15 functions: `admin-login`, `assign-route`, `create-order`, `create-user`, `delete-payments`, `delete-user`, `get-user-profile`, `increment-view-count`, `list-payments`, `list-users`, `razorpay-webhook`, `remove-route`, `renew-expiry`, `toggle-route-status`, `user-login`, `verify-payment`. **Missing from config.toml:** `delete-payments`, `delete-user`, `increment-view-count`, `list-payments`, `renew-expiry`. The `login-user` block is a duplicate typo for `user-login`.

## Auth defaults

* `site_url = "http://127.0.0.1:3000"` — used for redirect URIs in emails. The real production URL `https://pixiic.com` is **not** in `additional_redirect_urls`.
* `enable_signup = true` — anyone with the anon key can hit `/auth/v1/signup` (used by `verify-payment` to create users, but also exposed to the world).
* `enable_confirmations = false` — no email verification.
* `minimum_password_length = 6` — 6-char passwords (e.g. the auto-generated ones in `verify-payment`).

## Risks

* `login-user` block is likely a copy-paste mistake and was renamed to `user-login`. The deployed function name is `user-login`.
* The 5 newer functions (`delete-payments`, `delete-user`, `increment-view-count`, `list-payments`, `renew-expiry`) need to be appended or `supabase functions deploy` will fail to pick them up.
* `site_url` is `http://127.0.0.1:3000`; production auth emails will link back to localhost. Add `https://pixiic.com` and the Vercel preview domains to `additional_redirect_urls`.
* `enable_signup = true` + `enable_confirmations = false` means anyone hitting the public PostgREST `auth` endpoint can create users; the only guard is that the admin invite flow does not exist yet.
