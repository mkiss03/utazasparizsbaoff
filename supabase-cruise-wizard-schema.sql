-- ============================================
-- CRUISE WIZARD CONFIGURATION TABLE
-- Stores the multi-step boat tour modal configuration
-- ============================================

-- Create the cruise_wizard_configs table
CREATE TABLE IF NOT EXISTS cruise_wizard_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL DEFAULT 'Seine Cruise Wizard',

  -- Store steps array as JSONB
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Store all styles as a single JSONB object
  styles JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Pricing configuration
  pricing JSONB NOT NULL DEFAULT '{
    "adultPrice": 17,
    "childPrice": 8,
    "currency": "€",
    "privacyNote": "A megrendeléssel elfogadod az adatvédelmi tájékoztatómat."
  }'::jsonb,

  -- FAB (Floating Action Button) settings
  fab_text VARCHAR(255) DEFAULT 'Hajózás Párizsban',
  fab_icon VARCHAR(50) DEFAULT 'Ship',
  fab_position VARCHAR(20) DEFAULT 'bottom-left' CHECK (fab_position IN ('bottom-left', 'bottom-right')),

  -- Meta
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cruise_wizard_active ON cruise_wizard_configs(is_active);

-- Enable RLS
ALTER TABLE cruise_wizard_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active configurations
CREATE POLICY "Anyone can read active wizard configs"
  ON cruise_wizard_configs
  FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated users can manage configs
CREATE POLICY "Authenticated users can manage wizard configs"
  ON cruise_wizard_configs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_cruise_wizard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_cruise_wizard_updated_at ON cruise_wizard_configs;
CREATE TRIGGER trigger_cruise_wizard_updated_at
  BEFORE UPDATE ON cruise_wizard_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_cruise_wizard_updated_at();

-- Insert default configuration
INSERT INTO cruise_wizard_configs (name, steps, styles, pricing, is_active)
VALUES (
  'Seine Cruise Wizard - Default',
  '[
    {
      "id": "step-1",
      "title": "Szajnai hajózás",
      "subtitle": "Szabadság és élmény",
      "description": "Felejtsd el a sorban állást! Párizsban élő idegenvezetőként olyan jegyet kínálok neked, ami nem korlátoz.",
      "label": "Indulás",
      "ctaText": "Induljunk",
      "order": 1
    },
    {
      "id": "step-2",
      "title": "Miért ez a legjobb választás?",
      "description": "Fedezd fel az előnyöket, amelyek miatt ez a jegy különleges.",
      "label": "Előnyök",
      "features": [
        {"icon": "Calendar", "text": "Teljes rugalmasság", "subtext": "Nincs fix időpont"},
        {"icon": "Clock", "text": "1 évig érvényes", "subtext": "Bármikor felhasználható"},
        {"icon": "QrCode", "text": "Azonnali digitális jegy", "subtext": "Nincs nyomtatás"},
        {"icon": "MapPin", "text": "Klasszikus útvonal", "subtext": "Eiffel, Louvre, Notre-Dame"}
      ],
      "ctaText": "Tovább",
      "order": 2
    },
    {
      "id": "step-3",
      "title": "Ez a jegy neked szól, ha...",
      "description": "Tökéletes választás, ha szereted a szabadságot.",
      "label": "Neked szól",
      "features": [
        {"icon": "Calendar", "text": "Nem szereted a menetrendeket"},
        {"icon": "Sun", "text": "Csak akkor hajóznál, ha kisüt a nap"},
        {"icon": "Headphones", "text": "Szeretnéd megismerni Párizs titkait"}
      ],
      "ctaText": "Lássuk az árakat",
      "order": 3
    },
    {
      "id": "step-4",
      "title": "Árak és foglalás",
      "description": "Válaszd ki a neked megfelelő jegyet.",
      "label": "Jegyvétel",
      "ctaText": "Jegyet kérek",
      "ctaLink": "#contact",
      "order": 4
    }
  ]'::jsonb,
  '{
    "card": {
      "backgroundColor": "#FAF7F2",
      "gradientEnabled": false,
      "borderColor": "#e7e5e4",
      "borderRadius": 24,
      "shadowIntensity": "2xl"
    },
    "button": {
      "backgroundColor": "#0f172a",
      "hoverBackgroundColor": "#334155",
      "textColor": "#ffffff",
      "borderRadius": 9999
    },
    "typography": {
      "headingColor": "#0f172a",
      "bodyTextColor": "#475569",
      "stepCounterColor": "#64748b",
      "labelColor": "#64748b"
    },
    "timeline": {
      "lineColorActive": "#0f172a",
      "lineColorInactive": "#e2e8f0",
      "dotColorActive": "#0f172a",
      "dotColorInactive": "#cbd5e1",
      "dotSize": 12,
      "boatIconColor": "#0f172a"
    },
    "pricing": {
      "adultPriceColor": "#0f172a",
      "childPriceColor": "#334155",
      "currencyColor": "#64748b",
      "dividerColor": "#e2e8f0"
    },
    "journeyPathColor": "#94a3b8",
    "journeyWaveColor": "#475569",
    "journeyBoatBackground": "#0f172a"
  }'::jsonb,
  '{
    "adultPrice": 17,
    "childPrice": 8,
    "currency": "€",
    "privacyNote": "A megrendeléssel elfogadod az adatvédelmi tájékoztatómat."
  }'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- ============================================
-- USAGE NOTES:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. The table stores wizard config as JSON for flexibility
-- 3. Use the TypeScript types in lib/types/database.ts for type safety
-- ============================================
