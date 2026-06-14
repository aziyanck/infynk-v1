# `src/services/userService.js`

**Location**: `src/services/userService.js` (114 lines)

## File Purpose

Data access layer for the **public** profile fetch and the **logged-in user** dashboard. Wraps the `get-user-profile` and `increment-view-count` Edge Functions, plus direct Supabase writes to the `profiles` table and the `profile-pictures` storage bucket.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `supabase` | `../supabaseClient` | The shared Supabase client. |

## Exports

### `getUserProfileByRouteId(routeId)`
Used by `PublicUserPage`. Runs a Supabase query that:

* Selects from `public_profiles` (a Postgres view that joins `profiles + routes`).
* Joins the `routes` table (inner join) on `route_id`.
* Filters by `eq("route_id", routeId)`, `eq("routes.is_active", true)`, and `gte("routes.expiry_date", today)` (string compared, format `YYYY-MM-DD`).
* Returns `{ data, error }` (data is a single row).

### `fetchUserProfile()`
Used by `UserDashboard`. Calls `get-user-profile` Edge Function with the current session's JWT. Throws an `Error` on non-2xx, otherwise returns `{ ...profile, view_count }`.

### `updateUserProfile(updatedProfile)`
Direct Supabase update: `supabase.from("profiles").update(updatedProfile).eq("id", updatedProfile.id)`. Throws on `error`.

### `uploadProfileImage(file, userId, existingImageUrl)`
Three-step avatar upload:

1. **Build a unique filename** — `${userId}_${ISO-timestamp}.${ext}` (timestamp format `YYYYMMDDTHHMMSS`).
2. **Delete the old file** in the `profile-pictures` storage bucket (best-effort, logs a warning on failure).
3. **Upload the new file** to `profile-pictures/${fileName}` with `upsert: true`.
4. **Return the public URL** via `getPublicUrl`.

### `incrementViewCount(routeId)`
Calls `supabase.functions.invoke("increment-view-count", { body: { route_id } })`. Logs the error to console (does not throw) so the public page is not blocked by analytics failures.

## Internal Logic

* `getUserProfileByRouteId` uses `today` formatted as `YYYY-MM-DD` (toISOString().split("T")[0]) so it can string-compare against the `expiry_date` column.
* The public page calls `incrementViewCount` exactly once per mount (gated by a `useRef` in `PublicUserPage`).

## Dependencies

* `../supabaseClient`.
* `supabase/functions/get-user-profile`.
* `supabase/functions/increment-view-count`.
* Tables: `public_profiles` (view), `profiles`.
* Storage bucket: `profile-pictures`.

## Used By

* `src/pages/PublicUserPage.jsx` (getUserProfileByRouteId, incrementViewCount).
* `src/pages/UserDashboard.jsx` (fetchUserProfile, updateUserProfile, uploadProfileImage).

## Risks

* `updateUserProfile` is a direct write from the anon client. It is only "safe" because the caller must already be authenticated AND the row's `id` is the user's own `user_id`. If the database has no RLS policy that prevents a user from updating another user's row, the function is exploitable.
* `uploadProfileImage` runs as the authenticated user (RLS applies). The path always starts with the user's own id so collisions are unlikely, but a malicious user could pass any `existingImageUrl` argument and cause a delete on a file they don't own — the path is hard-coded as `profile-pictures/${oldFileName}` so it is restricted to the bucket.
