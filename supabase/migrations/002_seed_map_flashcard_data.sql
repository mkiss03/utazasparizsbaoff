-- Seed initial map flashcard content
-- Migrating the existing hardcoded data from DraggableMapSection.tsx

INSERT INTO map_flashcard_content (point_id, point_title, flip_front, flip_back, pros, cons, usage, tip)
VALUES
  (
    'point-1',
    'Metróvonalak',
    'Miért olyan király a párizsi metró?',
    'A párizsi metró 16 vonallal köti össze a várost, és szinte mindenhova gyorsan eljuthatsz vele. Sűrű hálózat, gyakori járatok - ez az egyik legjobb városi közlekedési rendszer a világon!',
    '["Gyors és pontos járatok", "Sűrű hálózat - szinte mindenhova eljutsz", "Gyakori indulások (2-7 percenként)", "Olcsóbb, mint a taxi vagy Uber"]'::jsonb,
    '["Csúcsidőben nagyon zsúfolt lehet", "Nyáron nincs légkondi (meleg!)", "Néhány vonal éjszaka nem jár", "Lépcsők... sok lépcső (nem minden állomás akadálymentes)"]'::jsonb,
    '["🎫 Vegyél jegyet vagy bérletet előre", "🚪 Érvényesítsd a kapuknál (zöld lámpa = OK)", "🗺️ Nézd meg a vonalszámot és a végállomást", "📍 Kövesd a táblákat a peronhoz", "🔔 Figyelj az állomás hangosbemondójára"]'::jsonb,
    'Viktorika titkos tippje: Töltsd le a Citymapper appot! Valós időben mutatja a metrókat, és alternatív útvonalakat is ad. Csúcsidőben (8-9h, 17-19h) kerüld a Line 1-et és a Line 4-et, ha teheted - tele vannak!'
  ),
  (
    'point-2',
    'Jegyek és Bérletek',
    'Melyik jegyet vegyem Párizsban?',
    'A T+ jegy az alapjegy - egyetlen utazásra metróra, buszra, villamosra. Ha több napot töltesz Párizsban, a Navigo bérlet sokkal kifizetődőbb és kényelmesebb!',
    '["T+ jegy: olcsó, ha csak 1-2 utat teszel", "Navigo: korlátlan utazás 1 hétre", "Automatákból és pénztárakból is vehető", "Gyerekeknek kedvezmény jár"]'::jsonb,
    '["T+ NEM jó a repülőtérre (oda Navigo vagy külön jegy kell)", "T+ csak 1 zónában érvényes (központi Párizs)", "Navigo heti bérletet hétfőtől vasárnapig lehet használni", "Elveszett jegyet nem pótolnak!"]'::jsonb,
    '["🏪 Vegyél jegyet metróállomáson (automata vagy pénztár)", "🎫 T+ jegy: nyomd be a kapunál", "💳 Navigo: érintsd a kártyát a sárga olvasón", "📱 Őrizd meg a jegyed a kijáratig!", "👮 Ellenőrök bármikor kérhetik - büntetés akár 50€"]'::jsonb,
    'Viktória titkos tippje: Ha 3+ napot töltesz Párizsban, azonnal vegyél Navigo Découverte bérletet (heti bérlet ~30€). Megtérül már 4-5 utazás után! Vigyél magaddal egy útlevélképet hozzá.'
  ),
  (
    'point-3',
    'Tájékozódás',
    'Hogyan tájékozódjak a párizsi metróban?',
    'A párizsi metró színkódolt vonalakkal dolgozik - minden vonal más színű. Az állomásokon mindenhol van térkép, és a cégtáblák világosak. Nem olyan bonyolult, mint elsőre tűnik!',
    '["Színes, egyszerű térképek minden állomáson", "Mobilappok valós idejű infóval", "Jelzőtáblák franciául és angolul", "Az emberek segítőkészek (ha szépen kéred)"]'::jsonb,
    '["Néhány állomás neve hasonló - figyelj!", "Nagy átszállóállomások zavarba ejtőek lehetnek", "Wifi nem mindenhol van", "Zárvatartáskor nincs előzetes értesítés"]'::jsonb,
    '["🗺️ Használj térképappot (Google Maps, Citymapper)", "🎯 Nézd meg, melyik irány a végállomás neve", "🔄 Átszállásnál kövesd a \"Correspondance\" táblákat", "🚶 \"Sortie\" = kijárat", "📍 Nézd meg előre, melyik kijáraton menj ki"]'::jsonb,
    'Viktória titkos tippje: Screenshot-olj le térképeket OFFLINE használatra! A metróban gyakran nincs net. És ha eltévedsz, ne félj megkérdezni valakit - "Pardon, où est...?" = Elnézést, hol van...?'
  ),
  (
    'point-4',
    'Fő Csomópontok',
    'Melyek a legfontosabb átszállóállomások?',
    'Châtelet-Les Halles, Gare du Nord, és Montparnasse - ezek a legnagyobb metró-csomópontok, ahol több vonal keresztezi egymást. Itt könnyű irányt váltani, de zsúfoltak!',
    '["Sok vonalhoz gyors hozzáférés", "Üzletek, kávézók az állomásokon", "Gyakori járatok minden irányba", "Központi helyen vannak"]'::jsonb,
    '["Nagyon zsúfoltak csúcsidőben", "Könnyen eltévedhetsz a folyosókban", "Sok lépcső az átszállásnál", "Turistákkal és zsebtolvajokkal teli lehet"]'::jsonb,
    '["🧭 Kövesd a \"Correspondance\" + vonalszám táblákat", "⏱️ Számolj 5-10 perc átszállási idővel", "👜 Vigyázz a csomagjaidra!", "🚶 Tartsd jobbra a mozgólépcsőn", "📱 Ha eltévedsz, menj vissza a térképhez"]'::jsonb,
    'Viktória titkos tippje: Châtelet-Les Halles hatalmas labirintus - első alkalommal mindenki eltéved! Ha ott kell átszállnod, adj magadnak extra 10 percet. És óvatosan a táskáddal - ez a zsebtolvajok kedvenc helye!'
  )
ON CONFLICT (point_id) DO UPDATE SET
  point_title = EXCLUDED.point_title,
  flip_front = EXCLUDED.flip_front,
  flip_back = EXCLUDED.flip_back,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  usage = EXCLUDED.usage,
  tip = EXCLUDED.tip,
  updated_at = NOW();
