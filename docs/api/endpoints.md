# API Reference

Pixiic's "API" is composed of:
1. **Supabase REST/PostgREST** auto-generated endpoints (used implicitly by `supabase-js`).
2. **Supabase Auth** endpoints (`/auth/v1/...`) used indirectly.
3. **Edge Functions** at `https://yowckahgoxqfikadirov.supabase.co/functions/v1/...`.
4. **Storage** at `https://yowckahgoxqfikadirov.supabase.co/storage/v1/...`.

All Edge Functions respond with CORS `Access-Control-Allow-Origin: *`. All write paths to `payments` and `routes` use the **service role key** server-side, so callers only need an anon or user JWT.

## Edge Function catalog

| Function | Method | Auth | Request | Response |
|----------|--------|------|---------|----------|
| `create-order` | POST | Anon / user | `{ planName, qty, cardType }` | Razorpay order JSON. |
| `verify-payment` | POST | Anon / user | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, userData }` | `{ success, message }` or `{ success: false, paymentVerified: true, error, message }`. |
| `razorpay-webhook` | POST | HMAC | Razorpay event JSON | `{ received: true }` (200 even on insert error). |
| `user-login` | POST | Anon | `{ email, password }` | `{ success, session }` (rejects non-`user` role). |
| `admin-login` | POST | Anon | `{ email, password }` | `{ success, session }` (rejects non-`admin` role). |
| `get-user-profile` | POST/GET | User | (none; uses caller JWT) | `{ profile, view_count }`. |
| `increment-view-count` | POST | Anon | `{ route_id }` | `{ success: true }`. |
| `list-users` | POST/GET | Admin | (none) | `{ users: [{ id, email, name, created_at, route_id, route_status, expiry_date, activation_date }, ...] }`. |
| `list-payments` | POST/GET | User (any role) | (none) | `{ payments: [...] }`. **Should be admin only.** |
| `delete-user` | POST | Admin | `{ userId | user_id | id }` | `{ message, data }`. |
| `delete-payments` | POST | User (any role) | `{ payment_ids: [uuid] }` | `{ message }`. **Should be admin only.** |
| `assign-route` | POST | Admin | `{ user_id, route_id }` | `{ success, route }`. |
| `remove-route` | POST | Admin | `{ user_id }` | `{ success }`. |
| `renew-expiry` | POST | Anon | `{ route_id }` | `{ success, new_expiry }`. **Should require payment.** |
| `toggle-route-status` | POST | Anon | `{ route_id, is_active }` | `{ success }`. **Should require admin.** |
| `create-user` | POST | **Anon (no auth)** | `{ email, password, name, role }` | `{ data }`. **DANGEROUS.** |

## PostgREST (auto-generated)

Used implicitly through the `supabase-js` client:

| Table / view | Operations called by the frontend |
|--------------|-----------------------------------|
| `public_profiles` | `select` (anon). |
| `profiles` | `update` (user, on the dashboard). |
| `storage.objects` | `upload`, `getPublicUrl` (profile image). |

## Storage

| Bucket | Operation | Caller |
|--------|-----------|--------|
| `profile-images` | `upload` | The user (RLS — own folder). |
| `profile-images` | `getPublicUrl` | Anon (public). |

## Authentication

* `supabase.auth.signInWithPassword({ email, password })` is **only** used inside the `user-login` and `admin-login` Edge Functions. The browser does **not** call `auth.signInWithPassword` directly.
* `supabase.auth.getUser(jwt)` is called by every Edge Function that needs to identify the caller.
* `supabase.auth.admin.createUser` is called by `verify-payment` and `create-user`.
* `supabase.auth.admin.listUsers` is called by `list-users`.
* `supabase.auth.admin.deleteUser` is called by `delete-user`.

## CORS

All Edge Functions return:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```
(Some also allow `*` for headers and `GET, POST, OPTIONS` for methods.)

## Rate limits

There is **no per-route rate limit** at the Edge Function layer. The Supabase project-level quotas apply. Public endpoints with no auth check (`create-user`, `renew-expiry`, `toggle-route-status`) are vulnerable to abuse.

## Versioning

None. Function names are stable but payload shapes can change without notice. The frontend code is the de-facto contract.

## Risks

* See `docs/improvements.md` for the full risk list.
