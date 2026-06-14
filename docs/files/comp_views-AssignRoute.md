# `src/components/comp_views/AssignRoute.jsx`

**Location**: `src/components/comp_views/AssignRoute.jsx` (195 lines)

## File Purpose

The "Assign a public route" modal. Lets the admin enter a unique slug, choose card type, and submit to create or replace the user's route.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State. |
| `X, User, Link2, CreditCard, AlertCircle, Loader` | `lucide-react` | Icons. |
| `themes` | `../../services/themes` | Accent color. |

## Exports

### `AssignRoute` (default)
Props: `userId, isOpen, onClose, onSuccess`.

## Internal Logic

* Form state: `routeSlug`, `cardType` ('PVC' | 'Wooden' | 'Metal').
* `useEffect` (when `isOpen`):
  * Calls `getUserById(userId)` (broken — see `UserInfo.md`).
  * Prefills `routeSlug` with the current `routes[0].route_id` if it exists.
  * Sets `cardType` to `routes[0].card_type` if present.
* Slug validation: client-side `^[a-z0-9-]+$` regex, plus a debounced check via `adminService.checkRouteAvailability(slug)` → red warning if taken.
* `handleSubmit`:
  * Calls `assignRouteToUser(userId, slug, cardType)`.
  * On success → `onSuccess(slug)`, then `onClose()`.
* Modal renders a backdrop + centred card with three field groups (slug, card type) and a sticky footer with Cancel + Assign buttons.

## Used By

* `src/pages/AdminDashboard.jsx` (passed as `onAssignRoute`).

## Risks

* `getUserById` and `checkRouteAvailability` and `assignRouteToUser` — only the last one exists in `adminService`. The first two are unimplemented.
* `Metal` is selectable in the dropdown but the Edge Function's `_shared/pricingConfig.ts` does not support it. Selecting Metal + clicking Assign will succeed on the frontend, but the subsequent `create-order` call will fail with `"Invalid Card Type"`.
