-- ===================================================================
-- SERVICES DATA INITIALIZATION
-- ===================================================================
-- This script initializes the tours table with the hardcoded services
-- from the frontend (ServicesSection.tsx)
-- ===================================================================

-- First, clear existing tours (optional - uncomment if needed)
-- DELETE FROM tours;

-- Reset the sequence if you want to start from 1
-- ALTER SEQUENCE tours_id_seq RESTART WITH 1;

-- ============================================
-- INSERT THE SERVICES
-- ============================================

-- Service 1: Párizsi városi séták
INSERT INTO tours (
  title,
  short_description,
  full_description,
  duration,
  price,
  max_group_size,
  icon_name,
  color_gradient,
  programs,
  display_order,
  created_at,
  updated_at
) VALUES (
  'Párizsi városi séták',
  'Fedezze fel Párizs rejtett kincseit egy helyi szakértővel. Személyre szabott túrák minden érdeklődési körnek.',
  'Merüljön el Párizs gazdagságában egyedi, személyre szabott városnéző sétáimon. Legyen szó a klasszikus látványosságokról vagy a rejtett kincsekről, mindent megmutatok, amit látnia kell.',
  3.5,
  80,
  8,
  'MapPin',
  'from-parisian-beige-400 to-parisian-beige-500',
  '[
    {
      "title": "Klasszikus Párizs",
      "description": "Fedezze fel az ikonikus párizsi látványosságokat",
      "items": [
        "Eiffel-torony környéke",
        "Champs-Élysées séta",
        "Arc de Triomphe",
        "Notre-Dame látogatás"
      ]
    },
    {
      "title": "Rejtett Párizs",
      "description": "Fedezze fel a turisták által kevésbé ismert helyeket",
      "items": [
        "Montmartre művésznegyede",
        "Le Marais történelmi negyede",
        "Canal Saint-Martin romantikus sétány",
        "Belső udvarok és passzázsok"
      ]
    }
  ]'::jsonb,
  1,
  NOW(),
  NOW()
)
ON CONFLICT (title) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  max_group_size = EXCLUDED.max_group_size,
  icon_name = EXCLUDED.icon_name,
  color_gradient = EXCLUDED.color_gradient,
  programs = EXCLUDED.programs,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Service 2: Múzeumi programok
INSERT INTO tours (
  title,
  short_description,
  full_description,
  duration,
  price,
  max_group_size,
  icon_name,
  color_gradient,
  programs,
  display_order,
  created_at,
  updated_at
) VALUES (
  'Múzeumi programok',
  'Múzeumlátogatás okosan: segítek megtervezni, mikor és mit érdemes megnézni.',
  'Megmutatom, hogyan foglalhat időpontra szóló belépőjegyet közvetlenül a múzeum hivatalos oldalán, hogy kevesebbet kelljen sorban állnia, és felkészítem a látogatásra, hogy jobban megértse a műalkotások hátterét.',
  2.5,
  70,
  6,
  'Calendar',
  'from-french-blue-400 to-french-blue-500',
  '[
    {
      "title": "Louvre kiállítás",
      "items": [
        "Mona Lisa",
        "Vénusz szobrok",
        "Egyiptomi műkincsek",
        "Francia festészet"
      ]
    },
    {
      "title": "Orsay Múzeum",
      "items": [
        "Impresszionista remekművek",
        "Modern művészet",
        "Váratlan kincsek"
      ]
    }
  ]'::jsonb,
  2,
  NOW(),
  NOW()
)
ON CONFLICT (title) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  max_group_size = EXCLUDED.max_group_size,
  icon_name = EXCLUDED.icon_name,
  color_gradient = EXCLUDED.color_gradient,
  programs = EXCLUDED.programs,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ============================================
-- VERIFICATION
-- ============================================

-- Check the inserted services
SELECT
  id,
  title,
  icon_name,
  color_gradient,
  duration,
  price,
  max_group_size,
  display_order,
  jsonb_pretty(programs) as programs
FROM tours
ORDER BY display_order;

-- ============================================
-- END OF SCRIPT
-- ============================================
