# `src/pages/NotFound.jsx`

**Location**: `src/pages/NotFound.jsx` (66 lines)

## File Purpose

The 404 page. Renders a custom WiFi-style caution icon with a pulsing animation, the "404" heading, and a "Go Back Home" button.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | JSX. |
| `Link` | `react-router-dom` | The home link. |
| `WifiOff` | `lucide-react` | Imported but not actually used in the JSX. |

## Exports

### `NotFound` (default)

## Internal Logic

* Inline CSS keyframe `pulseCaution` for the SVG icon.
* Hand-drawn SVG of a WiFi-like icon with a caution triangle inside.
* Renders "404" + "Oops, This Page Not Found!" + "The link might be corrupted" / "or the page may have been removed".
* "GO BACK HOME" button linking to `/`.

## Dependencies

None.

## Used By

* `src/App.jsx` (lazy-loaded at `*`).

## Risks

* `WifiOff` is imported but never rendered. Dead import.
