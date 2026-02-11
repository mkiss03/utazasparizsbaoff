-- ============================================
-- PARIS DISTRICT GUIDE CONFIGURATION TABLE
-- Stores the interactive map and content configuration
-- ============================================

-- Create the paris_guide_configs table
CREATE TABLE IF NOT EXISTS paris_guide_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL DEFAULT 'Paris District Guide',

  -- Global content settings
  global_content JSONB NOT NULL DEFAULT '{
    "mainTitle": "Fedezd fel Párizs kerületeit",
    "subtitle": "Minden kerületnek megvan a saját karaktere. Kattints a térképre vagy navigálj az idővonalon!",
    "timelineTitle": "Felfedezési útvonal",
    "mapTitle": "Párizs Kerületei",
    "legendActiveText": "Aktív",
    "legendVisitedText": "Megtekintett",
    "legendInactiveText": "Nem aktív"
  }'::jsonb,

  -- Store districts array as JSONB
  districts JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Store all styles as a single JSONB object
  styles JSONB NOT NULL DEFAULT '{
    "map": {
      "baseColor": "#ffffff",
      "hoverColor": "#f5f5f4",
      "activeColor": "#1e293b",
      "strokeColor": "#cbd5e1",
      "strokeWidth": 1,
      "labelColor": "#64748b"
    },
    "card": {
      "backgroundColor": "#ffffff",
      "headerGradientFrom": "#1e293b",
      "headerGradientTo": "#334155",
      "titleColor": "#ffffff",
      "subtitleColor": "#cbd5e1",
      "bodyTextColor": "#475569",
      "accentColor": "#1e293b",
      "borderColor": "#e7e5e4",
      "borderRadius": 16,
      "shadowIntensity": "lg"
    },
    "timeline": {
      "lineColor": "#e7e5e4",
      "lineColorActive": "#a8a29e",
      "dotColorActive": "#1e293b",
      "dotColorInactive": "#e7e5e4",
      "dotSize": 16,
      "labelColorActive": "#1e293b",
      "labelColorInactive": "#94a3b8",
      "pinColor": "#1e293b"
    },
    "sectionBackground": "#FAF7F2",
    "headingColor": "#0f172a",
    "subheadingColor": "#64748b"
  }'::jsonb,

  -- Meta
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_paris_guide_active ON paris_guide_configs(is_active);

-- Enable RLS
ALTER TABLE paris_guide_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active configurations
CREATE POLICY "Anyone can read active paris guide configs"
  ON paris_guide_configs
  FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated users can manage configs
CREATE POLICY "Authenticated users can manage paris guide configs"
  ON paris_guide_configs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_paris_guide_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_paris_guide_updated_at ON paris_guide_configs;
CREATE TRIGGER trigger_paris_guide_updated_at
  BEFORE UPDATE ON paris_guide_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_paris_guide_updated_at();

-- Insert default configuration with all 20 districts
INSERT INTO paris_guide_configs (name, global_content, districts, styles, is_active)
VALUES (
  'Paris District Guide - Default',
  '{
    "mainTitle": "Fedezd fel Párizs kerületeit",
    "subtitle": "Minden kerületnek megvan a saját karaktere. Kattints a térképre vagy navigálj az idővonalon!",
    "timelineTitle": "Felfedezési útvonal",
    "legendActiveText": "Aktív",
    "legendVisitedText": "Megtekintett",
    "legendInactiveText": "Nem aktív"
  }'::jsonb,
  '[
    {
      "districtNumber": 1,
      "isActive": true,
      "title": "1. kerület - Louvre és Châtelet",
      "subtitle": "A királyi Párizs",
      "description": "A Louvre, Tuileriák kertje és a Palais Royal otthona. Párizs történelmi szíve.",
      "highlights": ["Louvre Múzeum", "Tuileriák kertje", "Palais Royal", "Place Vendôme"],
      "mainAttraction": "A Louvre - a világ legnagyobb múzeuma",
      "localTips": "Kerüld a főbejáratot! A Carrousel du Louvre bejárat sokkal rövidebb sorokat jelent.",
      "bestFor": ["Művészet", "Történelem", "Luxus vásárlás"],
      "layoutType": "rich_ticket",
      "sortOrder": 1,
      "iconName": "Ticket"
    },
    {
      "districtNumber": 2,
      "isActive": false,
      "title": "2. kerület - Bourse",
      "subtitle": "Az üzleti negyed",
      "description": "A régi tőzsde és a fedett átjárók világa.",
      "highlights": ["Passage des Panoramas", "Bourse", "Bibliothèque nationale"],
      "layoutType": "standard",
      "sortOrder": 20,
      "iconName": "Building"
    },
    {
      "districtNumber": 3,
      "isActive": false,
      "title": "3. kerület - Temple",
      "subtitle": "A felső Marais",
      "description": "Múzeumok és rejtett udvarok világa.",
      "highlights": ["Musée Picasso", "Musée Carnavalet", "Square du Temple"],
      "layoutType": "standard",
      "sortOrder": 19,
      "iconName": "Building"
    },
    {
      "districtNumber": 4,
      "isActive": true,
      "title": "4. kerület - Notre-Dame és Marais",
      "subtitle": "A szív és a lélek",
      "description": "Notre-Dame, Hôtel de Ville, és a Marais negyed. A párizsi romantika epicentruma.",
      "highlights": ["Notre-Dame", "Marais", "Place des Vosges", "Île de la Cité"],
      "mainAttraction": "Notre-Dame katedrális",
      "localTips": "A falafel a Rue des Rosiers-n kötelező!",
      "bestFor": ["Történelem", "Gasztronómia", "Séta"],
      "layoutType": "standard",
      "sortOrder": 2,
      "iconName": "MapPin"
    },
    {
      "districtNumber": 5,
      "isActive": true,
      "title": "5. kerület - Latin negyed",
      "subtitle": "Diákok és tudósok",
      "description": "A Sorbonne, Panthéon és a könyvkereskedők negyede.",
      "highlights": ["Panthéon", "Sorbonne", "Jardin du Luxembourg", "Shakespeare and Company"],
      "mainAttraction": "Panthéon és a Latin negyed hangulata",
      "localTips": "Ülj le egy kávéra a Place de la Contrescarpe-on!",
      "bestFor": ["Kultúra", "Diákélet", "Könyvek"],
      "layoutType": "standard",
      "sortOrder": 5,
      "iconName": "BookOpen"
    },
    {
      "districtNumber": 6,
      "isActive": true,
      "title": "6. kerület - Saint-Germain-des-Prés",
      "subtitle": "Irodalmi Párizs",
      "description": "Az irodalmi kávéházak és a luxus negyede.",
      "highlights": ["Café de Flore", "Les Deux Magots", "Jardin du Luxembourg", "Saint-Sulpice"],
      "mainAttraction": "A legendás kávéházak világa",
      "localTips": "Látogasd meg a Café de Flore-t reggel, amikor még csendes!",
      "bestFor": ["Irodalom", "Kávékultúra", "Luxus"],
      "layoutType": "rich_ticket",
      "sortOrder": 6,
      "iconName": "Coffee"
    },
    {
      "districtNumber": 7,
      "isActive": true,
      "title": "7. kerület - Eiffel-torony",
      "subtitle": "Az ikonikus negyed",
      "description": "Az Eiffel-torony, Invalidusok és az Orsay Múzeum otthona.",
      "highlights": ["Eiffel-torony", "Musée dOrsay", "Invalidusok", "Champ de Mars"],
      "mainAttraction": "Az Eiffel-torony - Párizs szimbóluma",
      "localTips": "A legjobb kilátás a Trocadéróról van!",
      "bestFor": ["Turisták", "Romantika", "Fotózás"],
      "layoutType": "rich_ticket",
      "sortOrder": 3,
      "iconName": "Star"
    },
    {
      "districtNumber": 8,
      "isActive": true,
      "title": "8. kerület - Champs-Élysées",
      "subtitle": "Elegancia és fényűzés",
      "description": "A világ leghíresebb sugárútja és a luxusmárkák paradicsoma.",
      "highlights": ["Champs-Élysées", "Arc de Triomphe", "Place de la Concorde", "Grand Palais"],
      "mainAttraction": "Champs-Élysées és a Diadalív",
      "localTips": "Kerüld a turistacsapdákat az Élysées-n, inkább a mellékutcákat fedezd fel!",
      "bestFor": ["Luxus vásárlás", "Séta", "Éjszakai élet"],
      "layoutType": "rich_ticket",
      "sortOrder": 7,
      "iconName": "Crown"
    },
    {
      "districtNumber": 9,
      "isActive": false,
      "title": "9. kerület - Opéra",
      "subtitle": "Kultúra és vásárlás",
      "description": "Az Opera Garnier és a nagy áruházak világa.",
      "highlights": ["Opéra Garnier", "Galeries Lafayette", "Printemps"],
      "layoutType": "standard",
      "sortOrder": 18,
      "iconName": "Music"
    },
    {
      "districtNumber": 10,
      "isActive": false,
      "title": "10. kerület - Canal Saint-Martin",
      "subtitle": "Hipszter Párizs",
      "description": "A Canal Saint-Martin és a trendik negyede.",
      "highlights": ["Canal Saint-Martin", "Gare du Nord", "Rue du Faubourg Saint-Denis"],
      "layoutType": "standard",
      "sortOrder": 17,
      "iconName": "Waves"
    },
    {
      "districtNumber": 11,
      "isActive": false,
      "title": "11. kerület - Bastille",
      "subtitle": "Éjszakai élet",
      "description": "A Bastille tér és az éjszakai szórakozás központja.",
      "highlights": ["Place de la Bastille", "Oberkampf", "Rue de Lappe"],
      "layoutType": "standard",
      "sortOrder": 16,
      "iconName": "Moon"
    },
    {
      "districtNumber": 12,
      "isActive": false,
      "title": "12. kerület - Bercy",
      "subtitle": "Modern Párizs",
      "description": "A Bercy negyed és a modern építészet.",
      "highlights": ["Bercy Village", "Promenade Plantée", "Bois de Vincennes"],
      "layoutType": "standard",
      "sortOrder": 15,
      "iconName": "Building2"
    },
    {
      "districtNumber": 13,
      "isActive": false,
      "title": "13. kerület - Chinatown",
      "subtitle": "Ázsiai Párizs",
      "description": "Európa legnagyobb kínai negyede.",
      "highlights": ["Chinatown", "Bibliothèque nationale", "Street Art"],
      "layoutType": "standard",
      "sortOrder": 14,
      "iconName": "Utensils"
    },
    {
      "districtNumber": 14,
      "isActive": false,
      "title": "14. kerület - Montparnasse",
      "subtitle": "Művészek öröksége",
      "description": "A 20-as évek művészvilágának központja.",
      "highlights": ["Tour Montparnasse", "Cimetière du Montparnasse", "Catacombes"],
      "layoutType": "standard",
      "sortOrder": 13,
      "iconName": "Palette"
    },
    {
      "districtNumber": 15,
      "isActive": false,
      "title": "15. kerület - Vaugirard",
      "subtitle": "Lakónegyed",
      "description": "Párizs legnagyobb és legnyugodtabb kerülete.",
      "highlights": ["Parc André Citroën", "Beaugrenelle"],
      "layoutType": "standard",
      "sortOrder": 12,
      "iconName": "Home"
    },
    {
      "districtNumber": 16,
      "isActive": true,
      "title": "16. kerület - Trocadéro",
      "subtitle": "Elegáns Párizs",
      "description": "A gazdag nyugati negyed a legjobb Eiffel-kilátással.",
      "highlights": ["Trocadéro", "Palais de Tokyo", "Musée Marmottan", "Bois de Boulogne"],
      "mainAttraction": "Trocadéro - a tökéletes Eiffel-fotó helyszíne",
      "localTips": "Napfelkeltére gyere a Trocadéróra, szinte üres lesz!",
      "bestFor": ["Fotózás", "Múzeumok", "Séta"],
      "layoutType": "rich_ticket",
      "sortOrder": 8,
      "iconName": "Camera"
    },
    {
      "districtNumber": 17,
      "isActive": false,
      "title": "17. kerület - Batignolles",
      "subtitle": "Rejtett kincs",
      "description": "Helyi hangulat és autentikus párizsi élet.",
      "highlights": ["Parc Monceau", "Batignolles", "Marché des Batignolles"],
      "layoutType": "standard",
      "sortOrder": 11,
      "iconName": "Trees"
    },
    {
      "districtNumber": 18,
      "isActive": true,
      "title": "18. kerület - Montmartre",
      "subtitle": "Bohém Párizs",
      "description": "A Sacré-Cœur és a művészek negyede.",
      "highlights": ["Sacré-Cœur", "Place du Tertre", "Moulin Rouge", "Montmartre szőlőskert"],
      "mainAttraction": "Sacré-Cœur bazilika és a páratlan kilátás",
      "localTips": "Reggel érkezz, mielőtt megérkeznek a turistacsoportok!",
      "bestFor": ["Művészet", "Romantika", "Kilátás"],
      "layoutType": "rich_ticket",
      "sortOrder": 4,
      "iconName": "Sparkles"
    },
    {
      "districtNumber": 19,
      "isActive": false,
      "title": "19. kerület - Buttes-Chaumont",
      "subtitle": "Zöld oázis",
      "description": "Párizs legszebb parkja és a csatornák világa.",
      "highlights": ["Parc des Buttes-Chaumont", "La Villette", "Canal de lOurcq"],
      "layoutType": "standard",
      "sortOrder": 10,
      "iconName": "TreePine"
    },
    {
      "districtNumber": 20,
      "isActive": false,
      "title": "20. kerület - Père-Lachaise",
      "subtitle": "Történelem és street art",
      "description": "A híres temető és a multikulturális Belleville.",
      "highlights": ["Père-Lachaise temető", "Belleville", "Street Art"],
      "layoutType": "standard",
      "sortOrder": 9,
      "iconName": "Landmark"
    }
  ]'::jsonb,
  '{
    "map": {
      "baseColor": "#ffffff",
      "hoverColor": "#f5f5f4",
      "activeColor": "#1e293b",
      "strokeColor": "#cbd5e1",
      "strokeWidth": 1,
      "labelColor": "#64748b"
    },
    "card": {
      "backgroundColor": "#ffffff",
      "headerGradientFrom": "#1e293b",
      "headerGradientTo": "#334155",
      "titleColor": "#ffffff",
      "subtitleColor": "#cbd5e1",
      "bodyTextColor": "#475569",
      "accentColor": "#1e293b",
      "borderColor": "#e7e5e4",
      "borderRadius": 16,
      "shadowIntensity": "lg"
    },
    "timeline": {
      "lineColor": "#e7e5e4",
      "lineColorActive": "#a8a29e",
      "dotColorActive": "#1e293b",
      "dotColorInactive": "#e7e5e4",
      "dotSize": 16,
      "labelColorActive": "#1e293b",
      "labelColorInactive": "#94a3b8",
      "pinColor": "#1e293b"
    },
    "sectionBackground": "#FAF7F2",
    "headingColor": "#0f172a",
    "subheadingColor": "#64748b"
  }'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- ============================================
-- USAGE NOTES:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. The table stores paris guide config as JSON for flexibility
-- 3. Use the TypeScript types in lib/types/database.ts for type safety
-- ============================================
