# `src/pages/UserNotFound.jsx`

**Location**: `src/pages/UserNotFound.jsx` (87 lines)

## File Purpose

A dedicated 404 page used **only by the public profile flow** when `getUserProfileByRouteId` returns nothing (route missing / inactive / expired).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `Link` | `react-router-dom` | Home link. |

## Exports

### `UserNotFound` (default)

## Internal Logic

* Big "Oops!" heading, "User Not Found" red badge, explanatory text.
* Hand-drawn SVG of a broken NFC card with two halves animating in opposite directions (`@keyframes breakLeft` / `breakRight`).
* "Go Back Home" button.

## Dependencies

None.

## Used By

* `src/pages/PublicUserPage.jsx`.

## Risks

None.
