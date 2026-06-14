# Folder Structure

A complete map of the repository and the responsibility of every folder.

## Repository tree (annotated)

```
infynk-v1/
├── .env                      # SUPABASE_URL + service-role key (gitignored)
├── .gitignore
├── README.md                 # Vite template README (default, mostly stale)
├── PixicData.md              # Internal FAQ / brand content (gitignored)
├── demo                      # Legacy scratch file (gitignored)
├── eslint.config.js          # ESLint flat config
├── index.html                # Vite entry HTML, Poppins font, favicon
├── package.json              # Deps + scripts
├── package-lock.json
├── public/
│   ├── robots.txt            # Web crawlers rules
│   └── sitemap.xml           # Sitemap (static file)
├── report.txt                # Internal report (gitignored)
├── robots.txt                # Top-level crawler rules
├── vercel.json               # SPA rewrite rules for Vercel
├── vite.config.js            # Vite + React + Tailwind plugins, manual chunks
│
├── docs/                     # ← YOU ARE HERE (this documentation)
│
├── src/                      # React application source
│   ├── main.jsx              # Bootstraps React + BrowserRouter
│   ├── App.jsx               # Route table (lazy loaded)
│   ├── App.css               # Poppins font utility classes
│   ├── index.css             # Tailwind import + brand CSS variables
│   ├── Home.jsx              # (empty)
│   ├── UserControl.jsx       # (empty)
│   ├── supabaseClient.js     # Creates the Supabase client (anon key)
│   │
│   ├── assets/               # SVG logos
│   │   ├── logo.svg
│   │   ├── logo-favicon.svg
│   │   └── logo favicon-nb.svg
│   │
│   ├── components/           # Reusable UI primitives
│   │   ├── Chatbot.jsx           # Floating chat bubble + n8n webhook
│   │   ├── EditableField.jsx     # Reusable profile field row w/ visibility toggle
│   │   ├── Header.jsx            # Admin dashboard header
│   │   ├── Notactive.jsx         # "Session expired" page
│   │   ├── PaymentSuccess.jsx    # Overlay w/ verifying / success / failed / action-required
│   │   ├── Sidebar.jsx           # Admin sidebar nav
│   │   ├── Spinner.jsx           # Tailwind spinner
│   │   ├── ThemeColorPicker.jsx  # Color theme picker grid
│   │   ├── UserView.jsx          # Public profile card view
│   │   └── comp_views/           # Admin sub-views
│   │       ├── Dashboard.jsx     # Charts + KPI cards
│   │       ├── Users.jsx         # Users tab (parent)
│   │       ├── UserList.jsx      # Users table
│   │       ├── UserInfo.jsx      # Per-user detail modal
│   │       ├── AssignRoute.jsx   # Assign a route_id modal
│   │       ├── QrDisplay.jsx     # QR display modal
│   │       ├── Payments.jsx      # Payments table
│   │       └── Cards.jsx         # (placeholder)
│   │
│   ├── crop/
│   │   └── cropUtils.js          # createImage + getCroppedImg
│   │
│   ├── landing-components/   # Landing page-specific (currently only Navbar placeholder)
│   │   └── Navbar.jsx            # (empty file)
│   │
│   ├── pages/                # Route components
│   │   ├── LandingPage.jsx
│   │   ├── PublicUserPage.jsx
│   │   ├── UserLogin.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── NotFound.jsx
│   │   ├── UserNotFound.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── UpdatePassword.jsx
│   │   ├── GetInfo.jsx
│   │   ├── SuccessPage.jsx
│   │   ├── TestPaymentPage.jsx
│   │   ├── getInfo.css
│   │   ├── Land/                 # Landing sections
│   │   │   ├── NfcAnimation.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── About.jsx
│   │   │   └── Footer.jsx
│   │   ├── legal/                # Legal pages
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   └── CookiePolicy.jsx
│   │   └── outpages/
│   │       └── reset_password_email.html
│   │
│   └── services/             # Frontend data-access layer
│       ├── supabaseService.js    # Login / logout / reset password
│       ├── userService.js        # Public profile + dashboard profile
│       ├── adminService.js       # Admin: create user, assign/remove route, renew, delete
│       ├── themes.js             # Color theme palette
│       └── generateVCard.js      # vCard string builder (legacy / unused at runtime)
│
└── supabase/                 # Supabase project config + Edge Functions (Deno)
    ├── config.toml               # Functions registered here
    ├── .gitignore
    ├── .temp/                    # Supabase CLI cache
    ├── functions/
    │   ├── _shared/
    │   │   └── pricingConfig.ts  # Shared pricing table
    │   ├── admin-login/        index.ts, deno.json
    │   ├── assign-route/       index.ts, deno.json
    │   ├── create-order/       index.ts, deno.json
    │   ├── create-user/        index.ts, deno.json
    │   ├── delete-payments/    index.ts
    │   ├── delete-user/        index.ts
    │   ├── get-user-profile/   index.ts, deno.json
    │   ├── increment-view-count/  index.ts
    │   ├── list-payments/      index.ts
    │   ├── list-users/         index.ts, deno.json
    │   ├── razorpay-webhook/   index.ts, deno.json
    │   ├── remove-route/       index.ts, deno.json
    │   ├── renew-expiry/       index.ts
    │   ├── toggle-route-status/  index.ts, deno.json
    │   ├── user-login/         index.ts, deno.json
    │   └── verify-payment/     index.ts, deno.json, emailTemplate.ts
```

## Folder responsibilities

### `src/`
The React app. All UI and frontend logic lives here.

* `main.jsx`, `App.jsx`, `supabaseClient.js` — bootstrap layer.
* `pages/` — top-level components mounted by the router.
* `components/` — smaller reusable components and admin sub-views.
* `services/` — the data-access layer; encapsulates every Supabase query and Edge Function call.
* `crop/` — image-cropping helpers (used by `UserDashboard`).
* `landing-components/` — currently contains only a (deliberately) empty `Navbar.jsx`; the landing page builds its own header inline.
* `assets/` — static SVGs imported as React modules.

### `supabase/`
The backend. All server-side logic lives here as Deno-served Supabase Edge Functions. The project uses Supabase for:

* **Auth** (email + password) with custom role-based Edge Functions (`admin-login`, `user-login`).
* **Database** (PostgreSQL, schema not committed in this repo, but inferred from Edge Function code).
* **Storage** (avatar uploads to the `profile-pictures` bucket).
* **Edge Functions** (Deno) for privileged operations the client cannot do safely (admin writes, signature verification, etc.).

### `docs/`
This documentation tree.

### `public/`
Static assets served at the root URL. `robots.txt` and `sitemap.xml` are SEO helpers.

## Relationships between folders

```
index.html
  └─ src/main.jsx
        └─ src/App.jsx              ← imports from src/pages/*
              ├─ src/pages/LandingPage.jsx
              │     ├─ src/pages/Land/* (NfcAnimation, Services, Features, Pricing, About, Footer)
              │     └─ src/components/Chatbot.jsx
              ├─ src/pages/UserLogin.jsx ── src/services/supabaseService.js
              ├─ src/pages/UserDashboard.jsx
              │     ├─ src/services/userService.js
              │     ├─ src/services/themes.js
              │     ├─ src/crop/cropUtils.js
              │     ├─ src/components/EditableField.jsx
              │     ├─ src/components/ThemeColorPicker.jsx
              │     ├─ src/components/UserView.jsx
              │     ├─ src/components/Spinner.jsx
              │     └─ src/components/Notactive.jsx
              ├─ src/pages/AdminLogin.jsx ── src/services/supabaseService.js
              ├─ src/pages/AdminDashboard.jsx
              │     ├─ src/components/Sidebar.jsx
              │     ├─ src/components/Header.jsx
              │     └─ src/components/comp_views/*
              │           ├─ Dashboard.jsx  → src/supabaseClient.js
              │           ├─ Users.jsx      → UserList → UserInfo / AssignRoute / QrDisplay
              │           ├─ Payments.jsx   → src/supabaseClient.js
              │           └─ Cards.jsx
              ├─ src/pages/PublicUserPage.jsx ── src/services/userService.js + UserView
              ├─ src/pages/GetInfo.jsx
              │     └─ src/components/PaymentSuccess.jsx
              ├─ src/pages/legal/*
              ├─ src/pages/ForgotPassword.jsx ── src/services/supabaseService.js
              └─ src/pages/UpdatePassword.jsx ── src/services/supabaseService.js

src/services/adminService.js  ── supabase/functions/{assign-route, remove-route, renew-expiry, delete-user}
src/services/userService.js   ── supabase/functions/{get-user-profile, increment-view-count}
src/services/supabaseService.js ── supabase/functions/{admin-login, user-login}
src/pages/GetInfo.jsx        ── supabase/functions/{create-order, verify-payment}
src/pages/AdminDashboard.jsx ── supabase/functions/{list-users, list-payments}
src/components/comp_views/Users.jsx         ── supabase/functions/create-user
src/components/comp_views/Payments.jsx      ── supabase/functions/delete-payments
src/components/comp_views/UserList.jsx      ── supabase/functions/toggle-route-status
src/components/comp_views/UserInfo.jsx      ── supabase/functions/{toggle-route-status, delete-user}
```

## Empty / placeholder folders & files

* `src/Home.jsx`, `src/UserControl.jsx`, `src/landing-components/Navbar.jsx` — empty.
* `src/components/comp_views/Cards.jsx` — placeholder (`<h1>Cards</h1>`).
* `src/services/generateVCard.js` — present but **not imported anywhere in the live code path** (the "Save Contact" button in `UserView` builds a VCF inline instead).
* `src/pages/TestPaymentPage.jsx` — registered in `App.jsx` lazy routes but not in the route table (effectively dead code).
* `src/pages/outpages/reset_password_email.html` — an older standalone HTML page, not referenced anywhere.

## What is **not** in the repository

* No database migrations. The schema is implied by the queries (see `docs/database/schema.md`).
* No environment file. `.env` is gitignored.
* No tests, no Storybook, no CI configuration.
