# `src/components/comp_views/UserInfo.jsx`

**Location**: `src/components/comp_views/UserInfo.jsx` (180 lines)

## File Purpose

The "user details" drawer shown when the admin clicks the eye icon in `UserList`. Lets the admin view a user's full row and toggle route active/inactive.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State. |
| `X, Copy, Check, ToggleLeft, ToggleRight, Loader` | `lucide-react` | Icons. |
| `themes` | `../../services/themes` | Primary color. |

## Exports

### `UserInfo` (default)
Props: `userId, isOpen, onClose, supabaseUser, supabaseId`.

## Internal Logic

* `useEffect` (when `isOpen`) calls `getUserById(userId)` from `../../services/adminService`. Sets the local `user` state.
* `useEffect` (when `userId` changes) resets the local state so the next open shows fresh data.
* Renders 6 detail sections: Account, Profile, Route, Design, Payment, Timestamps. Each section lists the relevant `user.*` fields with copy-to-clipboard buttons where applicable.
* `handleCopy(text)` uses `navigator.clipboard.writeText`.
* `handleToggleRouteStatus` calls `toggleRouteStatus(userId)` from `adminService`. Disables the button and shows a Loader spinner while in flight.
* Slide-in panel from the right (Tailwind `translate-x`); backdrop closes on click.

## Used By

* `src/pages/AdminDashboard.jsx` (passed as `onViewUser` to `Users`).

## Risks

* `getUserById` is referenced from `adminService` but is **not defined there** (only `assignRouteToUser`, `removeRouteFromUser`, `renewRouteExpiry`, `deleteUserProfile`, `deleteAuthUser` exist). This will throw `TypeError: adminService.getUserById is not a function` in production. See `docs/improvements.md`.
* `toggleRouteStatus` is similarly missing.
