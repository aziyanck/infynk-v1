# `src/pages/UserLogin.jsx`

**Location**: `src/pages/UserLogin.jsx` (145 lines)

## File Purpose

Login page for end users (card holders). Calls the `user-login` Edge Function, stores the returned session, and redirects to `/user/dashboard`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State and lifecycle. |
| `loginAsUser` | `../services/supabaseService` | Posts to the `user-login` Edge Function. |
| `FontAwesomeIcon`, `faEnvelope`, `faLock`, `faEye`, `faEyeSlash` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Field icons + show/hide password. |
| `Spinner` | `../components/Spinner` | Loader for the submit button. |
| `useNavigate, Link` | `react-router-dom` | Routing. |
| `supabase` | `../supabaseClient` | Used for `getSession()` and `setSession()`. |

## Exports

### `LoginPage` (default) — the user login page.

## Internal Logic

* `formData` — `{ email, password }`.
* `errorMsg`, `successMsg`, `loading`, `showPassword` — local state.
* On mount: if a Supabase session already exists **and** the user's `app_metadata.role === 'user'`, redirect to `/user/dashboard`. (This handles the case where a user refreshes the page while still signed in.)
* `handleChange` — controlled input.
* `handleLogin(e)`:
  1. Prevent default.
  2. Set loading, clear messages.
  3. `const session = await loginAsUser(formData)` (POSTs to `user-login`).
  4. `await supabase.auth.setSession({ access_token, refresh_token })` so subsequent client calls have the right auth state.
  5. Show success message; after 1 s, `navigate('/user/dashboard')`.
  6. On error → set `errorMsg = err.message`.
  7. Always `setLoading(false)`.
* Renders a glassmorphism card with email + password fields, a "Show password" toggle, a "Forgot Password?" link, inline alerts, and a "Sign In" button.

## Dependencies

* `services/supabaseService`.
* `supabaseClient`.
* `components/Spinner`.

## Used By

* `src/App.jsx` (lazy-loaded at `/user`).

## Risks

* The anon bearer token inside `loginAsUser` is hard-coded in `supabaseService.js`. Rotating the key requires updating that file.
* Errors are surfaced via `alert` / inline red box — not very pretty, but functional.
