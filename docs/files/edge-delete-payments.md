# `supabase/functions/delete-payments/index.ts`

**Location**: `supabase/functions/delete-payments/index.ts` (62 lines)

## Purpose

Admin-only: bulk delete `payments` rows by id.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/delete-payments` | **Any authenticated user.** Role is **not** checked. |

## Request body

```json
{ "payment_ids": ["uuid1", "uuid2"] }
```

## Logic

1. OPTIONS preflight.
2. Authenticate via user-aware client. Reject 401.
3. Validate `payment_ids` is a non-empty array. Else 400.
4. `supabaseAdmin.from("payments").delete().in("id", payment_ids)`.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/pages/AdminDashboard.jsx` → `comp_views/Payments.jsx` (per-row trash icon).

## Risks

* **No role check.** Any signed-in user can delete any payment row.
* No soft-delete or audit.
* Hard-deletes financial records — should require extra confirmation + a `deleted_at` column for compliance.
