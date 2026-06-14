# `supabase/functions/user-login/index.ts`

**Location**: `supabase/functions/user-login/index.ts` (72 lines)

## Purpose

Role-aware sign-in for normal users. Returns the session JWT so the frontend can store it.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/user-login` | Anon. |

## Request body

```json
{ "email": "x@y.com", "password": "..." }
```

## Logic

1. OPTIONS preflight. Reject non-POST with 405.
2. `supabase.auth.signInWithPassword({ email, password })`. On error → 401.
3. Read `user.app_metadata.role`. If it isn't `"user"` → 403 `"Access denied: Not an user"`. (This means an admin trying to log in here will be rejected — they must use `admin-login`.)
4. Return `{ success: true, session }` (the access + refresh token pair).

## CORS

`Access-Control-Allow-Origin: *`, allows `*` for headers.

## Used By

* `src/services/supabaseService.js` → `loginAsUser(email, password)`.
* `src/pages/UserLogin.jsx`.

## Risks

* Function is a thin wrapper around `auth.signInWithPassword`; the role check is the only added value.
* The session is returned in the body — not stored in an httpOnly cookie. The frontend persists it in `localStorage` (via `loginAsUser`), which is XSS-vulnerable.
