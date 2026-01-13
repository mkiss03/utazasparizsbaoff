-- ============================================
-- MARKETPLACE DATABASE SCHEMA
-- Multi-Vendor Flashcard Bundle Platform
-- ============================================

-- ============================================
-- 1. USER ROLES SYSTEM
-- ============================================

-- Create role enum type
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'vendor', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 15.00; -- Super admin's commission %

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- 2. BUNDLES TABLE (The Products)
-- ============================================

CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  cover_image TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  city TEXT NOT NULL, -- e.g., 'Paris', 'Rome', 'Budapest'
  category TEXT, -- e.g., 'Transport', 'Food', 'Culture'
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT false,
  total_cards INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bundles_author ON bundles(author_id);
CREATE INDEX IF NOT EXISTS idx_bundles_city ON bundles(city);
CREATE INDEX IF NOT EXISTS idx_bundles_published ON bundles(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bundles_slug ON bundles(slug);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_bundles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bundles_updated_at
  BEFORE UPDATE ON bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_bundles_updated_at();

-- ============================================
-- 3. FLASHCARDS TABLE (The Content)
-- ============================================

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT,
  image_url TEXT,
  card_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_bundle ON flashcards(bundle_id, card_order);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_flashcards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcards_updated_at();

-- Trigger to update bundle's total_cards count
CREATE OR REPLACE FUNCTION update_bundle_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE bundles SET total_cards = total_cards + 1 WHERE id = NEW.bundle_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE bundles SET total_cards = total_cards - 1 WHERE id = OLD.bundle_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bundle_cards_count
  AFTER INSERT OR DELETE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_bundle_card_count();

-- ============================================
-- 4. ORDERS TABLE (Purchases)
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE RESTRICT,
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0.00,
  vendor_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'refunded'
  payment_method TEXT DEFAULT 'mock', -- For now, just mock
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON orders(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_bundle ON orders(bundle_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Trigger to update bundle's total_sales count
CREATE OR REPLACE FUNCTION update_bundle_sales_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE bundles SET total_sales = total_sales + 1 WHERE id = NEW.bundle_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bundle_sales
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_bundle_sales_count();

-- ============================================
-- 5. USER PURCHASES TABLE (What User Owns)
-- ============================================

CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bundle_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_purchases_user ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_bundle ON user_purchases(bundle_id);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BUNDLES RLS POLICIES
-- ============================================

-- Public can view published bundles
CREATE POLICY "Public can view published bundles"
  ON bundles FOR SELECT
  USING (is_published = true);

-- Vendors can view their own bundles (published or not)
CREATE POLICY "Vendors can view own bundles"
  ON bundles FOR SELECT
  USING (
    auth.uid() = author_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Vendors can create bundles
CREATE POLICY "Vendors can create bundles"
  ON bundles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('vendor', 'super_admin')
      AND is_approved = true
    )
  );

-- Vendors can update their own bundles
CREATE POLICY "Vendors can update own bundles"
  ON bundles FOR UPDATE
  USING (
    auth.uid() = author_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Vendors can delete their own bundles
CREATE POLICY "Vendors can delete own bundles"
  ON bundles FOR DELETE
  USING (
    auth.uid() = author_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- ============================================
-- FLASHCARDS RLS POLICIES
-- ============================================

-- Users can view flashcards ONLY if they purchased the bundle OR they are the author OR super admin
CREATE POLICY "Users can view purchased flashcards"
  ON flashcards FOR SELECT
  USING (
    -- User purchased the bundle
    EXISTS (
      SELECT 1 FROM user_purchases
      WHERE user_id = auth.uid()
      AND bundle_id = flashcards.bundle_id
    )
    OR
    -- User is the bundle author
    EXISTS (
      SELECT 1 FROM bundles
      WHERE id = flashcards.bundle_id
      AND author_id = auth.uid()
    )
    OR
    -- User is super admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Vendors can create flashcards for their own bundles
CREATE POLICY "Vendors can create own flashcards"
  ON flashcards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bundles
      WHERE id = flashcards.bundle_id
      AND author_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Vendors can update flashcards in their own bundles
CREATE POLICY "Vendors can update own flashcards"
  ON flashcards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bundles
      WHERE id = flashcards.bundle_id
      AND author_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Vendors can delete flashcards in their own bundles
CREATE POLICY "Vendors can delete own flashcards"
  ON flashcards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM bundles
      WHERE id = flashcards.bundle_id
      AND author_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- ============================================
-- ORDERS RLS POLICIES
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    auth.uid() = vendor_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Anyone authenticated can create orders (purchase)
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER_PURCHASES RLS POLICIES
-- ============================================

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON user_purchases FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- System can create purchases (via trigger or API)
CREATE POLICY "System can create purchases"
  ON user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to check if user has purchased a bundle
CREATE OR REPLACE FUNCTION user_owns_bundle(p_user_id UUID, p_bundle_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_purchases
    WHERE user_id = p_user_id AND bundle_id = p_bundle_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vendor stats
CREATE OR REPLACE FUNCTION get_vendor_stats(p_vendor_id UUID)
RETURNS TABLE(
  total_bundles BIGINT,
  published_bundles BIGINT,
  total_sales BIGINT,
  total_revenue DECIMAL,
  total_cards BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT b.id)::BIGINT as total_bundles,
    COUNT(DISTINCT b.id) FILTER (WHERE b.is_published = true)::BIGINT as published_bundles,
    COALESCE(SUM(b.total_sales), 0)::BIGINT as total_sales,
    COALESCE(SUM(o.vendor_amount), 0) as total_revenue,
    COALESCE(SUM(b.total_cards), 0)::BIGINT as total_cards
  FROM bundles b
  LEFT JOIN orders o ON o.vendor_id = b.author_id AND o.status = 'completed'
  WHERE b.author_id = p_vendor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get global marketplace stats (Super Admin only)
CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS TABLE(
  total_vendors BIGINT,
  total_bundles BIGINT,
  total_orders BIGINT,
  total_revenue DECIMAL,
  total_commission DECIMAL
) AS $$
BEGIN
  -- Check if caller is super admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin only';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'vendor')::BIGINT as total_vendors,
    (SELECT COUNT(*) FROM bundles)::BIGINT as total_bundles,
    (SELECT COUNT(*) FROM orders WHERE status = 'completed')::BIGINT as total_orders,
    (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'completed') as total_revenue,
    (SELECT COALESCE(SUM(commission_amount), 0) FROM orders WHERE status = 'completed') as total_commission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Set first user as super admin (UPDATE THIS WITH YOUR ACTUAL USER ID)
-- UPDATE profiles SET role = 'super_admin', is_approved = true WHERE email = 'your-admin-email@example.com';

-- Sample bundle (run after creating vendors)
-- INSERT INTO bundles (title, slug, description, price, city, author_id, is_published) VALUES
--   ('Paris Metro Mastery', 'paris-metro-mastery', 'Master the Paris Metro system with these essential tips and tricks', 9.99, 'Paris', 'vendor-user-id', true);
