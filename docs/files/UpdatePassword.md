# `src/pages/UpdatePassword.jsx`

**Location**: `src/pages/UpdatePassword.jsx` (69 lines)

## File Purpose

The destination of the password-reset email link. Shows a single new-password input and calls `supabase.auth.updateUser({ password })`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState }` | `react` | State. |
| `updateUserPassword` | `../services/supabaseService` | Wraps `supabase.auth.updateUser`. |
| `useNavigate` | `react-router-dom` | After success, navigate to `/user`. |
| `FontAwesomeIcon, faLock` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Lock icon. |

## Exports

### `UpdatePassword` (default)

## Internal Logic

* Single password field with `minLength={6}`.
* On submit, calls `updateUserPassword(password)`. On success shows a green message and after 2 s navigates to `/user`.

## Dependencies

* `services/supabaseService`.

## Used By

* `src/App.jsx` (lazy-loaded at `/update-password`).

## Risks

* `useNavigate` is imported, but the page does **not** use the navigation from this file. The redirect happens after a `setTimeout`. There's no link to `/admin` — a staff user would have to use the deep link to get back to their admin dashboard. (Actually they navigate to `/user` which is the user login page; an admin could log in there only if they have user-role credentials.)
* `minLength={6}` matches the `minimum_password_length = 6` in `supabase/config.toml`, but the form has no confirmation field.
