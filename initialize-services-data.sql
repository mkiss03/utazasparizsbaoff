-- ===================================================================
-- SERVICES DATA INITIALIZATION
-- ===================================================================
-- This script initializes the tours table with the 3 hardcoded services
-- from the frontend (ServicesSection.tsx)
-- ===================================================================

-- First, clear existing tours (optional - uncomment if needed)
-- DELETE FROM tours;

-- Reset the sequence if you want to start from 1
-- ALTER SEQUENCE tours_id_seq RESTART WITH 1;

-- ============================================
-- INSERT THE 3 SERVICES
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
  'Merüljön el Párizs gazdagságában egyedi, személyre szabott városnéző sétáink során. Legyen szó a klasszikus látványosságokról vagy a rejtett kincsekről, mi mindent megmutatunk, amit látnia kell.',
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
  'Átfogó múzeumi élmények Párizs világszínvonalú múzeumaiban. Kerülje el a sorokat és fedezzen fel többet.',
  'Tapasztalja meg Párizs világhírű múzeumait szakértő útmutatásunkkal. Segítünk elkerülni a sorokat és betekintést nyújtunk a műalkotások és kiállítások mögé.',
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

-- Service 3: Közlekedés és transzfer
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
  'Közlekedés és transzfer',
  'Gondtalan utazás Párizsban és környékén. Repülőtéri transzferek, városnézés autóval.',
  'Kényelmes és biztonságos közlekedést biztosítunk Párizsban és környékén. Akár repülőtéri transzferre, akár városnéző körútra van szüksége, mi gondoskodunk mindenről.',
  NULL,
  60,
  4,
  'Car',
  'from-champagne-400 to-champagne-500',
  '[
    {
      "title": "Repülőtéri transzfer",
      "items": [
        "CDG repülőtér",
        "Orly repülőtér",
        "Beauvais repülőtér",
        "Pontosság garantálva"
      ]
    },
    {
      "title": "Városnézés autóval",
      "items": [
        "Rugalmas időbeosztás",
        "Saját tempó",
        "Több látnivaló kevesebb idő alatt"
      ]
    }
  ]'::jsonb,
  3,
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
