# `src/pages/UserDashboard.jsx`

**Location**: `src/pages/UserDashboard.jsx` (925 lines)

## File Purpose

The most complex page in the application. The end-user dashboard for editing the digital profile: avatar upload + crop, theme picker, per-field visibility toggles, live preview, and save.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React, { useState, useEffect }` | `react` | State + lifecycle. |
| `Save, Eye, User, LogOut, LayoutDashboard, X` | `lucide-react` | Icons. |
| `FontAwesomeIcon` + a list of solid/brand icons | `@fortawesome/react-fontawesome` | Many social/contact icons. |
| `fetchUserProfile, updateUserProfile, uploadProfileImage` | `../services/userService` | Data access. |
| `useNavigate` | `react-router-dom` | Routing. |
| `supabase` | `../supabaseClient` | Session + sign out. |
| `NotActive` | `../components/Notactive` | "Session expired" page. |
| `ThreeDot` | `react-loading-indicators` | Loader. |
| `Cropper` | `react-easy-crop` | Avatar cropper. |
| `getCroppedImg` | `../crop/cropUtils` | Crop → blob URL. |
| `themes` | `../services/themes` | Theme palette. |
| `ThemeColorPicker` | `../components/ThemeColorPicker` | Color picker UI. |
| `Spinner` | `../components/Spinner` | Loaders inside buttons. |
| `UserView` | `../components/UserView` | Public-profile component, used here for the live preview. |
| `imageCompression` | `browser-image-compression` | Compresses avatars > 900 KB. |
| `EditableField` | `../components/EditableField` | Reusable field row with a visibility toggle. |

## Exports

### `UserDashboard` (default)
A functional component.

## Internal State (abridged)

| State | Purpose |
|-------|---------|
| `sessionUser` | The Supabase `user` object (for displaying the email/avatar in the user popup). |
| `themeKey` | Currently selected theme key. |
| `notActive` | When true, render `<NotActive />`. |
| `loading`, `saving`, `uploadingPhoto` | UI flags. |
| `imgLoading`, `imgError` | Avatar image state. |
| `cropModal`, `cropImgSrc`, `croppedAreaPixels`, `crop`, `zoom`, `rotation` | Cropper state, persisted to `localStorage` so a refresh does not lose the crop. |
| `profile` | The current profile object (name, bio, phone, …, `view_count`). |
| `visibility` | A flat object of booleans (`phone: true, email: true, …`). |
| `localImage` | Used to display the just-uploaded avatar without refetching. |
| `showUserPop`, `showThemePop`, `showPreview`, `showPreviewThemePop` | UI flags. |

## Internal Logic

### On mount

1. `checkUserRole` — read Supabase session; if no session, navigate to `/user`; otherwise store the user; if `role !== 'user'`, navigate back to `/user` (admins are kicked out).
2. `getProfile` — call `fetchUserProfile()` (which calls `get-user-profile`); on error, sign out and render `<NotActive />`; on success, populate `profile` (splitting `designation` on `;` to separate company name) and `visibility` (from the `show_*` columns).

### Editing

* `handleProfileChange(e)` — controlled input.
* `handleVisibilityToggle(field)` — flips a single flag in `visibility`.

### Avatar upload

* `handleImageUpload(file)` — reads the file via `FileReader.readAsDataURL`, sets `cropImgSrc` + `cropModal`, resets crop state.
* In the crop modal:
  1. `getCroppedImg` returns a blob URL.
  2. Convert to a File, compress with `imageCompression` if > 900 KB (target 500 KB).
  3. `uploadProfileImage(file, profile.id, profile.pr_img)` deletes the old image and uploads a new one named `${id}_${timestamp}.jpg` to the `profile-pictures` bucket.
  4. Persist the new URL with a partial `updateUserProfile({ id, pr_img })` call.
  5. Update local state + clear `localStorage` crop keys.

### Save

* `handleSave` builds an `updatedData` object:
  * Removes `view_count` and `companyName` from `profile`.
  * Concatenates `designation;companyName` back into the `designation` field (because the DB only stores one string).
  * Maps every `visibility.X` to `show_X`.
  * Sets `color: themeKey`.
  * `updateUserProfile(updatedData)` writes the row.
* Shows a native `alert()` on success or failure.

### Preview modal

* Constructs a `previewUser` whose:
  * `phone`/`email`/`whatsapp` are `null` when their visibility is off.
  * `socials` object only includes fields whose visibility is on.
  * `designation` is the `;`-joined string.
  * `color` is `themeKey`.
* Renders `<UserView user={previewUser} />` full-screen, with a theme picker in the corner and a Save button in the bottom-right.

## Dependencies

* `services/userService`, `services/themes`.
* `crop/cropUtils`.
* `components/{EditableField, ThemeColorPicker, UserView, Spinner, Notactive}`.
* `supabaseClient`.

## Used By

* `src/App.jsx` (lazy-loaded at `/user/dashboard`).

## Risks

* **Largest file in the project** (925 lines). Could be split into smaller hooks / sub-components.
* Heavy use of `localStorage` for crop state. If the schema of those keys changes, users will see stale state.
* `alert()` for save feedback is jarring; a toast system would be cleaner.
* Avatar compression runs on the main thread; very large images freeze the UI briefly.
* `getUserProfile` and `updateUserProfile` use the anon client; **the dashboard depends on RLS to prevent updating other users' rows** — if RLS is missing or misconfigured this is a privilege escalation.
* The `localStorage`-backed cropper state means the dashboard does not unmount when navigating away and back, which is desirable here, but worth noting.
