# `supabase/functions/assign-route/index.ts`

**Location**: `supabase/functions/assign-route/index.ts` (99 lines)

## Purpose

Admin binds a unique slug to a user. Creates one row in `routes` and a stub row in `profiles`. **Does not call Razorpay** — the admin assigns routes that already-paid users have been promised.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/assign-route` | **Admin JWT required.** |

## Request body

```json
{ "user_id": "uuid", "route_id": "slug-here" }
```

## Logic

1. OPTIONS preflight.
2. Pull JWT from `Authorization` header. Use `supabase.auth.getUser(jwt)`. Reject 403 unless `app_metadata.role === "admin"`.
3. Compute `expiryDate = today + 365 days`. Store as ISO `YYYY-MM-DD`.
4. Insert into `routes`: `{ route_id, user_id, is_active: true, last_activated: now, expiry_date }`.
5. Insert into `profiles`: `{ route_id, user_id }` (a *stub* — the user fills the rest from the dashboard).
6. Return `{ success: true, route }`.

## CORS

`Access-Control-Allow-Origin: *`, allows `POST, OPTIONS`.

## Used By

* `src/services/adminService.js` → `assignRouteToUser(userId, routeId)`.
* (UI not implemented: `comp_views/AssignRoute.jsx` calls `adminService.getUserById` which does not exist.)

## Risks

* `route_id` is not unique-checked. Two admins assigning the same slug will both succeed; the second insert will violate a `UNIQUE` constraint at the DB level and bubble up as 400.
* No `slug` regex validation server-side. Garbage strings are accepted.
* No audit log of who assigned what.
