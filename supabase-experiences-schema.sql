-- ============================================
-- EXPERIENCES TABLE
-- Unique bookable experiences (Notre-Dame VR, Cheese Tasting, etc.)
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TYPE IF NOT EXISTS experience_design_accent AS ENUM ('VR_3D', 'GASTRONOMY');

CREATE TABLE IF NOT EXISTS experiences (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  full_description  TEXT NOT NULL DEFAULT '',
  price       FLOAT NOT NULL DEFAULT 0,
  group_size  TEXT,
  duration    TEXT,
  image       TEXT NOT NULL DEFAULT '/images/eiffel1.jpeg',
  design_accent experience_design_accent NOT NULL DEFAULT 'VR_3D',
  includes    TEXT[] NOT NULL DEFAULT '{}',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_slug     ON experiences(slug);
CREATE INDEX IF NOT EXISTS idx_experiences_active   ON experiences(is_active, created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_experiences_updated_at();

-- RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active experiences"
  ON experiences FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage experiences"
  ON experiences FOR ALL
  TO authenticated
  USING (true);

-- ============================================
-- EXPERIENCE PURCHASES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS experience_purchases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id   UUID NOT NULL REFERENCES experiences(id) ON DELETE RESTRICT,
  guest_name      TEXT NOT NULL,
  guest_email     TEXT NOT NULL,
  guest_phone     TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      FLOAT NOT NULL,
  total_amount    FLOAT NOT NULL,
  payment_status  TEXT NOT NULL DEFAULT 'pending',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exp_purchases_experience ON experience_purchases(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_purchases_email      ON experience_purchases(guest_email);

ALTER TABLE experience_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read experience purchases"
  ON experience_purchases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert experience purchases"
  ON experience_purchases FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- SEED: Initial experiences
-- ============================================

INSERT INTO experiences (slug, title, short_description, full_description, price, group_size, duration, image, design_accent, includes, is_active) VALUES
(
  'notre-dame-elmenytura',
  'Különleges Notre-Dame élménytúra',
  'Fedezze fel a felújított Notre-Dame katedrálist belülről és kívülről, majd merüljön el egy lenyűgöző virtuális bemutatón, amely modern technológiával tárja fel a székesegyház titkait.',
  E'Egyedi, kis létszámú sétára hívom Önöket, amelynek középpontjában a felújított Notre-Dame Cathedral áll. A program során nemcsak kívülről, hanem belülről is megtekintjük a katedrálist, miközben rövid történeti és művészeti ismertetést kapnak a helyszínen.\n\nA látogatást követően közösen részt veszünk egy különleges, virtuális bemutatón, amely modern technológia segítségével mutatja be a Notre-Dame történetét, építését, valamint az évszázadok során bekövetkezett változásokat. Az élmény lehetőséget ad arra, hogy olyan részleteket is felfedezzünk, amelyek a hagyományos látogatás során nem láthatók.\n\nEz a program különleges lehetőséget kínál arra, hogy a Notre-Dame történetét egyszerre a valóságban és virtuálisan is átéljük.',
  65,
  '4-25 főig',
  NULL,
  '/images/eiffel1.jpeg',
  'VR_3D',
  ARRAY['vezetett séta', 'a Notre-Dame belső megtekintése', 'a virtuális élményprogram belépőjegye (35 € értékben)', 'magyar nyelvű idegenvezetés a teljes program során'],
  true
),
(
  'sajtkostolo-geronimo-stilton',
  'Sajtimádók és kalandorok: Sajtkóstoló Geronimo Stilton nyomában',
  'Sajtfalatnyi élvezet 60 percben – Párizs szívében. Prémium francia sajtok kóstolója, miközben elmerülünk a francia sajtkultúra mesés világában.',
  E'Sajtfalatnyi élvezet 60 percben – Párizs szívében. Ha te is úgy imádod a sajtot, mint a Rágcsáló Hírlap főszerkesztője, akkor ez az 1 órás párizsi program neked szól! Felejtsd el az unalmas kóstolókat: a franciák legkiválóbb csemegéi kerülnek a tányérra, miközben közösen merülünk el a francia sajtok mesés világában. Biztosítsd a helyed a párizsi sajtkóstolónkra! Időpontfoglalás és ajánlatkérés - Csatlakozz a sajt-kalandhoz!',
  25,
  NULL,
  'kb. 1 óra',
  '/images/cheese.jpeg',
  'GASTRONOMY',
  ARRAY['prémium francia sajtok kóstolója', '1 órás vezetett gasztronómiai élmény'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description  = EXCLUDED.full_description,
  price             = EXCLUDED.price,
  group_size        = EXCLUDED.group_size,
  duration          = EXCLUDED.duration,
  design_accent     = EXCLUDED.design_accent,
  includes          = EXCLUDED.includes;

-- ============================================
-- ADD EXPERIENCES TO MENU SETTINGS
-- ============================================

INSERT INTO menu_settings (menu_key, label, href, is_active, sort_order, parent_group) VALUES
  ('experiences', 'Párizsi Élmények', '/elmenyek', true, 4, 'parisian_experiences')
ON CONFLICT (menu_key) DO NOTHING;
