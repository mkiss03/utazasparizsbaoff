-- Programszervező modul — Párizs seed adatok
-- v2 tervdokumentum, 1. fázis
--
-- NEM lett lefuttatva a production adatbázison. Csak dev/preview
-- Supabase környezetben futtatandó kézzel, a motor és a /labs/planner
-- playground teszteléséhez.

INSERT INTO planner.destinations (id, slug, name, locale, timezone, hero_image, theme, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'paris',
  'Párizs',
  'hu',
  'Europe/Paris',
  '/images/paris-hero.jpg',
  '{}'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- Zónák
-- ---------------------------------------------------------------------
INSERT INTO planner.zones (id, destination_id, name, center_lat, center_lng) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Louvre / Tuileries', 48.8606, 2.3376),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Montmartre', 48.8867, 2.3431),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Le Marais', 48.8575, 2.3622),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Saint-Germain-des-Prés', 48.8539, 2.3336),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Eiffel-torony / Trocadéro', 48.8584, 2.2945),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Île de la Cité / Île Saint-Louis', 48.8530, 2.3499)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- Programok (18 db)
-- ---------------------------------------------------------------------
INSERT INTO planner.program_items (
  destination_id, title, description, images, category, duration_min,
  energy_level, time_of_day, indoor_outdoor, zone_id, lat, lng,
  opening_hours, price_range, booking_required, tags, priority
) VALUES
  (
    '00000000-0000-0000-0000-000000000001', 'Louvre múzeum', 'A világ egyik legnagyobb múzeuma -- Mona Lisa, Milói Vénusz és több ezer más remekmű.',
    '{}', 'muzeum', 180, 2, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000101', 48.8606, 2.3376,
    '{"mon":"09:00-18:00","tue":"closed","wed":"09:00-21:45","thu":"09:00-18:00","fri":"09:00-21:45","sat":"09:00-18:00","sun":"09:00-18:00"}',
    '€€', true, ARRAY['muveszet','kultura','beltéri'], 10
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Tuileries kert séta', 'Klasszikus francia kert a Louvre és a Place de la Concorde között.',
    '{}', 'seta', 45, 1, ARRAY['morning','afternoon'], 'outdoor',
    '00000000-0000-0000-0000-000000000101', 48.8634, 2.3275,
    '{"mon":"07:00-21:00","tue":"07:00-21:00","wed":"07:00-21:00","thu":"07:00-21:00","fri":"07:00-21:00","sat":"07:00-21:00","sun":"07:00-21:00"}',
    'ingyenes', false, ARRAY['termeszet','pihenes'], 5
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Sacré-Cœur bazilika', 'Montmartre csúcsán álló fehér bazilika, panorámás kilátással Párizsra.',
    '{}', 'latvanyossag', 60, 2, ARRAY['morning','afternoon','evening'], 'mixed',
    '00000000-0000-0000-0000-000000000102', 48.8867, 2.3431,
    '{"mon":"06:00-22:30","tue":"06:00-22:30","wed":"06:00-22:30","thu":"06:00-22:30","fri":"06:00-22:30","sat":"06:00-22:30","sun":"06:00-22:30"}',
    'ingyenes', false, ARRAY['kilatas','kultura'], 9
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Montmartre-i művésznegyed séta', 'Kanyargós utcák, kávézók és utcai festők a Place du Tertre körül.',
    '{}', 'seta', 90, 2, ARRAY['morning','afternoon'], 'outdoor',
    '00000000-0000-0000-0000-000000000102', 48.8862, 2.3403,
    '{}', 'ingyenes', false, ARRAY['muveszet','hangulat'], 7
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Marais gasztro séta és sajtkóstoló', 'Kis sajt- és pékségekbe betérős gasztrotúra a Marais utcáin.',
    '{}', 'gasztro', 120, 2, ARRAY['afternoon','evening'], 'mixed',
    '00000000-0000-0000-0000-000000000103', 48.8575, 2.3622,
    '{"mon":"10:00-19:00","tue":"10:00-19:00","wed":"10:00-19:00","thu":"10:00-19:00","fri":"10:00-19:00","sat":"10:00-19:00","sun":"closed"}',
    '€€', true, ARRAY['gasztro','helyi'], 8
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Place des Vosges', 'Párizs legrégebbi tervezett tere, szimmetrikus homlokzatokkal és árkádokkal.',
    '{}', 'latvanyossag', 30, 1, ARRAY['morning','afternoon','evening'], 'outdoor',
    '00000000-0000-0000-0000-000000000103', 48.8559, 2.3655,
    '{}', 'ingyenes', false, ARRAY['pihenes','fotozas'], 4
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Musée Carnavalet', 'Párizs történetét bemutató ingyenes városi múzeum a Marais szívében.',
    '{}', 'muzeum', 90, 1, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000103', 48.8579, 2.3625,
    '{"mon":"10:00-18:00","tue":"closed","wed":"10:00-18:00","thu":"10:00-18:00","fri":"10:00-18:00","sat":"10:00-18:00","sun":"10:00-18:00"}',
    'ingyenes', false, ARRAY['kultura','beltéri','csalad'], 6
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Saint-Germain-des-Prés kávéházak', 'Café de Flore és Les Deux Magots -- irodalmi kávéházi hangulat.',
    '{}', 'gasztro', 60, 1, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000104', 48.8539, 2.3336,
    '{"mon":"07:30-01:00","tue":"07:30-01:00","wed":"07:30-01:00","thu":"07:30-01:00","fri":"07:30-01:00","sat":"07:30-01:00","sun":"07:30-01:00"}',
    '€€€', false, ARRAY['kave','hangulat'], 5
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Musée d''Orsay', 'Impresszionista és posztimpresszionista remekművek egy egykori vasútállomáson.',
    '{}', 'muzeum', 150, 2, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000104', 48.8600, 2.3266,
    '{"mon":"09:30-18:00","tue":"closed","wed":"09:30-18:00","thu":"09:30-21:45","fri":"09:30-18:00","sat":"09:30-18:00","sun":"09:30-18:00"}',
    '€€', true, ARRAY['muveszet','kultura','beltéri'], 9
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Luxembourg-kert', 'Párizs egyik legszebb parkja, medencével, szobrokkal és árnyas sétányokkal.',
    '{}', 'seta', 60, 1, ARRAY['morning','afternoon'], 'outdoor',
    '00000000-0000-0000-0000-000000000104', 48.8462, 2.3372,
    '{"mon":"07:30-21:00","tue":"07:30-21:00","wed":"07:30-21:00","thu":"07:30-21:00","fri":"07:30-21:00","sat":"07:30-21:00","sun":"07:30-21:00"}',
    'ingyenes', false, ARRAY['termeszet','pihenes','csalad'], 6
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Eiffel-torony felmenetel', 'Párizs legismertebb látványossága -- kilátás a második emeletről vagy a csúcsról.',
    '{}', 'latvanyossag', 120, 2, ARRAY['afternoon','evening'], 'mixed',
    '00000000-0000-0000-0000-000000000105', 48.8584, 2.2945,
    '{"mon":"09:00-23:45","tue":"09:00-23:45","wed":"09:00-23:45","thu":"09:00-23:45","fri":"09:00-23:45","sat":"09:00-23:45","sun":"09:00-23:45"}',
    '€€€', true, ARRAY['kilatas','ikon'], 10
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Trocadéro kilátóterasz', 'A legjobb fotópont az Eiffel-toronyról, különösen napnyugtakor.',
    '{}', 'latvanyossag', 30, 1, ARRAY['afternoon','evening'], 'outdoor',
    '00000000-0000-0000-0000-000000000105', 48.8627, 2.2879,
    '{}', 'ingyenes', false, ARRAY['fotozas','kilatas'], 8
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Szajna-parti esti séta', 'Romantikus séta a folyóparton, a megvilágított hidak alatt.',
    '{}', 'seta', 60, 1, ARRAY['evening'], 'outdoor',
    '00000000-0000-0000-0000-000000000106', 48.8566, 2.3474,
    '{}', 'ingyenes', false, ARRAY['romantikus','esti'], 7
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Notre-Dame környéke és Île Saint-Louis', 'A katedrális külseje, majd fagyizás a szomszédos szigeten.',
    '{}', 'seta', 75, 1, ARRAY['morning','afternoon','evening'], 'mixed',
    '00000000-0000-0000-0000-000000000106', 48.8530, 2.3499,
    '{}', '€', false, ARRAY['kultura','csalad'], 7
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Sainte-Chapelle', 'Lenyűgöző gótikus üvegablakok -- az egyik legszebb beltéri élmény Párizsban.',
    '{}', 'latvanyossag', 45, 1, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000106', 48.8554, 2.3450,
    '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"09:00-17:00","sun":"09:00-17:00"}',
    '€€', true, ARRAY['muveszet','beltéri'], 8
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Szajna hajókázás (Bateaux-Mouches)', 'Egyórás hajótúra a folyón, a legfontosabb nevezetességek mellett elhaladva.',
    '{}', 'latvanyossag', 60, 1, ARRAY['afternoon','evening'], 'outdoor',
    '00000000-0000-0000-0000-000000000106', 48.8639, 2.3005,
    '{"mon":"10:00-22:00","tue":"10:00-22:00","wed":"10:00-22:00","thu":"10:00-22:00","fri":"10:00-22:00","sat":"10:00-22:00","sun":"10:00-22:00"}',
    '€€', true, ARRAY['kilatas','csalad','romantikus'], 6
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Vacsora bisztróban a Marais-ban', 'Hagyományos francia bisztrókonyha egy családi vezetésű étteremben.',
    '{}', 'gasztro', 90, 1, ARRAY['evening'], 'indoor',
    '00000000-0000-0000-0000-000000000103', 48.8580, 2.3610,
    '{"mon":"19:00-23:00","tue":"19:00-23:00","wed":"19:00-23:00","thu":"19:00-23:00","fri":"19:00-23:30","sat":"19:00-23:30","sun":"closed"}',
    '€€€', true, ARRAY['gasztro','esti'], 7
  ),
  (
    '00000000-0000-0000-0000-000000000001', 'Palais Garnier operaház séta', 'Az Opera épületének díszes előcsarnoka és nézőtere -- vezetett vagy önálló séta.',
    '{}', 'latvanyossag', 60, 1, ARRAY['morning','afternoon'], 'indoor',
    '00000000-0000-0000-0000-000000000101', 48.8719, 2.3316,
    '{"mon":"10:00-17:00","tue":"10:00-17:00","wed":"10:00-17:00","thu":"10:00-17:00","fri":"10:00-17:00","sat":"10:00-17:00","sun":"10:00-17:00"}',
    '€€', false, ARRAY['muveszet','beltéri'], 5
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------
-- Alap szabályok
-- ---------------------------------------------------------------------
INSERT INTO planner.rules (destination_id, rule_type, config) VALUES
  ('00000000-0000-0000-0000-000000000001', 'max_zones_per_day', '{"max": 2}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'lunch_window', '{"start": "12:00", "end": "14:00"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'daily_energy_cap', '{"relaxed": 5, "moderate": 7, "packed": 10}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'buffer_minutes', '{"between_slots": 20}'::jsonb)
ON CONFLICT DO NOTHING;
