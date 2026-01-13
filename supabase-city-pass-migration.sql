-- ============================================
-- MIGRATION: Bundle-based to City Pass Model
-- ============================================
-- This migration transforms the marketplace from individual bundle purchases
-- to city-wide access passes with time-limited duration

-- ============================================
-- 1. MODIFY BUNDLES TABLE (Remove Price)
-- ============================================

-- Remove price column from bundles (bundles are now content containers, not products)
ALTER TABLE bundles DROP COLUMN IF EXISTS price;

-- Add metadata columns for better organization
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS difficulty_level TEXT; -- 'beginner', 'intermediate', 'advanced'
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER DEFAULT 10;

-- ============================================
-- 2. CREATE CITY_PRICING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS city_pricing (
  city TEXT PRIMARY KEY,
  price DECIMAL(10,2) NOT NULL DEFAULT 25.00,
  duration_days INTEGER NOT NULL DEFAULT 7,
  currency TEXT DEFAULT 'EUR',
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_city_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_city_pricing_updated_at
  BEFORE UPDATE ON city_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_city_pricing_updated_at();

-- Enable RLS
ALTER TABLE city_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read pricing
CREATE POLICY "Public can view active city pricing"
  ON city_pricing FOR SELECT
  USING (is_active = true);

-- Only super admin can modify pricing
CREATE POLICY "Super admin can manage city pricing"
  ON city_pricing FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Insert default pricing for common cities
INSERT INTO city_pricing (city, price, duration_days, description) VALUES
  ('Paris', 25.00, 7, 'Full access to all Paris content for 7 days'),
  ('Rome', 22.00, 7, 'Full access to all Rome content for 7 days'),
  ('Budapest', 18.00, 7, 'Full access to all Budapest content for 7 days'),
  ('Vienna', 20.00, 7, 'Full access to all Vienna content for 7 days')
ON CONFLICT (city) DO NOTHING;

-- ============================================
-- 3. REFACTOR USER_PURCHASES TABLE (City-Based Access)
-- ============================================

-- Drop the existing user_purchases table and recreate with new structure
DROP TABLE IF EXISTS user_purchases CASCADE;

CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, city, order_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_city ON user_purchases(user_id, city);
CREATE INDEX IF NOT EXISTS idx_user_purchases_expiry ON user_purchases(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_purchases_active ON user_purchases(is_active, expires_at);

-- Enable RLS
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "System can create purchases"
  ON user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. MODIFY ORDERS TABLE (Track City Instead of Bundle)
-- ============================================

-- Add city column to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;

-- Update existing orders to set city from bundle (if data exists)
UPDATE orders o
SET city = b.city
FROM bundles b
WHERE o.bundle_id = b.id
AND o.city IS NULL;

-- Make bundle_id nullable (since we're buying cities, not individual bundles)
-- Note: We'll keep bundle_id for historical data, but new orders won't need it
ALTER TABLE orders ALTER COLUMN bundle_id DROP NOT NULL;

-- Add index on city
CREATE INDEX IF NOT EXISTS idx_orders_city ON orders(city);

-- ============================================
-- 5. UPDATE HELPER FUNCTIONS
-- ============================================

-- Drop old function
DROP FUNCTION IF EXISTS user_owns_bundle(UUID, UUID);

-- New function: Check if user has active city pass
CREATE OR REPLACE FUNCTION user_has_city_access(p_user_id UUID, p_city TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_purchases
    WHERE user_id = p_user_id
    AND city = p_city
    AND is_active = true
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access a specific bundle
CREATE OR REPLACE FUNCTION user_can_access_bundle(p_user_id UUID, p_bundle_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  bundle_city TEXT;
BEGIN
  -- Get the city of the bundle
  SELECT city INTO bundle_city
  FROM bundles
  WHERE id = p_bundle_id;

  -- Check if user has access to that city
  RETURN user_has_city_access(p_user_id, bundle_city);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's active city passes
CREATE OR REPLACE FUNCTION get_user_city_passes(p_user_id UUID)
RETURNS TABLE(
  city TEXT,
  purchased_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  days_remaining INTEGER,
  is_expired BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.city,
    up.purchased_at,
    up.expires_at,
    EXTRACT(DAY FROM (up.expires_at - NOW()))::INTEGER as days_remaining,
    (up.expires_at < NOW()) as is_expired
  FROM user_purchases up
  WHERE up.user_id = p_user_id
  AND up.is_active = true
  ORDER BY up.expires_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated vendor stats function (revenue by city)
DROP FUNCTION IF EXISTS get_vendor_stats(UUID);
CREATE OR REPLACE FUNCTION get_vendor_stats(p_vendor_id UUID)
RETURNS TABLE(
  total_bundles BIGINT,
  published_bundles BIGINT,
  total_sales BIGINT,
  total_revenue DECIMAL,
  total_cards BIGINT,
  cities_covered TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT b.id)::BIGINT as total_bundles,
    COUNT(DISTINCT b.id) FILTER (WHERE b.is_published = true)::BIGINT as published_bundles,
    COALESCE(SUM(b.total_sales), 0)::BIGINT as total_sales,
    COALESCE(SUM(o.vendor_amount), 0) as total_revenue,
    COALESCE(SUM(b.total_cards), 0)::BIGINT as total_cards,
    ARRAY_AGG(DISTINCT b.city) FILTER (WHERE b.city IS NOT NULL) as cities_covered
  FROM bundles b
  LEFT JOIN orders o ON o.vendor_id = b.author_id AND o.status = 'completed'
  WHERE b.author_id = p_vendor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. UPDATE RLS POLICIES FOR FLASHCARDS
-- ============================================

-- Drop old flashcard policies
DROP POLICY IF EXISTS "Users can view purchased flashcards" ON flashcards;

-- New policy: Users can view flashcards if they have city access
CREATE POLICY "Users can view flashcards with city access"
  ON flashcards FOR SELECT
  USING (
    -- User has active city pass for this bundle's city
    EXISTS (
      SELECT 1 FROM bundles b, user_purchases up
      WHERE b.id = flashcards.bundle_id
      AND up.user_id = auth.uid()
      AND up.city = b.city
      AND up.is_active = true
      AND up.expires_at > NOW()
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

-- ============================================
-- 7. CREATE FUNCTION TO AUTO-DEACTIVATE EXPIRED PASSES
-- ============================================

CREATE OR REPLACE FUNCTION deactivate_expired_passes()
RETURNS void AS $$
BEGIN
  UPDATE user_purchases
  SET is_active = false
  WHERE expires_at < NOW()
  AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a cron job to run this daily (if using pg_cron extension)
-- SELECT cron.schedule('deactivate-expired-passes', '0 0 * * *', 'SELECT deactivate_expired_passes();');

-- ============================================
-- 8. MIGRATION SUMMARY
-- ============================================

-- Migration Notes:
-- 1. ✅ Bundles no longer have individual prices
-- 2. ✅ City-wide pricing in city_pricing table
-- 3. ✅ User purchases track city access with expiration
-- 4. ✅ Orders can track city instead of individual bundles
-- 5. ✅ Access control updated to check city passes
-- 6. ✅ Helper functions refactored for city-based access
-- 7. ✅ Automatic expiration handling

-- To complete migration:
-- 1. Run this SQL in Supabase
-- 2. Update TypeScript types
-- 3. Update admin UI (remove price from bundles, add city pricing page)
-- 4. Update frontend to show city passes instead of bundle purchases
