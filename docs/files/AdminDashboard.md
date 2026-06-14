# `src/pages/AdminDashboard.jsx`

**Location**: `src/pages/AdminDashboard.jsx` (217 lines)

## File Purpose

The admin SPA. Hosts the sidebar + main content area and switches between the four tabs (Dashboard, Users, Payments, Cards). Owns the shared `users` and `payments` arrays that the child views read and update.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State. |
| `useNavigate` | `react-router-dom` | Routing. |
| `supabase` | `../supabaseClient` | `getSession`, `signOut`. |
| `ThreeDot` | `react-loading-indicators` | Top-level loader. |
| `Menu` | `lucide-react` | Mobile sidebar toggle. |
| `Sidebar` | `../components/Sidebar` | Nav. |
| `Header` | `../components/Header` | Top bar (with a `name` prop). |
| `Dashboard` | `../components/comp_views/Dashboard` | Charts view. |
| `Users` | `../components/comp_views/Users` | Users tab. |
| `Cards` | `../components/comp_views/Cards` | Cards placeholder. |
| `Payments` | `../components/comp_views/Payments` | Payments tab. |

## Exports

### `AdminDashboard` (default)

## Internal State

| State | Purpose |
|-------|---------|
| `activeTab` | Currently selected tab. Persisted in `localStorage.adminActiveTab`. |
| `loading` | Set to false only after the role check passes. |
| `isSidebarOpen` | Mobile drawer open/closed. |
| `sessionUser` | The Supabase `user` object. |
| `users` | Array of merged Auth + routes data, refreshed on demand. |
| `payments` | Array of payment rows, refreshed on demand. |
| `dataLoading` | True while `refreshData` is in flight. |

## Internal Logic

### `handleLogout`
Clears `adminActiveTab` from localStorage, signs out, navigates to `/admin`.

### `refreshData`
Called on initial load (after the role check) and whenever a child view calls its `onRefresh`. Sends parallel `fetch` to:
* `…/functions/v1/list-users` — returns the merged user list.
* `…/functions/v1/list-payments` — returns the payment rows.
* Each with the admin's JWT in `Authorization: Bearer …`.
* Logs non-2xx responses but does not throw.

### Role check (on mount)
1. Read session.
2. If no session → navigate to `/admin`.
3. If `role !== 'admin'` → navigate to `/admin`.
4. Otherwise → set `sessionUser`, `loading = false`, and call `refreshData()`.

### `renderContent`
Switch on `activeTab`:
* `dashboard` → `<Dashboard users payments loading onRefresh />` inside a scroll container.
* `users` → `<Users users setUsers loading onRefresh />`.
* `payments` → `<Payments payments setPayments loading onRefresh />`.
* `cards` → `<Cards />` (placeholder).
* `settings` → "⚙️ Settings Panel" placeholder.
* default → Dashboard.

### Render
* Top-level loader while `loading` is true.
* Otherwise: a header (with hidden-on-mobile title, mobile menu icon, welcome text) and a flex row of `<Sidebar />` + `<main>` containing the active view.

## Dependencies

* `components/{Sidebar, Header, comp_views/Dashboard, comp_views/Users, comp_views/Payments, comp_views/Cards}`.
* `supabaseClient`.
* `supabase/functions/list-users`, `supabase/functions/list-payments`.

## Used By

* `src/App.jsx` (lazy-loaded at `/admin/dashboard`).

## Risks

* `Header` is imported but never actually rendered. (The header markup is inlined at the top of this component instead.) Dead import.
* `users` is passed both to `<Users>` and to `<Dashboard>`. The two views each maintain their own local copy — they are not synchronised, so optimistic updates from one won't appear in the other.
* `localStorage` keys are not namespaced; using a key like `adminActiveTab` could collide with other code.
