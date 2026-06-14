# `src/services/supabaseService.js`

**Location**: `src/services/supabaseService.js` (90 lines)

## File Purpose

Authentication helpers shared by the user and admin login pages. Also wraps the password reset flow.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `supabase` | `../supabaseClient` | The shared Supabase client. |

## Exports

### `loginUser({ email, password })`
Calls `supabase.auth.signInWithPassword({ email, password })`. **Not currently used** by any page — `UserLogin` and `AdminLogin` both call the dedicated Edge Functions instead.

### `loginAsUser({ email, password })`
Sends `POST` to `https://yowckahgoxqfikadirov.supabase.co/functions/v1/user-login` with a hard-coded anon-key bearer token. Returns the `session` object on success, throws an `Error` with the API's `error` field on failure. Used by `UserLogin.jsx`.

### `loginAsAdmin({ email, password })`
Same pattern against `…/functions/v1/admin-login`. Used by `AdminLogin.jsx`.

### `getSession()`
Thin wrapper around `supabase.auth.getSession()` returning `{ session, error }`. Currently unused — pages call `supabase.auth.getSession()` directly.

### `logoutUser()`
Wraps `supabase.auth.signOut()`. Currently unused — pages call `supabase.auth.signOut()` directly.

### `sendPasswordResetEmail(email)`
Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/update-password })`. Returns `{ data, error }`. Used by `ForgotPassword.jsx`.

### `updateUserPassword(newPassword)`
Calls `supabase.auth.updateUser({ password: newPassword })`. Used by `UpdatePassword.jsx` after the user clicks the email link.

## Internal Logic

* All Edge Function calls pass a hard-coded anon bearer token. That is **not** the user's JWT — it just satisfies the gateway's "is this an authenticated request" check. The Edge Function then runs `signInWithPassword` server-side to validate the credentials.
* The frontend never sees the user's password leave the browser *except* through the Edge Function POST.

## Dependencies

* `../supabaseClient` (Supabase).
* `supabase/functions/user-login`.
* `supabase/functions/admin-login`.

## Used By

* `src/pages/UserLogin.jsx`
* `src/pages/AdminLogin.jsx`
* `src/pages/ForgotPassword.jsx`
* `src/pages/UpdatePassword.jsx`

## Risks

* The anon bearer token is committed in source. It is meant to be public, but combined with functions that don't enforce RLS downstream, anyone could replay login requests against the Edge Functions. (They are still gated by knowing the email + password.)
* `loginUser` and `getSession` and `logoutUser` are dead code — they could be deleted, but they are small.
