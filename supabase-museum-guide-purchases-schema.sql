-- ============================================
-- MUSEUM GUIDE PURCHASES - Digitális Útikalauz Rendelések
-- Futtasd ezt a Supabase SQL Editor-ban
-- TELJESEN IDEMPOTENS: bármikor újrafuttatható!
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. MUSEUM GUIDE PURCHASES TÁBLA
-- ============================================

CREATE TABLE IF NOT EXISTS museum_guide_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  access_token UUID UNIQUE DEFAULT uuid_generate_v4(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_museum_guide_purchases_email ON museum_guide_purchases(guest_email);
CREATE INDEX IF NOT EXISTS idx_museum_guide_purchases_status ON museum_guide_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_museum_guide_purchases_token ON museum_guide_purchases(access_token);

-- ============================================
-- 3. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_museum_guide_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_museum_guide_purchases_updated_at ON museum_guide_purchases;
CREATE TRIGGER update_museum_guide_purchases_updated_at
  BEFORE UPDATE ON museum_guide_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_museum_guide_purchases_updated_at();

-- ============================================
-- 4. AUTO ORDER NUMBER GENERATION
-- Pattern: MG-YYYYMMDD-NNNN
-- ============================================

CREATE OR REPLACE FUNCTION generate_museum_guide_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  today_str := TO_CHAR(NOW(), 'YYYYMMDD');

  SELECT COUNT(*) + 1 INTO seq_num
  FROM museum_guide_purchases
  WHERE order_number LIKE 'MG-' || today_str || '-%';

  NEW.order_number := 'MG-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_museum_guide_order_number ON museum_guide_purchases;
CREATE TRIGGER set_museum_guide_order_number
  BEFORE INSERT ON museum_guide_purchases
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_museum_guide_order_number();

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE museum_guide_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create museum guide purchases" ON museum_guide_purchases;
DROP POLICY IF EXISTS "Anyone can view museum guide purchases" ON museum_guide_purchases;
DROP POLICY IF EXISTS "Admins can manage museum guide purchases" ON museum_guide_purchases;

-- Guest checkout: anyone can insert
CREATE POLICY "Anyone can create museum guide purchases"
  ON museum_guide_purchases FOR INSERT
  WITH CHECK (true);

-- Success page lookup: anyone can read
CREATE POLICY "Anyone can view museum guide purchases"
  ON museum_guide_purchases FOR SELECT
  USING (true);

-- Admin: full access
CREATE POLICY "Admins can manage museum guide purchases"
  ON museum_guide_purchases FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
