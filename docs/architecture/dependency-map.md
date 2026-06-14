# Dependency Map

A complete picture of *what* the project depends on, *why*, and what would break if any dependency were removed.

## 1. Runtime dependencies (`package.json`)

| Package | Version | Why it's used | What breaks if removed |
|---------|---------|---------------|------------------------|
| `react` | ^19.1.0 | UI library. | The whole app. |
| `react-dom` | ^19.1.0 | Mounts React in the browser. | The whole app. |
| `react-router-dom` | ^7.7.0 | SPA routing. `BrowserRouter` in `main.jsx`, `Routes` / `Route` / `useNavigate` / `useParams` throughout. | All navigation breaks; landing page still renders but every internal link dies. |
| `@supabase/supabase-js` | ^2.52.0 | Powers `src/supabaseClient.js` (anon client) and is used by `services/*` for auth, queries, storage, edge function invokes. | Login, profile reads/writes, avatar upload, increment-view-count all break. |
| `@fortawesome/react-fontawesome` | ^0.2.3 | Renders FontAwesome icons. | Many icons disappear. |
| `@fortawesome/free-solid-svg-icons` | ^6.7.2 | Solid icon set (Phone, Envelope, Lock, …). | Same. |
| `@fortawesome/free-brands-svg-icons` | ^7.0.0 | Brand icons (LinkedIn, WhatsApp, Instagram, …). | Social-link icons disappear. |
| `@fortawesome/free-regular-svg-icons` | ^7.0.0 | Regular icon set (currently imported but not heavily used). | Minor. |
| `@gsap/react` | ^2.1.2 | `useGSAP` hook for GSAP. | Landing animations and UserView entrance animations break. |
| `gsap` | ^3.13.0 | Animation engine + `ScrollTrigger`. | All scroll-driven animations break. |
| `@headlessui/react` | ^2.2.9 | Listed but not currently imported anywhere in the source. | Nothing observable. |
| `@react-three/drei` | ^10.7.4 | 3D helpers. | Not actually used in source (3D animation is plain SVG). |
| `@react-three/fiber` | ^9.3.0 | React renderer for Three.js. | Same. |
| `three` | ^0.179.1 | 3D engine. | Same. |
| `maath` | ^0.10.8 | Math helpers. | Same. |
| `@tailwindcss/vite` | ^4.1.11 | Tailwind v4 Vite plugin (no PostCSS needed). | Tailwind classes stop generating; styling breaks. |
| `tailwindcss` | ^4.1.11 | Utility CSS framework. | Same. |
| `browser-image-compression` | ^2.0.2 | Compresses avatars in `UserDashboard`. | Larger avatars would still upload but storage cost and slow loads would increase. |
| `lucide-react` | ^0.525.0 | Icon set (Save, Eye, X, Menu, Loader2, Wallet, Users, etc.). | Many icon-only buttons break. |
| `qrcode` | ^1.5.4 | QR generation in `UserInfo.jsx` → `QrDisplay.jsx`. | Admin cannot download a route's QR. |
| `react-easy-crop` | ^5.5.0 | Avatar cropper. | Cannot adjust avatar framing. |
| `react-loading-indicators` | ^1.0.1 | `ThreeDot` loaders. | Loaders show nothing (blank). |
| `react-parallax-tilt` | ^1.7.307 | Tilt effect. | Not currently imported. |
| `react-phone-number-input` | ^3.4.12 | Country flag + dial code input on `GetInfo.jsx`. | Phone field becomes a plain input. |
| `react-vertical-timeline-component` | ^3.5.3 | Vertical timeline. | Not currently imported. |
| `recharts` | ^3.6.0 | Admin `Dashboard` chart (Area + Bar). | Admin sees empty chart frames. |

## 2. Dev dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build / dev server. |
| `@vitejs/plugin-react` | React Fast Refresh + Babel transform. |
| `eslint` | Linter. |
| `@eslint/js` | Recommended rules preset. |
| `globals` | Browser globals for ESLint. |
| `eslint-plugin-react-hooks` | Enforces rules of hooks. |
| `eslint-plugin-react-refresh` | Catches issues with Fast Refresh boundaries. |
| `@types/react`, `@types/react-dom` | TypeScript ambient types (project is JS, so these are only used by IDEs). |

## 3. External services (not in `package.json`)

| Service | Where it's called from | Purpose |
|---------|----------------------|---------|
| **Supabase** (project `yowckahgoxqfikadirov`) | All `services/*` and `supabase/functions/*` | Postgres + Auth + Storage + Edge Functions. |
| **Razorpay** | `GetInfo.jsx` (browser SDK) + `create-order` / `verify-payment` / `razorpay-webhook` | Payment processing. |
| **Resend** | `verify-payment` Edge Function | Sends welcome / technical-error emails. |
| **n8n webhook** | `Chatbot.jsx` | AI chatbot backend (`n8n-szm5.onrender.com/webhook/pixy-chat`). |
| **WhatsApp** | Multiple components (modal links, email templates, chatbot fallback) | Customer support handoff (`+91 9188802136`). |
| **Vercel** | `vercel.json` + implicit deployment | Hosting + SPA rewrites. |

## 4. Internal dependency graph

```
main.jsx
  └─ App.jsx
        ├─ LandingPage
        │    ├─ Land/NfcAnimation
        │    ├─ Land/Services
        │    ├─ Land/Features
        │    ├─ Land/Pricing
        │    ├─ Land/About
        │    ├─ Land/Footer
        │    └─ Chatbot
        ├─ PublicUserPage
        │    ├─ services/userService  ── supabaseClient
        │    ├─ components/UserView
        │    └─ UserNotFound
        ├─ UserLogin
        │    └─ services/supabaseService
        ├─ UserDashboard
        │    ├─ services/userService
        │    ├─ services/themes
        │    ├─ crop/cropUtils
        │    ├─ components/EditableField
        │    ├─ components/ThemeColorPicker
        │    ├─ components/UserView
        │    ├─ components/Spinner
        │    └─ components/Notactive
        ├─ AdminLogin
        │    └─ services/supabaseService
        ├─ AdminDashboard
        │    ├─ components/Sidebar
        │    ├─ components/Header
        │    └─ components/comp_views/{Dashboard,Users,Payments,Cards}
        │         └─ (each) depends on services/adminService, supabaseClient, components/*
        ├─ GetInfo
        │    └─ components/PaymentSuccess
        ├─ ForgotPassword
        │    └─ services/supabaseService
        ├─ UpdatePassword
        │    └─ services/supabaseService
        └─ legal/* (no internal deps)

services/adminService   → supabase/functions/{assign-route, remove-route, renew-expiry, delete-user}
services/userService    → supabase/functions/{get-user-profile, increment-view-count}
services/supabaseService→ supabase/functions/{user-login, admin-login}   (and direct supabase.auth)
components/comp_views/Payments  → supabase/functions/delete-payments
components/comp_views/UserList  → supabase/functions/toggle-route-status
components/comp_views/UserInfo  → supabase/functions/{toggle-route-status, delete-user, renew-expiry, assign-route, remove-route}
```

## 5. Why this dependency footprint is large for the size of the project

The project is essentially a single SPA + 14 Edge Functions but lists ~25 npm packages. The most striking observations:

* `@react-three/drei`, `@react-three/fiber`, `three`, `maath`, `react-parallax-tilt`, `react-vertical-timeline-component`, `@headlessui/react`, `@fortawesome/free-regular-svg-icons` are **listed but never imported**. They can be safely uninstalled to reduce install time and bundle size (the manual `vendor` chunk only bundles `react`, `react-dom`, `react-router-dom`).
* The "3D" experience on the landing page is actually a hand-coded SVG animation; no real 3D code exists.

## 6. Build-time optimisation

`vite.config.js` declares a manual chunk:

```js
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
}
```

This is good for caching, but heavy libraries like `gsap`, `recharts`, `@fortawesome/*` and `react-easy-crop` are still in the main bundle. See `docs/improvements.md` for recommendations.
