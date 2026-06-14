# `supabase/functions/admin-login/index.ts`

**Location**: `supabase/functions/admin-login/index.ts` (72 lines)

## Purpose

Role-aware sign-in for admins. Mirror of `user-login` but checks `app_metadata.role === "admin"`.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/admin-login` | Anon. |

## Request body / logic

Identical to `user-login`, except the role check is `"admin"`. Returns `{ success: true, session }`.

## Used By

* `src/services/supabaseService.js` → `loginAsAdmin(email, password)`.
* `src/pages/AdminLogin.jsx`.

## Risks

* See `edge-user-login.md`.
* If the only admin's password is lost, recovery is **not** exposed (the `auth.users` table is not browser-accessible). Plan an out-of-band recovery path.
