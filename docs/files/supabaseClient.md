# `src/supabaseClient.js`

**Location**: `src/supabaseClient.js` (8 lines)

## File Purpose

Creates and exports the singleton Supabase client used by every frontend data-access call. Uses the public *anon* key (respects the user's session token via `supabase.auth`).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `createClient` | `@supabase/supabase-js` | Factory for a Supabase client. |

## Exports

* `supabase` — a Supabase client configured with the public project URL and the public **anon** key.

## Internal Logic

```js
const supabaseUrl = "https://yowckahgoxqfikadirov.supabase.co";
const supabaseAnonKey = "eyJhbGciOi...suQ";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

The client is imported as `import { supabase } from "../supabaseClient"` from:

* `src/services/supabaseService.js`
* `src/services/userService.js`
* `src/services/adminService.js` (only for `getSession` and storage operations)
* `src/components/comp_views/Dashboard.jsx` (only for `getSession`)
* `src/components/comp_views/Payments.jsx` (only for `getSession`)
* `src/components/comp_views/UserList.jsx` (only for `getSession`)
* `src/components/comp_views/UserInfo.jsx` (only for `getSession`)
* `src/pages/UserLogin.jsx`, `src/pages/AdminLogin.jsx`
* `src/pages/UserDashboard.jsx`
* `src/pages/GetInfo.jsx`
* `src/pages/PublicUserPage.jsx`

## Dependencies

* `@supabase/supabase-js` (peer of every backend call in this project).

## Risks

* The anon key is hard-coded and committed. This is expected (the anon key is meant to be public) and is gated by Supabase RLS, **but** this project has multiple Edge Functions that do *not* enforce RLS on the underlying tables — see `docs/improvements.md`.
* If you ever move the project to a new Supabase project you must change the URL **and** the anon key here.
