-- ============================================
-- LANDING PAGE SETTINGS
-- Vizualis Oldal Szerkeszto beallitasok
-- Futtasd ezt a Supabase SQL Editor-ban
-- TELJESEN IDEMPOTENS: barmikor ujrafuttathato!
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. LANDING PAGE SETTINGS TABLA
-- ============================================

CREATE TABLE IF NOT EXISTS landing_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_landing_page_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_landing_page_settings_updated_at ON landing_page_settings;
CREATE TRIGGER update_landing_page_settings_updated_at
  BEFORE UPDATE ON landing_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_page_settings_updated_at();

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE landing_page_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read landing page settings" ON landing_page_settings;
DROP POLICY IF EXISTS "Admin can insert landing page settings" ON landing_page_settings;
DROP POLICY IF EXISTS "Admin can update landing page settings" ON landing_page_settings;

CREATE POLICY "Anyone can read landing page settings"
  ON landing_page_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert landing page settings"
  ON landing_page_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update landing page settings"
  ON landing_page_settings FOR UPDATE
  USING (auth.role() = 'authenticated');
