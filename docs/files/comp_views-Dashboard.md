# `src/components/comp_views/Dashboard.jsx`

**Location**: `src/components/comp_views/Dashboard.jsx` (94 lines)

## File Purpose

The Admin Dashboard "Overview" tab. Two Recharts visualisations (revenue by month, users by month) plus four KPI tiles (users, routes, active routes, total revenue). Pure presentational — all data is read from props.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `User, Users, Globe, Wallet` | `lucide-react` | KPI icons. |
| `ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid` | `recharts` | Charts. |

## Exports

### `Dashboard` (default)
Props: `users` (array of admin user rows), `payments` (array of payment rows), `routes` (array of route rows). The current `AdminDashboard.jsx` only passes `users` + `payments`; `routes` is unused.

## Internal Logic

* KPIs:
  * `users` count = `users.length`.
  * `revenue` = sum of `payments.map(p => p.amount)` (divided by 100 in `AdminDashboard` before passing).
  * `activeRoutes` = hard-coded placeholder `'N/A'` because `routes` is not wired in.
  * `newUsersThisMonth` = `users.length` of those whose `created_at` is in the current month.
* Monthly series: a hard-coded 6-month array `['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']` with empty values. **The chart will be empty** because nothing is mapped from real data into the series — likely intended to be filled by a future grouping helper.
* Renders two Recharts (AreaChart for revenue, BarChart for users) wrapped in a gradient tooltip card.

## Used By

* `src/pages/AdminDashboard.jsx` (activeTab === 'dashboard').

## Risks

* Empty charts in production. The data → series pipeline is missing.
* `activeRoutes` is the string `'N/A'`.
* `routes` prop accepted but never used.
