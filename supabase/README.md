# Supabase setup for Naseeg

## 1. Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or legacy `VITE_SUPABASE_ANON_KEY`)

## 2. Create tables

In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**, paste and run the full contents of `schema.sql`.

## 3. Verify

- **Table Editor** should show `products`, `orders`, `shipping_settings`.
- Open the site: product and shipping load from Supabase.
- Place a test order on the landing page; it should appear under **Admin → الطلبات**.

## 4. Migrate old localStorage data

If you used the site before Supabase: keep the same browser, open admin once. If Supabase has no orders but localStorage does, data is uploaded automatically on first load.

## Security note

Default RLS policies allow read/write with the publishable key. For production, enable [Supabase Auth](https://supabase.com/docs/guides/auth) and restrict writes to authenticated admins only.
