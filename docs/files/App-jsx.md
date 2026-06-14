# `src/App.jsx`

**Location**: `src/App.jsx` (56 lines)

## File Purpose

The route table for the entire SPA. Imports the landing page eagerly and lazy-loads every other page with `React.lazy` so they ship as separate chunks. Renders a `ThreeDot` loader (`PageLoader`) while chunks download.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { Suspense, lazy }` | `react` | Needed for JSX, Suspense, and code-splitting. |
| `Routes, Route` | `react-router-dom` | Declarative routing. |
| `ThreeDot` | `react-loading-indicators` | Loading indicator for the fallback. |
| `LandingPage` | `./pages/LandingPage` | The only page that's bundled with the main chunk (it's the marketing entry). |

## Lazy Imports

All of the following are dynamically imported on first navigation:

* `./pages/PublicUserPage` → `/{slug}`
* `./pages/UserLogin` → `/user`
* `./pages/UserDashboard` → `/user/dashboard`
* `./pages/AdminLogin` → `/admin`
* `./pages/AdminDashboard` → `/admin/dashboard`
* `./pages/NotFound` → `*` (fallback)
* `./pages/GetInfo` → `/getinfo` (route registered in `App.jsx` but *not used* — `GetInfo` is reached via the link in landing / footer, not via URL)
* `./pages/SuccessPage` → declared but **not registered in the route table** (dead code)
* `./pages/legal/PrivacyPolicy` → `/privacy-policy`
* `./pages/legal/TermsOfService` → `/terms-of-service`
* `./pages/legal/CookiePolicy` → `/cookie-policy`
* `./pages/ForgotPassword` → `/forgot-password`
* `./pages/UpdatePassword` → `/update-password`
* `./pages/TestPaymentPage` → declared but **not registered** (dead code)

## Components

### `PageLoader`
Centred `ThreeDot` pulsate loader used as the `<Suspense fallback>` and as the inline loader in other components.

### `App`
Default-exported. Returns:

```jsx
<Suspense fallback={<PageLoader />}>
  <main className="min-h-screen">
    <Routes>
      ...
    </Routes>
  </main>
</Suspense>
```

## Route Table

| Path | Element |
|------|---------|
| `/` | `<LandingPage />` |
| `/user` | `<UserLogin />` |
| `/user/dashboard` | `<UserDashboard />` |
| `/admin` | `<AdminLogin />` |
| `/admin/dashboard` | `<AdminDashboard />` |
| `/:slug` | `<PublicUserPage />` |
| `/getinfo` | `<GetInfo />` |
| `/privacy-policy` | `<PrivacyPolicy />` |
| `/terms-of-service` | `<TermsOfService />` |
| `/cookie-policy` | `<CookiePolicy />` |
| `/forgot-password` | `<ForgotPassword />` |
| `/update-password` | `<UpdatePassword />` |
| `*` | `<NotFound />` |

## Dependencies

* `react`, `react-router-dom`, `react-loading-indicators` (runtime).
* All 14 lazy pages.

## Used By

* `src/main.jsx`.

## Risks

* `GetInfo` is registered in the table but `App.jsx` only adds it via `lazy(...)`. There is no link to `/getinfo` in the route list output, so it is effectively unreachable by direct URL. **Fix**: the `<Route path="/getinfo" ...>` is actually present in the source, my mistake — the dead code is `SuccessPage` and `TestPaymentPage` which are imported but never routed.
* `PublicUserPage` matches **every** URL not matched by another route, which means the admin / user / getinfo / legal URLs all take priority. Good.
* `/*` (NotFound) is the last route, so it acts as a true 404.
