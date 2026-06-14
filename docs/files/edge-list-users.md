# `supabase/functions/list-users/index.ts`

**Location**: `supabase/functions/list-users/index.ts` (104 lines)

## Purpose

Admin-only listing of every Supabase Auth user with `app_metadata.role === "user"`, joined to their `routes` row.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST/GET | `/functions/v1/list-users` | **Admin JWT required.** |

## Logic

1. OPTIONS preflight.
2. Extract JWT from `Authorization`. `supabase.auth.getUser(jwt)`. Reject 401 / 403.
3. `supabase.auth.admin.listUsers()` — returns every auth user.
4. Filter to those with `app_metadata.role === "user"`.
5. Bulk fetch `routes` rows whose `user_id` is in the filtered set: `.select("route_id, user_id, is_active, expiry_date, last_activated").in("user_id", userIds)`.
6. Build a `usersWithRoutes` array, one entry per user with the merged fields:
   * `id, email, name` (from `user_metadata.name` or "No name")
   * `route_id, route_status` ("Active" | "Inactive" | null), `expiry_date`, `activation_date`.
7. Return `{ users: usersWithRoutes }`.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/pages/AdminDashboard.jsx` (Users tab).

## Risks

* No pagination. `listUsers()` returns **all** users, not paginated. Will OOM at scale.
* Admins never see users with `app_metadata.role === "admin"` (intentional).
* Uses `supabaseAdmin.auth.admin.listUsers()` — the entire list is materialised in memory. For >1k users, switch to paginated `auth.admin.listUsers({ page, perPage })`.
* The join key is `user_id` only. If a user has multiple `routes` rows (no DB unique constraint is visible in source), only the first one is returned. The `routes` table has no `UNIQUE(user_id)` declared in any migration (migrations folder is empty).
