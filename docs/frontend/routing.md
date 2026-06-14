# Frontend — Routing

## Route table (`App.jsx`)

| Path | Element | Lazy? |
|------|---------|-------|
| `/` | `LandingPage` | no (eager) |
| `/user` | `UserLogin` | yes |
| `/admin` | `AdminLogin` | yes |
| `/dashboard` | `UserDashboard` | yes |
| `/dashboard/...` | `UserDashboard` (the `...` is matched as a nested slug for sub-routes) | yes |
| `/getinfo` | `GetInfo` | yes |
| `/forgot` | `ForgotPassword` | yes |
| `/reset` | `UpdatePassword` | yes |
| `/success` | `SuccessPage` | yes (placeholder) |
| `/test-payment` | `TestPaymentPage` | yes (placeholder) |
| `/admin-dashboard` | `AdminDashboard` | yes |
| `/privacy-policy` | `PrivacyPolicy` | yes |
| `/terms-of-service` | `TermsOfService` | yes |
| `/cookie-policy` | `CookiePolicy` | yes |
| `:slug` | `PublicUserPage` | yes |
| `*` | `NotFound` | yes |
| (special) | `UserNotFound` rendered inside `PublicUserPage` when the lookup fails | inline |

## Behaviour

* `ScrollToTop` is mounted at the root and resets `window.scrollTo(0, 0)` on every `useLocation()` change.
* Every page except `LandingPage` is `React.lazy` + `Suspense` — they ship in separate chunks.
* The `:slug` route is the **catch-all**. It must come **last** in the route list. The other top-level routes take precedence because they are more specific.
* `/dashboard/...` is a *single* path (`/dashboard`) with no nested `<Routes>`; the trailing `...` is not parsed by React Router. The dashboard reads `window.location.pathname` if it needs to know the slug.

## Risks

* `:slug` matches everything, including unknown routes that should hit `NotFound`. The current `App.jsx` lists `*` **after** `:slug`, so the `NotFound` route is shadowed for unknown URLs.
* The slug matcher will happily resolve `/admin` → `UserNotFound` if `:slug` is processed first; in practice React Router matches in order, so the literal `/admin` wins.
