# `src/components/comp_views/UserList.jsx`

**Location**: `src/components/comp_views/UserList.jsx` (187 lines)

## File Purpose

The list of users shown in the admin "Users" tab. Handles loading state, empty state, per-row actions, and pagination.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect, useRef }` | `react` | State + scroll-spy. |
| `FontAwesomeIcon` + 4 solid icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Row icons. |
| `Spinner` | `../Spinner` | Loading. |

## Exports

### `UserList` (default)
Props: `users`, `onViewUser`, `onDeleteUser`, `onAssignRoute`, `isLoading`.

## Internal Logic

* `currentPage` state. 6 users per page.
* `useEffect(() => setCurrentPage(1), [users])` — resets to page 1 whenever the list changes.
* `useEffect(() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), [currentPage])` — keeps the scroll on top of the list on page change.
* `formatDate(isoString)` — DD-MM-YYYY, falls back to "Never".
* Click handlers bubble up to the parent via `onViewUser(user.id)`, `onDeleteUser(user.id)`, `onAssignRoute(user.id)`.
* Pagination footer: prev/next buttons + page indicator.

## Used By

* `src/components/comp_views/Users.jsx`.

## Risks

* The view does not expose a "create user" CTA — that lives elsewhere or is missing.
* The page size is hard-coded to 6.
