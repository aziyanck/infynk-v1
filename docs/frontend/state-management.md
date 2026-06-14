# Frontend — State Management

The app does not use Redux / Zustand / Jotai. State is **component-local** with `useState` + a few `useRef`s, plus a single piece of cross-component state via `localStorage`.

## Per-page state owners

| Page | State owner | Notes |
|------|-------------|-------|
| `LandingPage` | itself | No shared state. |
| `UserLogin` | itself | Form state. |
| `AdminLogin` | itself | Form state. |
| `GetInfo` | itself | Form + Razorpay state. |
| `UserDashboard` | itself | The largest state owner — 30+ fields, 3 sub-modals. |
| `AdminDashboard` | itself | 4 tabs of state (users, payments). |
| `PublicUserPage` | itself | Loading + error. |
| `UserView` | itself | Theme, derived from props. |
| `Notactive` | itself | No state. |

## Cross-page state

| Key in `localStorage` | Producer | Consumer |
|----------------------|----------|----------|
| `access_token` | `user-login` / `admin-login` response | All admin / dashboard logic reads from here. |
| `user_role` | `user-login` / `admin-login` response | Route guard in `App.jsx`. |
| `user_id`, `user_email` | `user-login` / `admin-login` response | `UserDashboard` header. |
| `adminActiveTab` | `AdminDashboard` | `AdminDashboard` (initial state). |
| `currentRoute` | `UserDashboard` | `UserDashboard` (debug). |
| `showPhone`, `showEmail`, … | `UserDashboard` | **Stale**: the dashboard also keeps the same flags in `userData.show_phone` etc. |
| `selectedTheme` | `UserDashboard` | `UserDashboard` only. |

## The `localStorage` vs `userData` bug

`UserDashboard.jsx` reads visibility flags from **two places**:
* `localStorage.getItem('showPhone')` etc. — the persistence mechanism.
* `previewUser.show_phone` — the live profile row from Supabase.

The two are never reconciled. If a user toggles a flag, the localStorage is updated and the preview re-renders from the local state, but the **actual** Supabase row is only updated on "Save Changes" (which uses `updateUserProfile` on the `slug` only). After a page reload, the dashboard re-reads the Supabase row, and the localStorage values are stale.

## Risks

* No global state = prop-drilling + 4 different copies of "current user" in different pages.
* The `localStorage` dual-source bug is a latent UX issue.
* No caching of Supabase reads; every page mount re-fetches.
