# `src/components/EditableField.jsx`

**Location**: `src/components/EditableField.jsx` (75 lines)

## File Purpose

A reusable row used in `UserDashboard` for each editable profile field. Combines a FontAwesome icon, a controlled input, and a visibility toggle (eye on/off) with a sliding switch.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `Eye, EyeOff` | `lucide-react` | Visibility icons next to the toggle. |
| `FontAwesomeIcon` | `@fortawesome/react-fontawesome` | The field icon. |
| `themes` | `../services/themes` | Pulls `themes.pixiic_light.primaryColor` for the toggle accent. |

## Exports

### `EditableField` (default)
Props: `label, type = 'text', name, placeholder, value, icon, visibility, onChange, onToggle, themekey = 'sky'`.

## Internal Logic

* Renders a flex row: icon + input on the left, toggle + eye icon on the right.
* `color` is a neutral gray for the icon (`#4b5563`).
* `primaryColor` always comes from `themes.pixiic_light.primaryColor` (`#2563eb`) so the dashboard UI is consistent regardless of the chosen profile theme.
* The toggle button uses `bg-[primaryColor]` when on, gray when off, and slides a small white circle.

## Used By

* `src/pages/UserDashboard.jsx` (16 times — for each social/contact field).

## Risks

* The `themekey` prop is accepted but never actually used in the JSX. The component always uses the editor theme for its toggle.
