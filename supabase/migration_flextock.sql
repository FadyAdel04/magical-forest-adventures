-- Migration for Flextock Shipping Integration

-- 1. Alter products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku_code TEXT DEFAULT 'main-product-sku';
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_code_key;
ALTER TABLE public.products ADD CONSTRAINT products_sku_code_key UNIQUE (sku_code);

-- 2. Alter orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS area TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS flextock_status TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS flextock_order_sent BOOLEAN NOT NULL DEFAULT false;

-- Update orders status check constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (
  status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'shipping_error')
);

-- 3. Create order_items table
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

-- 4. Enable Row Level Security (RLS) on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. Set RLS Policies for order_items
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT WITH CHECK (true);
