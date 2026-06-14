# `src/pages/ForgotPassword.jsx`

**Location**: `src/pages/ForgotPassword.jsx` (87 lines)

## File Purpose

Password reset request page. Sends a Supabase reset email to the provided address with a redirect to `/update-password`.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState }` | `react` | State. |
| `sendPasswordResetEmail` | `../services/supabaseService` | Wraps `supabase.auth.resetPasswordForEmail`. |
| `FontAwesomeIcon, faEnvelope` | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Email icon. |
| `Link` | `react-router-dom` | "Back to Login" link. |
| `Spinner` | `../components/Spinner` | Loader. |

## Exports

### `ForgotPassword` (default)

## Internal Logic

* Single email field. On submit, calls `sendPasswordResetEmail(email)`, which in turn calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/update-password })`.
* On success, shows "Check your email for the password reset link."

## Dependencies

* `services/supabaseService`.
* `components/Spinner`.

## Used By

* `src/App.jsx` (lazy-loaded at `/forgot-password`).

## Risks

* The redirect target is `${window.location.origin}/update-password`. If the app is mounted at a subpath it would break.
