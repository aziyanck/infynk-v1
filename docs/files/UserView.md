# `src/components/UserView.jsx`

**Location**: `src/components/UserView.jsx` (565 lines)

## File Purpose

The **public profile card** view. Used both by the live `/{slug}` page and by the dashboard's preview modal. The most user-facing component in the app.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useRef, useState }` | `react` | Refs + state. |
| `FontAwesomeIcon` + 7 solid + 14 brand icons | `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` + `@fortawesome/free-brands-svg-icons` | Many icons. |
| `ThreeDot` | `react-loading-indicators` | Loader when `user` is undefined. |
| `gsap, useGSAP` | `gsap`, `@gsap/react` | Entrance animation. |
| `Spinner` | `./Spinner` | Image loader. |
| `themes` | `../services/themes` | Color palette. |

## Exports

### `UserView` (default)
Props: `user` (a profile row joined with route info).

### `ContactButton` (private)
Inline sub-component: a small icon + label button.

## Internal Logic

### Resolving the theme
* `let themeKey = user.color || 'sky';`
* Backwards-compat: maps `pixic_light` → `pixiic_light` and `pixic_dark` → `pixiic_dark` (no-op defensive code).
* `const currentTheme = themes[themeKey] || themes.sky;`

### Field fallbacks
* `fullName = user.name || user.fullName || 'Anonymous';`
* `profilePhoto = user.pr_img || user.profilePhoto || '/placeholder.jpg';`
* `designation = user.designation || 'User';`
* `bio = user.bio || '';`
* `contact` derived from `user.phone/email/whatsapp` or from `user.contact.*`.
* `socials` derived from `user.socials` (preferred) or directly from the `user` object (the public query path).

### `formatUrl(value, prefix)`
Smart URL builder:
* If the value already starts with `http://` or `https://`, return as-is.
* If it starts with `www.` or includes a known TLD, prefix with `https://`.
* Otherwise, return `${prefix}${value}`.

### `links`
Builds a list of 17 social link objects (LinkedIn, Twitter, Instagram, …, Custom Link 1, Custom Link 2, Location). Filters out nulls. The location field is special-cased to support `maps.google.com?q=…` lookups.

### `handleSaveContact`
On click:
* Detects `isAndroid` vs `iOS` (iOS gets a `.vcf` file with name/phone/email only; Android gets a `.csv`).
* Downloads via a hidden `<a download>` element.
* Note: the inline vCard is **simpler** than `services/generateVCard.js` and only contains name/phone/email.

### Render
* Card with the profile image (or a placeholder icon), full name, designation split on `;`, bio.
* Contact buttons (Call / Email / WhatsApp) in a 1/2/3-column grid based on how many are populated.
* Social links grid (1 col if only one, 3 cols otherwise).
* "Save Contact" button at the bottom (hidden if the only visible link is a Reviews link).
* "Powered by Pixiic" footer.

### Animation
A single GSAP timeline animates `.anim-card`, `.anim-profile`, `.anim-text`, `.anim-contact-btn`, `.anim-link`, `.anim-save` with a `hasAnimated` ref guard so it only runs once.

## Used By

* `src/pages/PublicUserPage.jsx` (live).
* `src/pages/UserDashboard.jsx` (preview modal).

## Risks

* **No visibility filtering on the public path.** The component reads `user.show_*` flags (e.g. `user.show_phone`, `user.show_instagram`) but the column names in the database (as referenced by the dashboard) are `show_*` and the dashboard is what maps them onto the `previewUser` shape. The public query path returns the row as-is — so **any private field is still visible to the public** unless the dashboard previewed the same user with `null` overrides.
* The "Save Contact" vCard is minimal (name/phone/email only). A rich vCard with social links would require using `services/generateVCard.js` (currently dead).
* The `formatUrl` heuristics are ad-hoc.
* `hasAnimated.current` is module-local by way of being inside a component instance — refreshing remounts the component and re-animates, which is the desired behavior.
