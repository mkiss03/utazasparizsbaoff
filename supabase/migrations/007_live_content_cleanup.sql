-- ===================================================================
-- Tartalomjavítás az élő adatbázis valódi szövegeire
-- ===================================================================
-- A 006 a repó seed-szövegeit célozta; az élő tartalom ettől eltér.
-- Ez a script a 2026. októberi exportban talált élő szövegeket javítja.
--
-- Futtatás: Supabase Dashboard -> SQL Editor -> a teljes fájl bemásolása -> Run.
-- Egy tranzakcióban fut: ha bármelyik utasítás hibát ad, semmi sem változik.
-- Minden módosítás csak akkor hat, ha a kifogásolt szöveg még benne van,
-- így többször is lefuttatható.
-- ===================================================================

BEGIN;

-- 1. A "Transzferszolgaltatás" kártya törlése (reptéri transzfer, autós városnézés)
DELETE FROM tours
WHERE id = '119bc28e-4ac2-4fea-bc59-dc504b9932ed'
  AND title ILIKE 'transzfer%';

-- 2. "Utazástervezés" / Prémium csomag: foglalások intézése helyett útmutatás
UPDATE tours
SET programs = REPLACE(REPLACE(REPLACE(programs::text,
      ' Foglalások intézése (repülőjegy, szállás, belépők, programok),',
      'Segítség a foglalásokhoz: megmutatom, hol és hogyan érdemes foglalni (a foglalást és a fizetést ti intézitek)'),
      'A Prémium csomag teljes körű online utazástervezést kínál Párizsba.',
      'A Prémium csomag átfogó online utazástervezést kínál Párizsba.'),
      'megtervezem a teljes párizsi programot, intézem a szükséges foglalásokat, és egy részletes, napi bontású útitervet készítek.',
      'megtervezem a teljes párizsi programot, megmutatom, hol és hogyan érdemes foglalni, és egy részletes, napi bontású útitervet készítek. A foglalásokat és a fizetést ti intézitek, közvetlenül a szolgáltatóknál.'
    )::jsonb,
    updated_at = NOW()
WHERE id = '5ac2bef3-fa4c-40c7-8344-f359bf21531a'
  AND (programs::text LIKE '%Foglalások intézése%'
       OR programs::text LIKE '%intézem a szükséges foglalásokat%'
       OR programs::text LIKE '%teljes körű online utazástervezést%');

-- 3. Séták: egyes szám a sajtkóstolónál
UPDATE tours
SET programs = REPLACE(programs::text, 'sajtkóstolónkra', 'sajtkóstolómra')::jsonb,
    updated_at = NOW()
WHERE id = '7529cd92-e507-4ecf-8fef-9bd99855e420'
  AND programs::text LIKE '%sajtkóstolónkra%';

-- 4. Rólam: "hivatalos engedéllyel", "utazásszervezés", "transzferek" nélkül
UPDATE profile
SET about_description = E'Szeidl Viktória vagyok, hosszú évek óta Párizsban élő magyar idegenvezető és a francia kultúra rajongója.\nSok-sok éves tapasztalattal rendelkezem az idegenvezetés terén.\nMagyar utazóknak mutatom meg Párizs rejtett kincseit, titkos sétáit és izgalmas helyszíneit, amelyek a turisták többsége számára ismeretlenek.\nEgyéni és csoportos városnézéseket vezetek, és személyre szabott útitervet készítek, hogy a párizsi látogatás gördülékeny, élvezetes és felejthetetlen legyen.',
    updated_at = NOW()
WHERE about_description ILIKE '%engedély%'
   OR about_description ILIKE '%transzfer%'
   OR about_description ILIKE '%utazásszervez%';

-- 5. Hero: "Teljes körű szervezést biztosítok..." mondat törlése
UPDATE profile
SET hero_subtitle = REPLACE(hero_subtitle, E'Teljes körű szervezést biztosítok az első lépéstől az utolsóig.\n', ''),
    updated_at = NOW()
WHERE hero_subtitle LIKE E'%Teljes körű szervezést biztosítok az első lépéstől az utolsóig.\n%';

-- 6. Hírlevél: egyes szám, "exkluzív ajánlatok" nélkül
UPDATE profile
SET newsletter_description = REPLACE(newsletter_description,
      'Iratkozz fel hírlevelünkre, hogy ne maradj le a legújabb párizsi programokról és exkluzív ajánlatokról!',
      'Iratkozz fel a hírlevelemre, hogy ne maradj le a legújabb párizsi programjaimról!'),
    updated_at = NOW()
WHERE newsletter_description LIKE '%hírlevelünkre%';

-- 7. Csoportos megrendelés: transzfer és "teljes program" nélkül
UPDATE site_text_content
SET value = 'Utazási irodáknak, nagyobb társaságoknak, baráti csoportoknak, iskolai osztályoknak és céges utazóknak is szívesen tartok idegenvezetést Párizsban. Csoportos megrendelésnél a sétákat és a tematikus túrákat előre egyeztetjük, és a csoport igényeihez igazítom.'
WHERE key = 'services_group_booking_description'
  AND (value ILIKE '%transzfer%' OR value ILIKE '%utazásszervez%');

-- 8. Lós Dorina véleményének elrejtése (előre lefoglalt út, megvett jegyek).
--    Nem törlés és nem szerkesztés: az adminban visszakapcsolható.
UPDATE testimonials
SET is_visible = false
WHERE name = 'Lós Dorina'
  AND is_visible
  AND message LIKE '%minden előre le volt foglalva%';

COMMIT;

-- ===================================================================
-- Ellenőrzés
-- ===================================================================

-- Szolgáltatáskártyák (a transzfer-kártya nem szerepelhet)
SELECT title, display_order FROM tours ORDER BY display_order;

-- Rólam, hero, hírlevél
SELECT about_description, hero_subtitle, newsletter_description FROM profile;

-- Csoportos megrendelés szövege
SELECT value FROM site_text_content WHERE key = 'services_group_booking_description';

-- Látható vélemények
SELECT name, is_visible FROM testimonials ORDER BY display_order;

-- Maradt-e kifogásolt kifejezés? (üres eredmény a jó)
SELECT 'tours' AS tabla, title AS hol,
       substring(title || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(full_description, '') || ' ' || COALESCE(programs::text, '')
                 FROM '(?i)(transzfer|reptér|repülőtér|kilométer|autóval|sofőr|licenc|engedély|hivatalos idegenvezet|utazásszervez|foglalások intézése|intézem a szükséges foglalás|teljes körű)') AS talalat
FROM tours
WHERE title || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(full_description, '') || ' ' || COALESCE(programs::text, '')
      ~* '(transzfer|reptér|repülőtér|kilométer|autóval|sofőr|licenc|engedély|hivatalos idegenvezet|utazásszervez|foglalások intézése|intézem a szükséges foglalás|teljes körű)'
UNION ALL
SELECT 'site_text_content', key, substring(value FROM '(?i)(transzfer|kilométer|licenc|engedély|hivatalos idegenvezet|utazásszervez|programszervez|teljes körű)')
FROM site_text_content
WHERE value ~* '(transzfer|kilométer|licenc|engedély|hivatalos idegenvezet|utazásszervez|programszervez|teljes körű)'
UNION ALL
SELECT 'profile', 'profile', substring(COALESCE(about_description, '') || ' ' || COALESCE(hero_subtitle, '') || ' ' || COALESCE(newsletter_description, '')
                                       FROM '(?i)(transzfer|licenc|engedély|hivatalos idegenvezet|utazásszervez|teljes körű|hírlevelünk)')
FROM profile
WHERE COALESCE(about_description, '') || ' ' || COALESCE(hero_subtitle, '') || ' ' || COALESCE(newsletter_description, '')
      ~* '(transzfer|licenc|engedély|hivatalos idegenvezet|utazásszervez|teljes körű|hírlevelünk)'
UNION ALL
SELECT 'testimonials', name, substring(message FROM '(?i)(transzfer|reptér|repülőtér|autó|sofőr|fuvar|le volt foglalva|jegyek megvéve)')
FROM testimonials
WHERE is_visible AND message ~* '(transzfer|reptér|repülőtér|autó|sofőr|fuvar|le volt foglalva|jegyek megvéve)';
