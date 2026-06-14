# `supabase/functions/remove-route/index.ts`

**Location**: `supabase/functions/remove-route/index.ts` (107 lines)

## Purpose

Admin-only: delete a user's `profiles` and `routes` rows. The auth user itself is **not** deleted (use `delete-user` for that).

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/remove-route` | **Admin JWT required.** |

## Request body

```json
{ "user_id": "uuid" }
```

## Logic

1. OPTIONS preflight.
2. Extract JWT. Reject 401 / 403 (admin only).
3. Look up `routes.route_id` for the `user_id`. 404 if missing.
4. Delete from `profiles` where `route_id = ...`.
5. Delete from `routes` where `route_id = ...`.
6. Return `{ success: true }`.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/services/adminService.js` → `removeRouteFromUser(userId)`.

## Risks

* Order matters: profile is deleted **before** route. The route delete is the FK "owner" of the profile in many designs, so this order may violate the FK and fail silently. Reverse the order to delete the route first, then the profile (or rely on `ON DELETE CASCADE`).
* No soft-delete.
* Does not delete the `analytics` row.
