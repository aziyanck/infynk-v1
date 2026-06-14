# `src/components/comp_views/QrDisplay.jsx`

**Location**: `src/components/comp_views/QrDisplay.jsx` (122 lines)

## File Purpose

Renders the QR code for a user's public route. Used in the user info drawer and assign-route confirmation. Encodes the public URL as a base64 PNG via the `qrcode` package.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State. |
| `QRCode` | `qrcode` | PNG generation. |
| `Copy, Check, ExternalLink, QrCode` | `lucide-react` | Icons. |

## Exports

### `QrDisplay` (default)
Props: `slug` (the route id), `compact` (boolean, hides actions), `isOpen` (boolean, used as a key for the effect).

## Internal Logic

* `useEffect` (when `slug` or `isOpen` changes):
  * Sets `qrCodeUrl = ''`.
  * Calls `QRCode.toDataURL(url, { width: 256, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } })`.
  * Stores the base64 data URL in state. On error → set `error`.
* Computes the public URL: `const url = \`${window.location.origin}/${slug}\`;`.
* `handleCopy` → `navigator.clipboard.writeText(url)`.
* Renders a 256x256 `<img>` (or a 64x64 thumbnail when `compact`). Below the image: a slug pill, an "Open" external link, and a "Copy" button.

## Used By

* `src/components/comp_views/UserInfo.jsx`.
* `src/components/comp_views/AssignRoute.jsx` (in the success toast).

## Risks

* `url` is computed from `window.location.origin` — fine in production but in the Edge Function preview (or local `npm run preview` on a different port) it shows the dev URL.
* The QR encodes a URL; visitors who scan a tampered slug will land on Pixiic's 404. There is no per-slug rate-limiting or proof-of-ownership check on the QR generator.
