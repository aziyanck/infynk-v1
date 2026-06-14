# `src/services/themes.js`

**Location**: `src/services/themes.js` (74 lines)

## File Purpose

Static theme palette consumed by `UserDashboard` (preview and editor) and `UserView` (public profile). Each theme defines four colors: `primaryColor`, `textColor`, `bgColor`, `lightColor`.

## Imports

None.

## Exports

`themes` — a plain object keyed by theme name. Available keys:

| Key | Primary | Text | Background | Light | Notes |
|-----|---------|------|------------|-------|-------|
| `dark` | `#1a1b1c` | `#dedfe0` | `#1a1b1c` | `#414345` | Dark mode. |
| `black` | `#282828` | `#282828` | `#ffffff` | `#f5f5f5` | Matte black on white. |
| `violet` | `#9a24c1` | `#9a24c1` | `#ffffff` | `#f5f3ff` | Purple. |
| `sky` | `#0a5096` | `#0a5096` | `#ffffff` | `#e9f4ff` | Default theme if `color` is unset. |
| `red` | `#b22424` | `#b22424` | `#ffffff` | `#fff1f1` | Red. |
| `emerald` | `#0c450c` | `#0c450c` | `#ffffff` | `#c5eac7` | Green. |
| `yellow` | `#cba200` | `#cba200` | `#1a1b1c` | `#f3ecd1` | Yellow on dark. |
| `pixiic_dark` | `#2563eb` | `#3b82f6` | `#000000` | `#111111` | Blue / black. |
| `pixiic_light` | `#2563eb` | `#2563eb` | `#ffffff` | `#eff6ff` | Blue on white. **Used by the dashboard editor** regardless of the user's theme. |
| `woody` | `#A05135` | `#A05135` | `#f5edd7ff` | `#e9c7a9ff` | Brown / cream (wooden card). |

## Internal Logic

Pure data; no functions. The only logic is in the consumers:

* `UserDashboard` and `UserView` map a `themeKey` (stored in the `profiles.color` column) to `themes[themeKey]`. They have a small backwards-compat shim that maps `pixic_light` → `pixiic_light` and `pixic_dark` → `pixiic_dark` (no-op, presumably a defensive remnant from a rename).
* The dashboard's editor always uses `themes.pixiic_light` so the editing experience is consistent regardless of the chosen profile theme.

## Dependencies

* Used by `UserView.jsx` and `UserDashboard.jsx` (and `EditableField.jsx`, which imports it but only uses `themes.pixiic_light.primaryColor`).

## Used By

* `src/components/UserView.jsx`
* `src/components/EditableField.jsx`
* `src/components/ThemeColorPicker.jsx`
* `src/pages/UserDashboard.jsx`

## Risks

* Theme names are stored as strings in the database. Renaming any key is a breaking change. The two legacy aliases are a hint that this has happened before.
* The themes are not themeable at runtime (CSS variables) — they are JS values applied via `style={{ backgroundColor: … }}`.
