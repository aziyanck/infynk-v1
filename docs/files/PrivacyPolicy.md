# `src/pages/legal/PrivacyPolicy.jsx`

**Location**: `src/pages/legal/PrivacyPolicy.jsx` (112 lines)

## File Purpose

Static Privacy Policy page (6 sections: data collected, storage, profile visibility, usage, user rights, contact).

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `Link` | `react-router-dom` | "Pixiic" link back to `/`. |

## Exports

### `PrivacyPolicy` (default)

## Internal Logic

* Self-contained, no state. Renders the legal text inline.
* Uses `new Date().toLocaleDateString()` for the "Last updated" line (so it shows today's date every render — cosmetic).

## Used By

* `src/App.jsx` (lazy-loaded at `/privacy-policy`).

## Risks

* No real versioning / change tracking.
