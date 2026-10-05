-- ===================================================================
-- Kóstolós programok eltávolítása a séták kártyájáról
-- ===================================================================
-- Viktória kérésére kikerül:
--   - a "Sajtimádók és kalandorok: Sajtkóstoló Geronimo Stilton nyomában" program,
--   - a "Gasztro-túra" tétel a Montmartre-i séta listájából.
--
-- Futtatás: Supabase Dashboard -> SQL Editor -> a teljes fájl bemásolása -> Run.
-- Egy tranzakcióban fut, és csak akkor módosít, ha a fenti szövegek még benne vannak.
-- A többi program és a sorrend változatlan marad.
-- ===================================================================

BEGIN;

UPDATE tours
SET programs = (
      SELECT COALESCE(jsonb_agg(
               CASE
                 WHEN jsonb_typeof(p -> 'items') = 'array' THEN
                   jsonb_set(p, '{items}', COALESCE((
                     SELECT jsonb_agg(i ORDER BY item_ord)
                     FROM jsonb_array_elements(p -> 'items') WITH ORDINALITY AS it(i, item_ord)
                     WHERE btrim(i #>> '{}') <> 'Gasztro-túra'
                   ), '[]'::jsonb))
                 ELSE p
               END
               ORDER BY program_ord), '[]'::jsonb)
      FROM jsonb_array_elements(programs) WITH ORDINALITY AS pr(p, program_ord)
      WHERE COALESCE(p ->> 'title', '') NOT ILIKE 'Sajtimádók%'
    ),
    updated_at = NOW()
WHERE id = '7529cd92-e507-4ecf-8fef-9bd99855e420'
  AND (programs::text LIKE '%Sajtimádók%' OR programs::text LIKE '%Gasztro-túra%');

COMMIT;

-- ===================================================================
-- Ellenőrzés: a programok listája (sajtkóstoló nélkül)
-- ===================================================================
SELECT p ->> 'title' AS program, p -> 'items' AS tetelek
FROM tours, jsonb_array_elements(programs) WITH ORDINALITY AS pr(p, program_ord)
WHERE id = '7529cd92-e507-4ecf-8fef-9bd99855e420'
ORDER BY program_ord;
