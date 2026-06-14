# Database — RLS & Access Patterns

## Summary

| Actor | Access path | Bypasses RLS? |
|-------|-------------|---------------|
| End user, anonymous (public) | `supabase-js` (anon key) | No. |
| End user, authenticated | `supabase-js` (user JWT) | No. |
| Edge Function (no `verify_jwt = false`) | service role | **Yes.** |
| Edge Function (forwards caller's `Authorization`) | uses the caller's JWT, then service role for additional queries | Mixed. |

## Read patterns

| Reader | Path | Returns |
|--------|------|---------|
| Anon browser (public) | `userService.getUserProfileByRouteId(slug)` → `.from("public_profiles").select("*, routes!inner(...)")` | Public profile fields only. |
| Authenticated user | `userService.fetchUserProfile(jwt)` → `functions/v1/get-user-profile` | All of `profiles` row + view count. |
| Admin | `functions/v1/list-users` | Joined user + route data. |

## Write patterns

| Writer | Path | Notes |
|--------|------|-------|
| Authenticated user | `userService.updateUserProfile(slug, data)` → `from("profiles").update(...)` | RLS restricts to own row. |
| Authenticated user | `userService.uploadProfileImage(slug, file)` → `storage.from("profile-images").upload(...)` | Storage policy required. |
| Service role | `verify-payment` | Inserts `payments`, creates Auth user, backfills `payments.user_id`. |
| Service role | `assign-route` | Inserts `routes` + `profiles` (stub). |
| Service role | `list-users`, `list-payments`, `delete-user`, `delete-payments`, `remove-route`, `renew-expiry`, `toggle-route-status` | Various. |

## RLS gaps (potential)

* `list-payments` and `delete-payments` **do not** check the role in the function body — they rely on RLS. Confirm with the actual policy.
* `renew-expiry` and `toggle-route-status` are anon-callable; they rely entirely on RLS.
* The `public_profiles` view is the only thing that prevents an anon from reading a private profile row. If the view is dropped, the anon key can `.from("profiles")` everything.

## Recommendations

* Add `ENABLE ROW LEVEL SECURITY;` on every table (assumed but not visible).
* Add explicit policies instead of relying on the default-deny in Supabase Auth.
* Add a `role = 'admin'` policy short-circuit on `payments` and `routes` to ensure admins are not accidentally locked out.
* Add storage policies: `profile-images` should be `INSERT/UPDATE` for the row owner, `SELECT` for anon (so the public page can display it).
