# Frontend — Hooks & Side Effects

## `useEffect` hotspots

| File | Effect | Side effect |
|------|--------|-------------|
| `Chatbot.jsx` | mount | POST wake-up to n8n. |
| `UserDashboard.jsx` | mount | Fetch profile via Edge Function. |
| `UserDashboard.jsx` | `userData.color` change | Save to localStorage. |
| `UserDashboard.jsx` | modal `isOpen` change | Reset local form state. |
| `UserView.jsx` | mount / `user` change | GSAP animation. |
| `PublicUserPage.jsx` | mount / `slug` change | Fetch profile + increment view count. |
| `comp_views/UserInfo.jsx` | `isOpen` / `userId` | Fetch user detail. |
| `comp_views/AssignRoute.jsx` | `isOpen` | Prefill slug + card type. |
| `comp_views/QrDisplay.jsx` | `slug` / `isOpen` | Generate QR. |
| `comp_views/UserList.jsx` | `users` change | Reset page to 1. |
| `comp_views/ThemeColorPicker.jsx` | `[]` (broken) | Set local theme. |
| `comp_views/Dashboard.jsx` | mount | (none significant). |

## `useGSAP` / GSAP

Used for entrance animations in:
* `NfcAnimation.jsx` (timeline that loops).
* `Services.jsx`, `Features.jsx`, `Pricing.jsx`, `About.jsx` (one-shot scroll-trigger).
* `UserView.jsx` (entrance timeline).
* `PaymentSuccess.jsx` (mount fade-in).
* `Footer.jsx` (contact modal slide).

## Risks

* The `useGSAP` runs in a React effect-like wrapper. If the component remounts (e.g. because of state-driven key change), the timeline re-runs. `UserView` guards with `hasAnimated.current` to prevent replay; the others don't.
* The `Chatbot` effect uses a hard-coded `sessionId = 'user123'` — see `docs/files/Chatbot.md`.
* The broken `useEffect([])` in `ThemeColorPicker` is a stale-state bug; see `docs/files/ThemeColorPicker.md`.
