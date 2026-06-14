# `supabase/functions/verify-payment/emailTemplate.ts`

**Location**: `supabase/functions/verify-payment/emailTemplate.ts` (150 lines)

## Purpose

Two HTML email templates used by `verify-payment`:
* `getWelcomeEmailHtml(name, email, tempPass, plan, qty, cardType, amount)` — happy path.
* `getTechnicalErrorEmailHtml(name, plan, amount, email)` — payment succeeded but `auth.admin.createUser` failed.

## Internal

* Single shared `getStyles()` returns an embedded `<style>` block (mobile-responsive at 600px).
* Brand header: black `#000000` bar with `PIXIIC` wordmark in white.
* Credentials box: `#f9fafb` background with a 4-px blue (`#2563eb`) left border, displaying the email + the 8-char temp password in monospace.
* Two CTA buttons:
  * "Contact Pixiic (WhatsApp)" — green `#25D366` link to `https://wa.me/9188802136?text=...`.
  * "Login to Dashboard" — blue link to `https://pixiic.com/user`.

## Used By

* `supabase/functions/verify-payment/index.ts`.

## Risks

* The phone number `9188802136` and the `from` address `pixiic@supports.pixiic.com` are **hard-coded** in the function and template.
* Footer "Privacy Policy | Contact Support" links are `#` placeholders.
* `&copy; 2025` will be out-of-date in 2026+.
* Templates assume a desktop-first design; mobile columns are handled with a media query that is not always honored by older email clients.
