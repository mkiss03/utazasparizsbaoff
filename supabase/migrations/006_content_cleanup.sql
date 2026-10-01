-- ===================================================================
-- Tartalomjavítás az élő adatbázisban (a kódbeli szövegjavítások párja)
-- ===================================================================
-- Futtatás: Supabase Dashboard -> SQL Editor -> a teljes fájl bemásolása -> Run.
-- Előtte érdemes exportot készíteni a tours, site_text_content, profile és
-- testimonials táblákról.
--
-- Egy tranzakcióban fut: ha bármelyik utasítás hibát ad, semmi sem változik.
-- A módosítások csak akkor hatnak, ha a mező még az eredeti seed-szöveget
-- tartalmazza, így az adminban azóta átírt tartalmat nem írják felül.
-- A végén lévő lekérdezések megmutatják az eredményt.
-- ===================================================================

BEGIN;

-- 1. A "Közlekedés és transzfer" szolgáltatás törlése (főoldali kártya)
DELETE FROM tours
WHERE title = 'Közlekedés és transzfer';

-- 2. Városi séták: egyes szám
UPDATE tours
SET full_description = 'Merüljön el Párizs gazdagságában egyedi, személyre szabott városnéző sétáimon. Legyen szó a klasszikus látványosságokról vagy a rejtett kincsekről, mindent megmutatok, amit látnia kell.',
    updated_at = NOW()
WHERE title = 'Párizsi városi séták'
  AND full_description = 'Merüljön el Párizs gazdagságában egyedi, személyre szabott városnéző sétáink során. Legyen szó a klasszikus látványosságokról vagy a rejtett kincsekről, mi mindent megmutatunk, amit látnia kell.';

-- 3. Múzeumi programok: "Kerülje el a sorokat" helyett tanácsadás
UPDATE tours
SET short_description = 'Múzeumlátogatás okosan: segítek megtervezni, mikor és mit érdemes megnézni.',
    updated_at = NOW()
WHERE title = 'Múzeumi programok'
  AND short_description = 'Átfogó múzeumi élmények Párizs világszínvonalú múzeumaiban. Kerülje el a sorokat és fedezzen fel többet.';

UPDATE tours
SET full_description = 'Megmutatom, hogyan foglalhat időpontra szóló belépőjegyet közvetlenül a múzeum hivatalos oldalán, hogy kevesebbet kelljen sorban állnia, és felkészítem a látogatásra, hogy jobban megértse a műalkotások hátterét.',
    updated_at = NOW()
WHERE title = 'Múzeumi programok'
  AND full_description = 'Tapasztalja meg Párizs világhírű múzeumait szakértő útmutatásunkkal. Segítünk elkerülni a sorokat és betekintést nyújtunk a műalkotások és kiállítások mögé.';

-- 4. Lábléc: "Programszervezés" helyett "Utazási tanácsadás"; a "Transzferek"
--    elemet a kód már nem jeleníti meg, a sort töröljük.
UPDATE site_text_content
SET value = 'Utazási tanácsadás'
WHERE key = 'footer_service_2'
  AND value = 'Programszervezés';

DELETE FROM site_text_content
WHERE key = 'footer_service_3';

-- 5. Rólam szöveg: "licencelt" helyett semleges megfogalmazás
UPDATE profile
SET about_description = REPLACE(about_description, 'licencelt párizsi idegenvezetője', 'Párizsban élő magyar idegenvezető')
WHERE about_description LIKE '%licencelt párizsi idegenvezetője%';

UPDATE profile
SET about_description = REPLACE(about_description, 'szeretném megosztani veletek', 'szeretném megosztani Önökkel')
WHERE about_description LIKE '%szeretném megosztani veletek%';

-- 6. Kitalált kapcsolati adatok cseréje a valódiakra
UPDATE profile SET contact_email = 'utazasparizsba@gmail.com'
WHERE contact_email = 'viktoria@parizstourist.com';

UPDATE profile SET contact_phone = '+33 7 53 14 50 35'
WHERE contact_phone = '+33 6 12 34 56 78';

UPDATE profile SET contact_whatsapp = '+33753145035'
WHERE contact_whatsapp = '+33612345678';

-- 7. A minta-vélemények elrejtése (nem törlés: az adminban visszakapcsolhatók)
UPDATE testimonials
SET is_visible = false
WHERE (name, date) IN (
  ('Kovács Mária', '2024 december'),
  ('Nagy Péter', '2024 november'),
  ('Szabó Anna', '2024 október'),
  ('Varga László', '2024 szeptember')
);

COMMIT;

-- ===================================================================
-- Ellenőrzés
-- ===================================================================

-- Szolgáltatáskártyák (a "Közlekedés és transzfer" nem szerepelhet)
SELECT title, short_description, display_order
FROM tours
ORDER BY display_order;

-- Lábléc szolgáltatások
SELECT key, value
FROM site_text_content
WHERE key LIKE 'footer_service_%'
ORDER BY key;

-- Rólam és kapcsolat
SELECT about_description, contact_email, contact_phone, contact_whatsapp
FROM profile;

-- Vélemények láthatósága
SELECT name, date, is_visible
FROM testimonials
ORDER BY display_order;

-- Maradt-e bárhol transzferre vagy engedélyre utaló szöveg? (üres eredmény a jó)
SELECT 'tours' AS tabla, title AS hol, title AS szoveg FROM tours
WHERE title || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(full_description, '') || ' ' || COALESCE(programs::text, '')
      ~* '(transzfer|reptér|repülőtér|kilométer|autóval|sofőr|licenc|hivatalos idegenvezet|utazásszervez)'
UNION ALL
SELECT 'site_text_content', key, value FROM site_text_content
WHERE value ~* '(transzfer|kilométer|licenc|hivatalos idegenvezet|utazásszervez|programszervez)'
UNION ALL
SELECT 'profile', 'about_description', about_description FROM profile
WHERE about_description ~* '(transzfer|licenc|hivatalos idegenvezet|utazásszervez)'
UNION ALL
SELECT 'testimonials', name, message FROM testimonials
WHERE is_visible AND message ~* '(transzfer|reptér|repülőtér|autó|sofőr|fuvar)';
