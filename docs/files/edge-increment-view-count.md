# `supabase/functions/increment-view-count/index.ts`

**Location**: `supabase/functions/increment-view-count/index.ts` (50 lines)

## Purpose

Increment the per-route view counter on the public page. The actual atomic increment is done by a Postgres RPC named `increment_view_count(route_id_input text)`.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/functions/v1/increment-view-count` | Anon. |

## Request body

```json
{ "route_id": "some-slug" }
```

## Logic

1. OPTIONS preflight.
2. Validate `route_id` present. Else 400.
3. `supabase.rpc("increment_view_count", { route_id_input: route_id })`.
4. Return `{ success: true }` on success, else 500.

## CORS

`Access-Control-Allow-Origin: *`, allows `POST, OPTIONS`.

## Used By

* `src/services/userService.js` → `incrementViewCount(routeId)`.
* `src/pages/PublicUserPage.jsx` (and possibly `UserView`'s preview).

## Risks

* **No rate limiting.** A malicious client can inflate any route's view count. Add a per-IP token bucket, or use the `x-forwarded-for` rate limit in the Supabase gateway.
* The function is anon-callable. There is no concept of "unique view" — every page load counts.
* The RPC body is **not in the repo** (no `supabase/migrations/`). It must be defined via the Supabase SQL editor.
