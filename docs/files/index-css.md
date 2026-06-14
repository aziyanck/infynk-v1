# `src/index.css`

**Location**: `src/index.css` (11 lines)

## File Purpose

Global stylesheet. Imports Tailwind v4 and declares the brand CSS variables consumed by the rest of the application.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `@import "tailwindcss";` | Tailwind v4 | Loads the utility classes used by every JSX file. |

## Internal Logic

```css
@theme {
  --color-brand: var(--brand-color);
  --color-brand-hover: var(--brand-hover-color);
}

:root {
  --brand-color: #035c19;          /* default green-600 */
  --brand-hover-color: #018024;    /* default green-500 */
}
```

* The `@theme` directive registers two custom Tailwind colors (`text-brand`, `bg-brand`, `text-brand-hover`, `bg-brand-hover`, `border-brand`, …).
* The values come from CSS variables, so they can be overridden in real time (e.g. by `getComputedStyle(document.documentElement).getPropertyValue('--brand-color')` in `GetInfo.jsx`).
* The default brand color is dark green, not the blue used in some screenshots; Pixiic evidently re-themes it for marketing pages.

## Dependencies

* Loaded by `src/main.jsx`.
* Consumed by every component that uses `bg-brand` / `text-brand` / `border-brand` (very common on the landing page and dashboard).

## Used By

* All JSX files (via `className="bg-brand"` etc.).
* The Razorpay checkout theme in `GetInfo.jsx` reads `--brand-color` to style the modal.

## Risks

* Hard-coded green default. If the product should be green everywhere, this is fine; if it should pick up a per-tenant theme, the variables need to be set per render.
