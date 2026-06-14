# `src/services/adminService.js`

**Location**: `src/services/adminService.js` (126 lines)

## File Purpose

Data access layer for **admin-only** operations. All privileged writes (create user, assign / remove route, renew expiry, delete user, delete auth user) are routed through Supabase Edge Functions so that the role check happens server-side against the caller's JWT.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `supabase` | `../supabaseClient` | Used only for `supabase.auth.getSession()` to read the caller's access token. |

## Exports

### `createNewUser(name, email, password)`
**Not used anywhere in the current source.** It calls `supabase.auth.admin.createUser(...)` directly, which would only work with a service-role key — meaning the function is dead code. The live path uses the `create-user` Edge Function instead.

### `assignRouteToUser(userId, routeId)`
Sends `POST` to `…/functions/v1/assign-route` with `{ user_id, route_id }` and a `Bearer` header built from the current session's access token. Returns the parsed JSON. Throws if the response is not OK.

### `removeRouteFromUser(userId)`
Posts to `…/functions/v1/remove-route` with `{ user_id }` and the admin JWT. Throws on non-OK.

### `renewRouteExpiry(routeId)`
Posts to `…/functions/v1/renew-expiry` with `{ route_id }` and the admin JWT. Throws on non-OK.

### `deleteUserProfile(userId)`
Direct delete: `supabase.from("profiles").delete().eq("user_id", userId)`. Throws on error. Runs under the admin's RLS context.

### `deleteAuthUser(userId)`
Posts to `…/functions/v1/delete-user` with `{ user_id, userId, id }` (all three for backwards-compat — the Edge Function picks the first non-null). Throws on non-OK.

## Internal Logic

* Every function fetches `session.data.session.access_token` from the client to use as the bearer token.
* The Edge Functions use that token to look up the calling user and enforce `app_metadata.role === 'admin'`.

## Dependencies

* `../supabaseClient`.
* `supabase/functions/assign-route`, `remove-route`, `renew-expiry`, `delete-user`.
* Tables: `profiles`.

## Used By

* `src/components/comp_views/Users.jsx` (only for calling `create-user` indirectly through `fetch`).
* `src/components/comp_views/UserList.jsx` (`removeRouteFromUser`).
* `src/components/comp_views/UserInfo.jsx` (`removeRouteFromUser`, `renewRouteExpiry`, `deleteUserProfile`, `deleteAuthUser`).
* `src/components/comp_views/AssignRoute.jsx` (`assignRouteToUser`).

## Risks

* `createNewUser` is dead code that calls the admin API directly. It would fail at runtime in the browser because the anon key can't call `auth.admin.createUser`. Should be deleted.
* The Edge Function URLs are hard-coded. If the Supabase project URL changes, all four functions break simultaneously.
