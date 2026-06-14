# `src/components/Notactive.jsx`

**Location**: `src/components/Notactive.jsx` (44 lines)

## File Purpose

The "Your session has expired" page. Shown by `UserDashboard` when `get-user-profile` fails (e.g. token expired / user deleted).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `AppWindow, RefreshCw` | `lucide-react` | Icons. |

## Exports

### `NotActive` (default)

## Internal Logic

* Renders a card with a stylized browser + refresh icon, an explanation, and a "Login" button.
* `handleLogin` clears `localStorage` and navigates to `/user` via `window.location.href` (full reload).

## Used By

* `src/pages/UserDashboard.jsx`.

## Risks

* `localStorage.clear()` wipes *everything*, including unrelated keys.
* Full-page reload on click is heavy-handed.
