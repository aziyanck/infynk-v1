# `supabase/functions/list-payments/index.ts`

**Location**: `supabase/functions/list-payments/index.ts` (54 lines)

## Purpose

Admin-only listing of every `payments` row, newest first.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST/GET | `/functions/v1/list-payments` | **Any authenticated user.** The caller is verified via `supabase.auth.getUser()`, but the role is **not** checked — any logged-in user can call this. |

## Logic

1. OPTIONS preflight.
2. Build the user-aware client (passes caller's `Authorization`).
3. `supabase.auth.getUser()` — reject 401.
4. Build a separate `supabaseAdmin` client with service role.
5. `supabaseAdmin.from("payments").select("*").order("created_at", { ascending: false })`.
6. Return `{ payments: data }`.

## CORS

`Access-Control-Allow-Origin: *`, allows `authorization, x-client-info, supabase-auth-token, content-type`.

## Used By

* `src/pages/AdminDashboard.jsx` (Payments tab).

## Risks

* **No role check.** Any signed-in user can fetch all payments. Should be admin-only.
* No pagination. Could be slow / overflow.
* The `payments` table is queried with the service-role key, bypassing RLS.
* The frontend `comp_views/Payments.jsx` filters on `email`, `phone`, `amount` — these columns must be present in the schema.
