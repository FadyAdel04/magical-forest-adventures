-- Naseeg Landing — run in Supabase SQL Editor (Dashboard → SQL → New query)
-- https://supabase.com/dashboard/project/_/sql

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Products (single catalog row; extend id for more products later) ───
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT 'main-product',
  badge TEXT NOT NULL DEFAULT 'منتجاتنا',
  title TEXT NOT NULL DEFAULT '',
  title_highlight TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price_before NUMERIC(12, 2) NOT NULL DEFAULT 0,
  price_after NUMERIC(12, 2) NOT NULL DEFAULT 0,
  offer_enabled BOOLEAN NOT NULL DEFAULT true,
  currency TEXT NOT NULL DEFAULT 'جنيه',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  sku_code TEXT UNIQUE DEFAULT 'main-product-sku',
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Shipping settings (one row) ───
CREATE TABLE IF NOT EXISTS public.shipping_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  governorate_fees JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Orders ───
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12, 2) NOT NULL,
  total NUMERIC(12, 2) NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  flextock_status TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  flextock_order_sent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'shipping_error')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Order Items ───
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES public.products(id),
  title TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders (order_number);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS shipping_settings_updated_at ON public.shipping_settings;
CREATE TRIGGER shipping_settings_updated_at
  BEFORE UPDATE ON public.shipping_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Row Level Security ───
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read (landing page) + writes (admin uses same publishable key from browser)
-- Tighten later with Supabase Auth: restrict INSERT/UPDATE/DELETE to authenticated role only.

DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_insert" ON public.products;
CREATE POLICY "products_insert" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "products_update" ON public.products;
CREATE POLICY "products_update" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "shipping_select" ON public.shipping_settings;
CREATE POLICY "shipping_select" ON public.shipping_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "shipping_insert" ON public.shipping_settings;
CREATE POLICY "shipping_insert" ON public.shipping_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "shipping_update" ON public.shipping_settings;
CREATE POLICY "shipping_update" ON public.shipping_settings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "orders_select" ON public.orders;
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "orders_insert" ON public.orders;
CREATE POLICY "orders_insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update" ON public.orders;
CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "orders_delete" ON public.orders;
CREATE POLICY "orders_delete" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT WITH CHECK (true);

-- Optional: Dashboard → Database → Publications → supabase_realtime → add these tables
