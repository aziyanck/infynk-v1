# `src/components/ThemeColorPicker.jsx`

**Location**: `src/components/ThemeColorPicker.jsx` (32 lines)

## File Purpose

A small swatch grid that lets the user pick a theme color. Used inside the dashboard preview modal.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `themes` | `../services/themes` | Palette. |

## Exports

### `ThemeColorPicker` (default)
Props: `themeKey, setThemeKey`.

## Internal Logic

* Maintains a local `theme` state initialised from `themes[themeKey]`. **Bug:** the `useEffect` dependency list is `[]` instead of `[themeKey]`, so the local `theme` state goes stale if the parent changes `themeKey` (e.g. after loading the profile from the server). The current usage in `UserDashboard` is fine because the user only clicks a swatch to set a *new* `themeKey`, but the component as a generic picker has a latent issue.
* Renders a 5-column grid of round buttons colored with each `themes[key].primaryColor`. The selected one gets a ring.

## Used By

* `src/pages/UserDashboard.jsx` (inside the preview modal).

## Risks

* The `useEffect([themeKey])` bug.
* The `console.log(themeKey)` debug call left in source.
