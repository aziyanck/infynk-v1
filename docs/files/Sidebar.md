# `src/components/Sidebar.jsx`

**Location**: `src/components/Sidebar.jsx` (85 lines)

## File Purpose

The admin dashboard's left navigation. Five items: Dashboard, Users, Payments, Cards, Settings. Mobile drawer style.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| 6 FontAwesome solid icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` | Icons. |

## Exports

### `Sidebar` (default)
Props: `activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, onLogout`.

## Internal Logic

* `navItems` — hard-coded 5-item list.
* `handleMenuItemClick(key)` — sets `activeTab` and closes the sidebar (mobile).
* Renders a mobile overlay + the sidebar itself. Active item is highlighted with `bg-gray-200 text-blue-600`.
* Bottom: a "Logout" button that calls `onLogout`.

## Used By

* `src/pages/AdminDashboard.jsx`.

## Risks

* The "Settings" item is decorative; the dashboard tab is a placeholder.
