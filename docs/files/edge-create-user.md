# `supabase/functions/create-user/index.ts`

**Location**: `supabase/functions/create-user/index.ts` (46 lines)

## Purpose

Manual user creation. Used by the admin when they need to seed an account outside the Razorpay flow. The role is taken from the request body (defaults to `"user"`).

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/create-user` | Anon (no auth check). |

## Request body

```json
{ "email": "...", "password": "...", "name": "...", "role": "user|admin" }
```

## Logic

1. OPTIONS preflight. Reject non-POST.
2. `supabaseAdmin.auth.admin.createUser({ email, password, user_metadata: { name }, app_metadata: { role }, email_confirm: true })`.
3. Return `{ data }` or 400.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* Nothing in the current source (`adminService.createNewUser` is dead code).
* Useful for one-off seeding from the Supabase CLI: `curl -X POST $URL/create-user -d '{ "email":"...", "password":"...", "role":"admin" }'`.

## Risks

* **No auth check.** Any anon caller can mint a new admin user. This is the most dangerous function in the project — **deactivate or remove it in production**.
* No password strength check.
* `email_confirm: true` — no email verification.
