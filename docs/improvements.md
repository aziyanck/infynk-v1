# Improvements & Risk Register

This document lists every **concrete, actionable** issue found in the codebase. Items are grouped by severity and tagged with the file:line where possible.

## P0 — Critical (security / data loss)

### 1. `create-user` Edge Function accepts anonymous admin creation
**File:** `supabase/functions/create-user/index.ts:1-46`

The function has no auth check and accepts `role: "admin"` from the request body. Anyone with the project URL can mint a new admin user.

**Fix:** Remove the function entirely (it's not called by the frontend) or add a `verify_jwt = true` + role check.

### 2. `SUPABASE_SERVICE_ROLE_KEY` leak risk
**File:** `.env` (gitignored) + `vercel.json` history.

The service role key is the "god key" — it bypasses RLS for every table. If the `.env` was ever committed, or if the Vercel build history retains it, the project is compromised.

**Fix:**
* Verify the key is **not** in the git history (`git log -p | grep -i service_role`).
* Rotate the key in the Supabase dashboard.
* If you use a `service_role` key in the frontend bundle by mistake, rotate it immediately.
* Confirm `vercel.json` env injection doesn't leak it.

### 3. `list-payments` and `delete-payments` have no role check
**Files:** `supabase/functions/list-payments/index.ts:14-30`, `supabase/functions/delete-payments/index.ts:14-30`

Any signed-in user (not just admins) can read or delete every payment row.

**Fix:** Add `if (user.app_metadata?.role !== "admin") return 403`.

### 4. Two parallel `payments` insert paths with different shapes
**Files:** `supabase/functions/verify-payment/index.ts:61-81`, `supabase/functions/razorpay-webhook/index.ts:60-69`

`verify-payment` writes `razorpay_payment_id, razorpay_order_id, full_name, email, phone, address, account_type, company_name, plan, card_type, qty, payment_status, amount, user_id, created_at`.
`razorpay-webhook` writes `payment_id, amount, name, plan, paid, created_at`.

The same paid order can produce two rows with disjoint column names.

**Fix:** Pick one path. Recommend:
* Disable the webhook payment insert (or have it update a `razorpay_status` column instead).
* Add `UNIQUE(razorpay_payment_id)` for idempotency.
* Commit the schema in `supabase/migrations/`.

### 5. No idempotency on `verify-payment` or `create-order`
**Files:** `supabase/functions/verify-payment/index.ts`, `supabase/functions/create-order/index.ts`

If either is invoked twice, a user is double-charged and two Auth users are created.

**Fix:** Use Razorpay's `receipt` (already generated) as an idempotency key in the `payments` table. Reject duplicate receipts with 409.

## P0 — Critical (functional breakages)

### 6. Pricing drift between frontend and backend
**Files:** `src/pages/GetInfo.jsx` (PRICING_CONFIG), `src/pages/Land/Pricing.jsx` (plans), `supabase/functions/_shared/pricingConfig.ts`

Three different price sets. The user may see one price and be charged another. The "Metal Card" plan is selectable in the UI but **not supported** by the backend (returns `"Invalid Card Type"`).

**Fix:** Move pricing to a Supabase table, read it from a new `get-pricing` Edge Function, consume from `GetInfo.jsx` and `Land/Pricing.jsx`. Add `Metal Card` to the server config or remove it from the UI.

### 7. `comp_views/UserInfo.jsx` calls `adminService.getUserById` — does not exist
**File:** `src/components/comp_views/UserInfo.jsx:1-180`

The function is referenced in three places (`UserInfo`, `AssignRoute`, `UserInfo.jsx:32`) but `src/services/adminService.js` only exports `assignRouteToUser`, `removeRouteFromUser`, `renewRouteExpiry`, `deleteUserProfile`, `deleteAuthUser`. Clicking the eye icon in the admin Users list throws `TypeError: adminService.getUserById is not a function`.

**Fix:** Implement `getUserById(userId)` in `adminService.js`. It should call a new Edge Function or do `supabaseAdmin.auth.admin.getUserById(userId)` from a new Edge Function (recommended — don't ship the service role key to the browser).

### 8. `comp_views/AssignRoute.jsx` calls `checkRouteAvailability` and `getUserById` — also missing
**File:** `src/components/comp_views/AssignRoute.jsx:1-195`

Same class of issue. The component is the only path to create a route from the admin UI; until these are implemented, the "Assign Route" button throws.

**Fix:** Add to `adminService.js` (or wrap in a new Edge Function):
```js
checkRouteAvailability(slug) → calls supabase.from("routes").select("route_id").eq("route_id", slug).maybeSingle()
```

### 9. The "Metal" plan is selectable in `Land/Pricing.jsx` and the dashboard but is not implemented in the backend
**Files:** `src/pages/Land/Pricing.jsx` (Metal column), `src/components/comp_views/AssignRoute.jsx` (cardType dropdown), `supabase/functions/_shared/pricingConfig.ts`

The user can pay, but the order creation 400s. They will see "Invalid Card Type".

**Fix:** Either ship Metal in `pricingConfig.ts` with the same `single_item: 850` the frontend uses, or remove the option everywhere.

## P1 — High (UX / data integrity)

### 10. `ThemeColorPicker` has a `useEffect([])` dep-list bug
**File:** `src/components/ThemeColorPicker.jsx:12-15`

The effect depends on `themeKey` but the dep list is empty. The local `theme` state goes stale if the parent updates `themeKey` (e.g. after fetching the profile from the server).

**Fix:** Add `themeKey` to the dep list.

### 11. `Chatbot` shares a hard-coded `sessionId = 'user123'`
**File:** `src/components/Chatbot.jsx:18`

The session id is a ref initialised to a literal — every user in the world is "user123" to the n8n bot. Context is lost between users, and a single user's context is shared across tabs.

**Fix:** Generate a per-tab UUID on first mount and persist in `localStorage`. Or better, sign the user in with Supabase and use `user.id`.

### 12. `assign-route` doesn't validate slug uniqueness
**File:** `supabase/functions/assign-route/index.ts:50-60`

Relies on a DB unique constraint (not visible in repo) to fail. The error message is the raw PG error.

**Fix:** Add a slug regex check + a `.from("routes").select("route_id").eq("route_id", route_id).maybeSingle()` pre-check. Return 409 with a friendly message.

### 13. `public_profiles` view may not respect `show_*` flags
**File:** `src/services/userService.js:4-36`

The query is `.from("public_profiles").select("*, routes!inner(...)")` — `select("*")` returns every column, including phone numbers the user has hidden via `show_phone = false`. The public page then relies on `UserView` to filter them out at render time.

**Fix:** Either select explicit columns, or build the view to include only `show_*` columns where the flag is true. The current behavior is the **most likely way private data leaks**.

### 14. `localStorage` + `userData.show_*` dual-source bug
**File:** `src/pages/UserDashboard.jsx` (multiple lines)

The dashboard reads visibility flags from localStorage in some places and from `userData` in others. After a reload, the two can disagree.

**Fix:** Pick one source of truth. Read from `userData` (the canonical DB row) and stop using `localStorage` for `showPhone`, `showEmail`, etc.

### 15. `chatbot` webhook URL is exposed in client bundle
**File:** `src/components/Chatbot.jsx:19`

The n8n webhook URL `https://n8n-szm5.onrender.com/webhook/pixy-chat` is hard-coded in the JSX. Anyone can read the source, hit the URL directly, and bypass the bot's UI guard.

**Fix:** Add a per-session token from the backend, or restrict the n8n workflow with a header secret.

### 16. `toggle-route-status` and `renew-expiry` are anonymous
**Files:** `supabase/functions/toggle-route-status/index.ts:17-48`, `supabase/functions/renew-expiry/index.ts:16-73`

Both have no auth check. Anyone can suspend any route or extend any expiry.

**Fix:** Add admin role check.

## P2 — Medium (code hygiene)

### 17. Pricing config duplicated three times
See #6.

### 18. Dead code
* `src/Home.jsx` — empty boilerplate from the Vite template.
* `src/UserControl.jsx` — placeholder.
* `src/landing-components/Navbar.jsx` — not imported by `LandingPage.jsx` (which uses `src/pages/Land/...` inline).
* `src/components/comp_views/Cards.jsx` — "Coming Soon" placeholder.
* `src/services/generateVCard.js` — not used by `UserView` (which builds a minimal vCard inline).
* `src/pages/SuccessPage.jsx` — not in route table.
* `src/pages/TestPaymentPage.jsx` — not in route table.
* `src/pages/getInfo.css` — empty.
* `Header` import in `AdminDashboard.jsx` — not used.
* `createNewUser` in `adminService.js` — not used.
* `loginUser`, `getSession`, `logoutUser` in `supabaseService.js` — not used (replaced by Edge Function calls).
* `WifiOff` import in `NotFound.jsx` — not used.

**Fix:** Delete or wire them in.

### 19. Unused dependencies in `package.json`
* `@react-three/fiber`, `@react-three/drei`, `three`, `maath` — `NfcAnimation.jsx` is hand-drawn SVG, not 3D.
* `react-parallax-tilt` — not imported.
* `react-vertical-timeline-component` — not imported.
* `@headlessui/react` — not imported.
* `react-loading-indicators` — imported once (`UserView.jsx`).

**Fix:** Drop them, or actually use them.

### 20. `config.toml` is missing 5 functions and has a typo
**File:** `supabase/config.toml:324-454`

* Missing blocks for `delete-payments`, `delete-user`, `increment-view-count`, `list-payments`, `renew-expiry`.
* The block labeled `[functions.login-user]` is a duplicate of `[functions.user-login]` — confirm whether the deployed function name is `login-user` or `user-login`.

**Fix:** Add the missing blocks; rename or remove the duplicate.

### 21. Empty `supabase/migrations/` and missing `supabase/seed.sql`
**File:** `supabase/config.toml:60` references `supabase/seed.sql`.

There is no SQL committed. A fresh clone cannot reproduce the production schema.

**Fix:** Commit the schema as migrations. Create the seed file (or remove the reference).

### 22. `verify-payment` template embeds the password in plain text
**File:** `supabase/functions/verify-payment/emailTemplate.ts:73-74`

The welcome email includes the 8-character password in monospace. Email is not a secure channel.

**Fix:** Send a magic-link reset email instead. Or, force a password change on first login (the email currently says "For security reasons, please change your password immediately after logging in" but does not enforce it).

### 23. `UserNotFound` is rendered inside `PublicUserPage` but there is no entry in `App.jsx`
**File:** `src/pages/UserNotFound.jsx` is **not** in `App.jsx`.

It is rendered by `PublicUserPage.jsx` if `getUserProfileByRouteId` returns null. Fine — but the file is otherwise orphan.

### 24. `GetInfo.jsx` is the only place the Razorpay SDK is loaded
**File:** `src/pages/GetInfo.jsx:1-50`

The SDK is added to the global window via a `<script>` tag at mount, then `new window.Razorpay({...})` is called. There is no cleanup.

**Fix:** Use the npm package `razorpay` (already a dependency in `package.json` and in the Edge Function).

### 25. `Hero` section is described in the `LandingPage.md` but not present in the source
**File:** `src/pages/LandingPage.jsx`

The `LandingPage` is just a sequence of imports + a `<NfcAnimation>` hero block. There is no `Hero.jsx`.

### 26. `Sign Out` does not call Supabase `auth.signOut`
**Files:** `src/components/Notactive.jsx`, `src/pages/AdminDashboard.jsx`

Logout is `localStorage.clear()` (full wipe) or a state reset. The Supabase session stays valid server-side.

**Fix:** Call `supabase.auth.signOut()` and clear specific keys (not `localStorage.clear()`).

### 27. `create-order` and `verify-payment` recompute the amount; the Razorpay order amount is not re-verified
**File:** `supabase/functions/verify-payment/index.ts:50-58`

The function recomputes the amount from the pricing config but does not fetch the actual order from Razorpay to confirm the user paid the expected amount. A tampered `userData` could cause a different amount to be charged vs recorded.

**Fix:** Add `razorpay.orders.fetch(order_id).amount === computed_amount` check.

## P3 — Low (style / polish)

* Many Tailwind classes are hard-coded. Consider extracting to a design system.
* Section copy is hard-coded in `Land/*`. No i18n, no CMS.
* `comp_views/Payments.jsx` "view details" is a `console.log`.
* `comp_views/Dashboard.jsx` charts use a hard-coded 6-month series with empty data.
* `ThemeColorPicker` has a `console.log(themeKey)` debug call.
* `package.json` scripts: no `test`, no `lint:fix`. ESLint config is the default Vite one.
* No CI/CD pipeline (`.github/` is absent).
* `vercel.json` rewrites are permissive — the SPA fallback runs for all non-asset requests, but `assets/...` is in the allow-list, not `assets`.
* `App.css` and `index.css` are both imported in `main.jsx`; `App.css` is empty.
* Many placeholder image references (`/placeholder.jpg`) — confirm the public path.

## Summary of must-fix items

1. Disable or secure `create-user`.
2. Verify no service-role key in git history.
3. Add admin role check to `list-payments`, `delete-payments`, `toggle-route-status`, `renew-expiry`.
4. Reconcile the two `payments` insert paths.
5. Add `getUserById` and `checkRouteAvailability` to `adminService` + a backing Edge Function.
6. Unify pricing into one source of truth.
7. Add `useEffect([themeKey])` to `ThemeColorPicker`.
8. Generate a real session id in `Chatbot`.
9. Make `public_profiles` respect `show_*` flags.
10. Commit the SQL schema as migrations.
