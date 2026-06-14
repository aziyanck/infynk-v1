# `supabase/functions/toggle-route-status/index.ts`

**Location**: `supabase/functions/toggle-route-status/index.ts` (49 lines)

## Purpose

Flip a route's `is_active` flag. Used by admins to suspend a profile without deleting the row.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/toggle-route-status` | Anon (no auth check). |

## Request body

```json
{ "route_id": "slug-here", "is_active": true }
```

## Logic

1. OPTIONS preflight.
2. `supabase.from("routes").update({ is_active }).eq("route_id", route_id)`.
3. Return `{ success: true }` or 400 on error.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/services/adminService.js` → `toggleRouteStatus(routeId)` (referenced by `comp_views/UserInfo.jsx`).

## Risks

* **No auth check.** Any caller can suspend or re-enable any route.
* The service role is used implicitly via the URL config (the function uses anon + service role — it would be clearer if it verified admin role first).
* Hard `update` — no "last disabled by" audit column.
