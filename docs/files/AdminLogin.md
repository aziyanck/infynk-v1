# `src/pages/AdminLogin.jsx`

**Location**: `src/pages/AdminLogin.jsx` (143 lines)

## File Purpose

Login page for admins. Mirrors `UserLogin` but calls `loginAsAdmin` and routes to `/admin/dashboard`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State + lifecycle. |
| `loginAsAdmin` | `../services/supabaseService` | Posts to the `admin-login` Edge Function. |
| `FontAwesomeIcon`, `faEnvelope`, `faLock` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Field icons. |
| `Spinner` | `../components/Spinner` | Loader. |
| `useNavigate, Link` | `react-router-dom` | Routing. |
| `supabase` | `../supabaseClient` | `getSession` and `setSession`. |

## Exports

### `LoginPage` (default) — the admin login page.

## Internal Logic

* Same as `UserLogin`, but:
  * On mount: if `app_metadata.role === 'admin'`, navigate to `/admin/dashboard`.
  * `handleLogin` calls `loginAsAdmin(formData)`, sets the session, then navigates to `/admin/dashboard`.

## Dependencies

* `services/supabaseService`, `supabaseClient`, `components/Spinner`.

## Used By

* `src/App.jsx` (lazy-loaded at `/admin`).

## Risks

* Identical to `UserLogin` — the only meaningful difference is the function called and the role check.
