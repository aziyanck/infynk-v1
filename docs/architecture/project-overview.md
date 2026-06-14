# Project Overview — Pixiic

## 1. What is Pixiic?

Pixiic is a smart technology brand offering **NFC-based digital business card solutions**. The platform combines a physical NFC card (PVC, Wooden, or Metal) with a cloud-hosted digital profile that any modern smartphone can read by simply tapping the card or scanning a QR code.

The product line currently shipping:

* **PVC NFC Card** (active)
* **Wooden NFC Card** (planned)
* **Metal NFC Card** (planned)

After purchase, customers receive:

1. A printed NFC card with their custom design.
2. A login to `pixiic.com/user` where they can manage their digital profile in real time.
3. A shareable public URL of the form `https://pixiic.com/<route-id>` that the NFC chip is encoded with.

## 2. Project Purpose

The codebase is a **single-page React application** that:

* Serves a marketing landing page (services, features, pricing, about).
* Provides a checkout / order intake form backed by Razorpay.
* Issues Supabase Auth credentials after a successful payment.
* Provides a **User Dashboard** for editing the digital profile (avatar, bio, social links, theme color, contact info, visibility toggles).
* Provides an **Admin Dashboard** for the internal team to create users, assign NFC route IDs, toggle status, renew subscriptions, view payments, and delete users.
* Serves a **Public Profile Page** at `/{slug}` that anyone can view when tapping the card or scanning the QR code.

## 3. Main Features

### For end-users (card holders)
* Real-time profile editing with image cropping.
* Public profile with avatar, name, designation, company, bio, contact buttons, and 16 social link slots.
* "Save Contact" button that downloads a `.vcf` (iOS) or `.csv` (Android) file.
* Theme color picker for the digital profile (10 themes).
* Visibility toggles per field (each contact / social can be hidden).
* Password reset via Supabase email.
* In-app AI Chatbot (powered by an n8n webhook) that escalates to WhatsApp when offline.
* View-count analytics on the user's own dashboard.

### For admins
* Centralized user list (search, sort, filter by Unassigned / Inactive / Expired).
* Create user or admin accounts (calls `create-user` Edge Function).
* Assign a route ID to a user (`assign-route` Edge Function).
* Remove a route (`remove-route`).
* Toggle a route between Active / Inactive (`toggle-route-status`).
* Renew a route's expiry by +1 year (`renew-expiry`).
* Delete a user completely (cascade: route → profile → auth).
* Generate a downloadable QR code pointing to the user's public profile.
* Dashboard with monthly revenue (Area chart) and active users (Bar chart) using Recharts, plus a CSV export.
* Payments table with search, date range filter, bulk select and bulk delete.

### For visitors
* Public profile page at `/{slug}` with the same data the owner has chosen to display.
* View counter increments once per page visit (`increment-view-count` Edge Function → `analytics` table via `increment_view_count` Postgres RPC).

## 4. Target Users

| Audience | Interaction |
|----------|-------------|
| **Card holder (customer)** | Buys an NFC card, logs in at `/user`, edits their digital profile, scans / taps their card. |
| **Prospect / visitor** | Taps the NFC card on a phone or scans the QR code → lands on `/{slug}` → can save contact or open links. |
| **Pixiic staff (admin)** | Logs in at `/admin`, manages users, payments, and routes. |
| **Support / Sales** | Receive the WhatsApp message that the email template auto-fills after a successful purchase. |

## 5. Business Logic

### Purchase → Activation flow
1. Visitor opens `/getinfo`, fills in name, email, phone, address, plan, qty, card type, account type, company (optional).
2. Frontend calls `create-order` Edge Function, which creates a Razorpay order for the right amount (`planPrice + extraQty * single_item`, in paise).
3. Razorpay checkout modal opens. On success, frontend calls `verify-payment` Edge Function with the payment signature.
4. `verify-payment` verifies the HMAC-SHA256 signature, inserts a `payments` row, creates a Supabase Auth user with a random 8-char temp password and `app_metadata.role = "user"`, sends a welcome email via Resend, and returns success.
5. The customer receives the email with a pre-filled WhatsApp link to design their card, plus the temp password.
6. An admin uses `/admin` → Users → `Assign Route` to bind a route_id to that user. The user can then log in at `/user`, edit their profile, and share `pixiic.com/<route_id>`.

### Subscription / Renewal
* On `assign-route`, `expiry_date` is set to today + 365 days.
* On `renew-expiry`, `expiry_date` is incremented by 1 year (from current expiry, or today if expired).
* When `is_active = false` or `expiry_date < today`, the public profile endpoint `getUserProfileByRouteId` returns nothing → the visitor sees `UserNotFound`.

### Visibility logic
* The dashboard has a `show_*` boolean per field stored in the `profiles` table.
* The dashboard filters the `profile` object with `null` for hidden fields before building the `previewUser` passed to `UserView`.
* The public profile page only fetches a row that joins `public_profiles ⋈ routes ⋈ !expired` — the `show_*` flags are checked client-side inside `UserView`.

## 6. Core Workflows

### End-to-end purchase
Visitor → Landing → GetInfo → Razorpay → verify-payment (DB + Auth + Email) → Admin assigns route → User edits profile → Visitor taps card → Public Profile.

### End-to-end profile edit
User logs in → `get-user-profile` Edge Function → fetches `profiles` row + `analytics.view_count` → frontend stores in `useState` → user edits form fields → `Save Changes` → `supabase.from("profiles").update(...)` → alert on success.

### End-to-end admin user management
Admin logs in → `list-users` Edge Function returns merged Auth + routes data → rendered as table → click row → `UserInfo` modal → assign / remove / toggle / renew / delete via respective Edge Functions.

## 7. Tech Stack (high level)

* **Build**: Vite 7 + `@vitejs/plugin-react`
* **UI**: React 19, Tailwind CSS 4 (`@tailwindcss/vite`)
* **Routing**: react-router-dom 7 (BrowserRouter, lazy loading)
* **Animation**: GSAP + `@gsap/react` + `ScrollTrigger`
* **3D**: Three.js + React Three Fiber + drei + maath (`NfcAnimation` on landing)
* **Charts**: Recharts
* **Icons**: FontAwesome (`@fortawesome/react-fontawesome`, `free-solid-svg-icons`, `free-brands-svg-icons`, `free-regular-svg-icons`)
* **Image**: `react-easy-crop`, `browser-image-compression`
* **QR**: `qrcode`
* **Phone**: `react-phone-number-input`
* **Loaders**: `react-loading-indicators` (ThreeDot)
* **Other**: `lucide-react` (icons), `recharts`, `react-parallax-tilt`, `react-vertical-timeline-component`, `@headlessui/react`
* **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions / Deno)
* **Payments**: Razorpay (order + signature verification on the Edge Function)
* **Email**: Resend
* **Chatbot**: n8n webhook (`n8n-szm5.onrender.com/webhook/pixy-chat`)
* **Hosting**: Vercel (SPA rewrite for client-side routing, see `vercel.json`)

## 8. Environment & Configuration

* `vite.config.js` – registers the Tailwind and React plugins, and configures a manual `vendor` chunk for `react` / `react-dom` / `react-router-dom`.
* `.env` (gitignored) – contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Only the *anon* key is hard-coded in `src/supabaseClient.js`. **The service role key in `.env` is a serious leak** (see `docs/improvements.md`).
* `vercel.json` – rewrites all non-asset, non-`robots.txt`, non-`sitemap.xml`, non-`*.glb` requests to `/` so the SPA routing works on Vercel.
* `robots.txt` – disallows `/admin`, `/user`, `/payment-success`.
* `eslint.config.js` – flat config, recommended rules + react-hooks + react-refresh.
* `supabase/config.toml` – registers 14 Edge Functions, all with `verify_jwt = true`.

## 9. Where to start reading

1. `index.html` (entry).
2. `src/main.jsx` (ReactDOM mount + BrowserRouter).
3. `src/App.jsx` (route table, lazy loading).
4. `src/supabaseClient.js` (Supabase client).
5. `src/services/` (data access layer).
6. `src/pages/` (one folder per route).
7. `supabase/functions/` (backend business logic).

See the rest of the documentation under `docs/` for full detail.
