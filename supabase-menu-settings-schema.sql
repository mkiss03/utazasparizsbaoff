-- ============================================
-- MENU SETTINGS TABLE
-- Admin-controllable navbar visibility
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS menu_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  parent_group TEXT, -- 'parisian_experiences' | 'inspiration' | NULL (top-level)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_settings_key ON menu_settings(menu_key);
CREATE INDEX IF NOT EXISTS idx_menu_settings_group ON menu_settings(parent_group, sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_menu_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_menu_settings_updated_at
  BEFORE UPDATE ON menu_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_settings_updated_at();

-- RLS
ALTER TABLE menu_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read menu settings"
  ON menu_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can update menu settings"
  ON menu_settings FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- SEED: Initial menu items
-- ============================================
INSERT INTO menu_settings (menu_key, label, href, is_active, sort_order, parent_group) VALUES
  ('walking_tours',  'Sétatúrák',        '/walking-tours',  true, 1, 'parisian_experiences'),
  ('louvre_guide',   'Louvre Guide',      '/museum-guide',   true, 2, 'parisian_experiences'),
  ('bundles',        'Kártyacsomagok',    '/marketplace',    true, 3, 'parisian_experiences'),
  ('blog',           'Párizsi Napló',     '/blog',           true, 1, 'inspiration'),
  ('gallery',        'Galéria',           '/galeria',        true, 2, 'inspiration')
ON CONFLICT (menu_key) DO NOTHING;
