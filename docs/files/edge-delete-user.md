# `supabase/functions/delete-user/index.ts`

**Location**: `supabase/functions/delete-user/index.ts` (69 lines)

## Purpose

Admin-only: hard-delete a Supabase Auth user (which cascades to auth-related tables per your RLS / FK config). Does **not** delete the user's `routes` or `profiles` rows.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/delete-user` | **Admin JWT required.** |

## Request body

Accepts any of: `{ userId }`, `{ user_id }`, `{ id }`.

## Logic

1. OPTIONS preflight.
2. Extract JWT, verify `app_metadata.role === "admin"`. Else 403.
3. Resolve `targetUserId` from one of the three body keys.
4. `supabaseAdmin.auth.admin.deleteUser(targetUserId)`.
5. Return `{ message: "User deleted successfully", data }`.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/services/adminService.js` → `deleteAuthUser(userId)`.

## Risks

* Leaves dangling `routes` and `profiles` rows. Call `remove-route` first.
* No soft-delete / audit trail.
* The function is correct, but the wiring in the dashboard is partial: `AdminDashboard` only deletes the auth user, not the route.
