# `supabase/functions/get-user-profile/index.ts`

**Location**: `supabase/functions/get-user-profile/index.ts` (97 lines)

## Purpose

Authenticated "fetch my own profile". Returns the caller's `profiles` row (which the dashboard renders) plus the view count for the route.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST/GET | `/functions/v1/get-user-profile` | **User JWT required.** Forwards the caller's `Authorization` header. |

## Logic

1. Build a Supabase client with service-role key, but **pass the caller's `Authorization` header through** so `supabase.auth.getUser()` returns the right user.
2. OPTIONS preflight.
3. `supabase.auth.getUser()` → if no user, 401.
4. `supabase.from("profiles").select("*").eq("user_id", user.id)` — must return exactly 1 row (0 → 404, >1 → 400).
5. If the profile has a `route_id`, do a second query: `select("view_count").eq("route_id", ...).maybeSingle()`. Defaults to 0.
6. Return `{ profile, view_count }`.

## CORS

`Access-Control-Allow-Origin: *`, allows `GET, POST, OPTIONS`.

## Used By

* `src/services/userService.js` → `fetchUserProfile(jwt)`.
* `src/pages/UserDashboard.jsx`.

## Risks

* `Access-Control-Allow-Origin: *` is permissive; the service-role key is only used to mint a client that **does not authenticate** itself, the *caller's* JWT does. So the actual authorisation is correct, but in browser DevTools a user can see all of their own data trivially.
* The function name `get-user-profile` is ambiguous — it returns the *caller's* profile, not a public profile. The public lookup is inlined in `userService.getUserProfileByRouteId` (anon + RLS on `public_profiles`).
* `maybeSingle()` on analytics can hide a true zero — but for view count that's fine.
