# Database — Migrations

## Status

The `supabase/migrations/` directory is **empty**. No SQL is committed to the repository.

## What this means

* The production schema is managed **out-of-band** — most likely directly in the Supabase SQL editor or in a private repository.
* There is no way to spin up a fresh database that matches production from this repo alone. `supabase db reset` would create an empty database.
* The `supabase/seed.sql` referenced in `config.toml` (line 60) is also missing.

## What needs to be committed

The following DDL is required to bring a fresh database to the same shape as production (inferred; verify before committing):

1. `auth.users` — managed by Supabase.
2. `public.profiles` — see `docs/database/schema.md` for columns.
3. `public.routes` — PK `route_id`, FK `user_id` to `auth.users`.
4. `public.analytics` — PK `route_id`, FK to `routes.route_id`.
5. `public.payments` — PK `id`, FK `user_id` to `auth.users` (nullable).
6. `public.public_profiles` view — `SELECT * FROM profiles` with RLS.
7. RPC `public.increment_view_count(route_id_input text)`.
8. RLS policies on every table.
9. Storage bucket for profile images (`pr_img`).
10. Indexes on `routes.user_id`, `payments.user_id`, `payments.razorpay_payment_id` (idempotency).

## Risks

* Without migrations, drift between local, staging, and production is invisible.
* Onboarding a new developer requires manual SQL setup or Studio clicks.
* Disaster recovery: a fresh `supabase init` will not restore the schema.
