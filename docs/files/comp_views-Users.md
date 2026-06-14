# `src/components/comp_views/Users.jsx`

**Location**: `src/components/comp_views/Users.jsx` (28 lines)

## File Purpose

The "Users" tab in the admin dashboard. Simply a `<UserList />` wrapper that draws a section title and a subtitle. Holds the search/filter state.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `UserList` | `./UserList` | Sub-component. |

## Exports

### `Users` (default)
Props: `users`, `onViewUser(userId)`, `onDeleteUser(userId)`, `onAssignRoute(userId)`, `isLoading`.

## Internal Logic

* Renders a header + subtitle + `<UserList users={...} onViewUser={...} ... />`.
* No state of its own.

## Used By

* `src/pages/AdminDashboard.jsx` (activeTab === 'users').

## Risks

None.
