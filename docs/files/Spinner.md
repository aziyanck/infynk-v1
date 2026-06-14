# `src/components/Spinner.jsx`

**Location**: `src/components/Spinner.jsx` (21 lines)

## File Purpose

A pure-CSS Tailwind spinner used inside buttons.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |

## Exports

### `Spinner` (default)
Props: `size = 'sm'` (`sm | md | lg | xl`), `color = 'text-white'`.

## Internal Logic

Maps the `size` prop to Tailwind width/height classes. Renders a `<div role="status">` with `animate-spin` and an `sr-only` "Loading…" label.

## Used By

* `UserLogin`, `AdminLogin`, `UserDashboard`, `UserView`, `ForgotPassword`, `UpdatePassword`, `PublicUserPage`, `GetInfo` (in various ways).

## Risks

None.
