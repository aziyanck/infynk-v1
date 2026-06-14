# `supabase/functions/renew-expiry/index.ts`

**Location**: `supabase/functions/renew-expiry/index.ts` (74 lines)

## Purpose

Push a route's `expiry_date` out by 1 year. If the current expiry is in the past or unparseable, treat "now" as the base.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/renew-expiry` | Anon (no auth check). |

## Request body

```json
{ "route_id": "slug-here" }
```

## Logic

1. OPTIONS preflight.
2. Validate `route_id`. Else 400.
3. Fetch `routes.expiry_date` for the slug. `.single()`.
4. `currentExpiry = expiry_date ? new Date(expiry_date) : new Date();` — invalid dates are coerced to now.
5. `newExpiry = new Date(currentExpiry); newExpiry.setFullYear(newExpiry.getFullYear() + 1);`.
6. Update `routes.expiry_date` to `newExpiry.toISOString().split('T')[0]` (YYYY-MM-DD).
7. Return `{ success: true, new_expiry }`.

## CORS

`Access-Control-Allow-Origin: *`.

## Used By

* `src/services/adminService.js` → `renewRouteExpiry(routeId)`.
* (No UI wires it in yet.)

## Risks

* **No auth check.** Anyone can extend any route's expiry.
* The renewal is unconditional — there's no "is this user actually paid?" check. Combine with `verify-payment` once a renewal-payment flow exists.
* `new Date(expiry_date)` may lose timezone info — Jan 1 in UTC may become Dec 31 in IST for users near midnight. Consider using `date` Postgres column rather than `text`.
