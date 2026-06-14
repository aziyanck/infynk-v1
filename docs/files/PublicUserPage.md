# `src/pages/PublicUserPage.jsx`

**Location**: `src/pages/PublicUserPage.jsx` (56 lines)

## File Purpose

Route handler for `/{slug}`. Fetches the public profile data via `getUserProfileByRouteId`, increments the view count exactly once per mount, and renders the profile in `UserView` (or the `UserNotFound` page).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `useEffect, useState, useRef` | `react` | State and side effects. |
| `useParams` | `react-router-dom` | Reads the `:slug` URL parameter. |
| `ThreeDot` | `react-loading-indicators` | Loader while fetching. |
| `getUserProfileByRouteId, incrementViewCount` | `../services/userService` | Data access. |
| `UserView` | `../components/UserView` | Renders the profile. |
| `UserNotFound` | `./UserNotFound` | Fallback if the route is not found / inactive / expired. |

## Exports

### `PublicUserPage` (default)
A functional component.

## Internal Logic

* `user`, `notFound`, `loading` — local state.
* `hasIncremented = useRef(false)` — guards `incrementViewCount` against React 18 StrictMode double-invocation in dev.
* On mount / `routeId` change:
  1. Call `getUserProfileByRouteId(routeId)`.
  2. On error or no data → `setNotFound(true)`.
  3. On data → `setUser(data)`; if `!hasIncremented.current` → `incrementViewCount(routeId)` and mark the ref.
  4. `setLoading(false)`.
* Renders:
  * If loading → centred `ThreeDot`.
  * If `notFound` → `<UserNotFound />`.
  * Otherwise → `<UserView user={user} />`.

## Dependencies

* `services/userService`.
* `components/UserView`.
* `pages/UserNotFound`.

## Used By

* `src/App.jsx` (lazy-loaded at `/:slug`).

## Risks

* The `notFound` state never resets when `routeId` changes. If a user navigates from `/old-slug` to `/new-slug` within the same SPA session and the first request failed, the page will continue to show `UserNotFound` until it remounts. (The `useEffect` dep list `[routeId]` triggers a re-run, so `loading` and `notFound` *will* be reset on the next call; only the initial condition is captured.)
* The `user` from `setUser(data)` is passed directly to `UserView`, but `UserView` reads `user.color`, `user.socials.*`, `user.show_*` flags — none of which are filtered here. The visibility logic is purely client-side inside `UserView`. This is fine for the current data shape, but be aware that **the API will return every column even if the user marked a field as private**; only the dashboard's `previewUser` filters them.
