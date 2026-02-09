-- District Guide Schema for Paris Arrondissements
-- This table stores CMS-managed content for each of the 20 Paris districts

-- Create the district_guides table
CREATE TABLE IF NOT EXISTS district_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_number INTEGER NOT NULL CHECK (district_number >= 1 AND district_number <= 20),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  highlights TEXT[], -- Array of highlight points
  content_layout TEXT NOT NULL DEFAULT 'standard' CHECK (content_layout IN ('standard', 'rich_ticket', 'rich_list')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Rich content fields
  main_attraction TEXT,
  local_tips TEXT,
  best_for TEXT[], -- Array: e.g., ['Turisták', 'Kultúra', 'Vásárlás']
  avoid_tips TEXT,

  -- Visual customization
  accent_color TEXT DEFAULT 'amber',
  icon_name TEXT DEFAULT 'MapPin',

  -- Media
  cover_image_url TEXT,
  gallery_images TEXT[],

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique district numbers
  UNIQUE(district_number)
);

-- Create index for faster sorting queries
CREATE INDEX IF NOT EXISTS idx_district_guides_sort_order ON district_guides(sort_order);
CREATE INDEX IF NOT EXISTS idx_district_guides_is_active ON district_guides(is_active);

-- Enable Row Level Security
ALTER TABLE district_guides ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active districts
CREATE POLICY "Public can view active districts"
  ON district_guides
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage districts (admin)
CREATE POLICY "Authenticated users can manage districts"
  ON district_guides
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_district_guides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER district_guides_updated_at
  BEFORE UPDATE ON district_guides
  FOR EACH ROW
  EXECUTE FUNCTION update_district_guides_updated_at();

-- Insert default data for all 20 arrondissements
INSERT INTO district_guides (district_number, title, subtitle, description, sort_order, is_active, best_for, content_layout)
VALUES
  (1, '1. kerület - Louvre és a kezdetek', 'A város szíve', 'A Louvre, a Tuileriák kertje és a Palais Royal otthona. Itt kezdődik minden párizsi kaland.', 1, true, ARRAY['Turisták', 'Művészet', 'Történelem'], 'standard'),
  (2, '2. kerület - Börzék és passzázsok', 'Kereskedelem és elegancia', 'Fedezd fel a gyönyörű fedett passzázsokat és a régi tőzsde környékét.', 2, true, ARRAY['Vásárlás', 'Architektúra'], 'standard'),
  (3, '3. kerület - Marais észak', 'Történelmi negyed', 'A Marais negyed északi része, múzeumok és galéri hazája.', 3, true, ARRAY['Kultúra', 'Művészet'], 'standard'),
  (4, '4. kerület - Notre-Dame és Marais', 'A szív és a lélek', 'Notre-Dame, Hôtel de Ville, és a Marais negyed déli része. A párizsi romantika epicentruma.', 4, true, ARRAY['Romantika', 'Történelem', 'Gasztronómia'], 'standard'),
  (5, '5. kerület - Latin negyed', 'Diákok és tudósok', 'A Sorbonne és a Panthéon otthona. Könyvesboltok, kávézók és intellektuális hangulat.', 5, true, ARRAY['Kultúra', 'Diákok', 'Kávézók'], 'standard'),
  (6, '6. kerület - Saint-Germain-des-Prés', 'Irodalom és elegancia', 'Luxusboltok, irodalmi kávézók és a Luxembourg kert. Az igazi párizsi életérzés.', 6, true, ARRAY['Luxus', 'Irodalom', 'Parkok'], 'standard'),
  (7, '7. kerület - Eiffel-torony', 'Az ikonikus negyed', 'Az Eiffel-torony, Invalidusok és az Orsay Múzeum. A legtöbb turista itt kezdi.', 7, true, ARRAY['Turisták', 'Ikonikus', 'Múzeumok'], 'rich_ticket'),
  (8, '8. kerület - Champs-Élysées', 'Pompa és fényűzés', 'A Diadalív, Champs-Élysées és luxusmárkák. Párizs legelegánsabb sugárútja.', 8, true, ARRAY['Vásárlás', 'Luxus', 'Séta'], 'standard'),
  (9, '9. kerület - Opera és nagyáruházak', 'Kultúra és vásárlás', 'A Garnier Operaház és a híres nagyáruházak (Galeries Lafayette, Printemps).', 9, true, ARRAY['Opera', 'Vásárlás'], 'standard'),
  (10, '10. kerület - Pályaudvarok', 'Tranzit és sokszínűség', 'Gare du Nord és Gare de l''Est. Multikulturális hangulat és rejtett kávézók.', 10, true, ARRAY['Helyi élet', 'Kávézók'], 'standard'),
  (11, '11. kerület - Bastille és éjszakai élet', 'Fiatalos energia', 'Bárok, éttermek és éjszakai élet. A fiatal párizsiak kedvence.', 11, true, ARRAY['Éjszakai élet', 'Gasztronómia'], 'standard'),
  (12, '12. kerület - Bercy és a Bois de Vincennes', 'Zöld oázis', 'A Bercy negyed és a hatalmas Bois de Vincennes park.', 12, true, ARRAY['Parkok', 'Családok'], 'standard'),
  (13, '13. kerület - Chinatown és street art', 'Modern és sokszínű', 'Ázsiai negyed, modern architektúra és fantasztikus street art.', 13, true, ARRAY['Gasztronómia', 'Street art'], 'standard'),
  (14, '14. kerület - Montparnasse', 'Művészek világa', 'A Montparnasse torony és a híres temető. Régen művészek kedvenc helye.', 14, true, ARRAY['Művészet', 'Történelem'], 'standard'),
  (15, '15. kerület - Lakónegyed', 'Helyi élet', 'Párizs legnagyobb kerülete. Nyugodt, családias hangulat.', 15, true, ARRAY['Helyi élet', 'Családok'], 'standard'),
  (16, '16. kerület - Passy és a gazdagok', 'Elegancia és nyugalom', 'Luxusvillák, követségek és a Trocadéro. A gazdag párizsiak otthona.', 16, true, ARRAY['Luxus', 'Nyugalom'], 'standard'),
  (17, '17. kerület - Batignolles', 'Feltörekvő negyed', 'Régen munkásnegyed, ma trendi kávézók és parkok.', 17, true, ARRAY['Trendi', 'Parkok'], 'standard'),
  (18, '18. kerület - Montmartre', 'Bohém Párizs', 'A Sacré-Cœur, művészek tere és a Moulin Rouge. A legikonikusabb negyed.', 18, true, ARRAY['Művészet', 'Romantika', 'Kilátás'], 'rich_ticket'),
  (19, '19. kerület - La Villette', 'Tudomány és kultúra', 'A Cité des Sciences és a Buttes-Chaumont park. Családoknak ideális.', 19, true, ARRAY['Családok', 'Tudomány', 'Parkok'], 'standard'),
  (20, '20. kerület - Père-Lachaise', 'Alternatív Párizs', 'A híres temető és a Belleville negyed. Autentikus, multikulturális hangulat.', 20, true, ARRAY['Alternatív', 'Helyi élet'], 'standard')
ON CONFLICT (district_number) DO NOTHING;

-- Comment on table
COMMENT ON TABLE district_guides IS 'CMS-managed content for each Paris arrondissement (district). Used for the interactive district guide map.';
