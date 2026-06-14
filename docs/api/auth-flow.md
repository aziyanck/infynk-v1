# API — Auth Flow

```mermaid
sequenceDiagram
    actor U as User (browser)
    participant FE as UserLogin.jsx / AdminLogin.jsx
    participant SL as user-login / admin-login (EF)
    participant SB as Supabase Auth
    participant DB as Supabase DB

    U->>FE: email + password
    FE->>SL: POST { email, password }
    SL->>SB: signInWithPassword
    SB-->>SL: { user, session }
    alt wrong role
        SL-->>FE: 403 "Access denied"
        FE->>U: show error
    else correct role
        SL-->>FE: { success: true, session }
        FE->>FE: localStorage.setItem("access_token", session.access_token)
        FE->>FE: localStorage.setItem("user_role", role)
        FE->>U: navigate /dashboard or /admin
    end
```

## Session storage

* The session is persisted in `localStorage` (not httpOnly cookies).
* `localStorage` keys used (per code):
  * `access_token` — the JWT.
  * `user_role` — `"user"` or `"admin"`.
  * `user_id` — the auth user id.
  * `user_email` — for the navbar.
  * `adminActiveTab` — last selected admin tab.
  * `currentRoute` — debug / navigation cache.
  * `showPhone`, `showEmail`, etc — boolean string. **But** the dashboard also keeps its own `userData.show_phone` etc. The two never sync (see `docs/improvements.md`).

## Logout

* **No dedicated `/auth/logout` Edge Function.** The frontend simply `localStorage.clear()` (in `NotActive.jsx`) or omits logout entirely (`AdminDashboard` has a `Logout` button that just `setActiveTab('dashboard')` and clears state — see the file for details).
* The Supabase session is **not** revoked server-side.
