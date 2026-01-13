-- ============================================
-- TEST DATA: Paris Bundle with Flashcards
-- ============================================
-- Run this in Supabase SQL Editor to test the Paris Flashcards section

-- First, get the super admin user ID (replace with your actual ID from profiles table)
-- You can find it by running: SELECT id, email FROM profiles WHERE role = 'super_admin' LIMIT 1

-- Create a test bundle for Paris (if one doesn't exist)
INSERT INTO bundles (
  id,
  title,
  slug,
  description,
  short_description,
  cover_image,
  city,
  category,
  author_id,
  is_published,
  total_cards,
  difficulty_level,
  estimated_time_minutes
) VALUES (
  gen_random_uuid(),
  'Párizs Alapok',
  'paris-basics',
  'Tanulj meg alapvető francia szavakat és kifejezéseket a Fények Városában. Ez a csomag ideális az utazásra való felkészüléshez.',
  'Alapvető francia szavak Párizshoz',
  NULL,
  'Paris',
  'Culture',
  (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1),
  true,
  6,
  'beginner',
  10
)
ON CONFLICT DO NOTHING
RETURNING id INTO @bundle_id;

-- Get the bundle ID (if just created or existing)
-- Insert test flashcards for Paris
WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Szia! Mit mondunk franciául?',
  'Bonjour!',
  'A szokásos üdvözlés',
  NULL,
  1
FROM bundle_id
ON CONFLICT DO NOTHING;

WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Köszönöm franciául',
  'Merci',
  'Vagy: Merci beaucoup',
  NULL,
  2
FROM bundle_id
ON CONFLICT DO NOTHING;

WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Beszélsz angolul?',
  'Parlez-vous anglais?',
  'Hasznos kérdés az utazásnál',
  NULL,
  3
FROM bundle_id
ON CONFLICT DO NOTHING;

WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Egy kávét, kérem',
  'Un café, s''il vous plaît',
  'Étteremben/kávézóban szokás',
  NULL,
  4
FROM bundle_id
ON CONFLICT DO NOTHING;

WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Mennyibe kerül?',
  'Combien ça coûte?',
  'Vásárláskor hasznos',
  NULL,
  5
FROM bundle_id
ON CONFLICT DO NOTHING;

WITH bundle_id AS (
  SELECT id FROM bundles 
  WHERE slug = 'paris-basics' 
  AND city = 'Paris'
  LIMIT 1
)
INSERT INTO flashcards (
  bundle_id,
  question,
  answer,
  hint,
  image_url,
  card_order
)
SELECT 
  bundle_id.id,
  'Jó estét!',
  'Bonsoir!',
  'Este köszöntésre',
  NULL,
  6
FROM bundle_id
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 
  b.title,
  b.city,
  COUNT(f.id) as flashcard_count
FROM bundles b
LEFT JOIN flashcards f ON b.id = f.bundle_id
WHERE b.city = 'Paris'
GROUP BY b.id, b.title, b.city;
