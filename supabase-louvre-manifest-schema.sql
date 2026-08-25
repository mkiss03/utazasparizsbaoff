-- ============================================
-- Louvre Audio Guide -- Fázis 2: szerkeszthető manifest + médiatár
-- ============================================
-- Ez teszi lehetővé, hogy Viktória az admin felületen (Louvre Audio Túra ->
-- Túra szerkesztő) programozói segítség nélkül szerkessze az állomásokat,
-- szegmenseket, hangfájlokat és a bónuszsávot -- kódmódosítás és redeploy
-- nélkül. A /louvre/tour-manifest.json innentől nem statikus fájl, hanem
-- ebből a táblából szolgálja ki a mindenkori ÉLES (is_published = true)
-- verziót.

CREATE TABLE IF NOT EXISTS louvre_manifest_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL UNIQUE,        -- pl. 2026-08-25-001
  title TEXT NOT NULL,
  data JSONB NOT NULL,                 -- { stations: [...], bonus: {...} }
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_louvre_manifest_versions_created ON louvre_manifest_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_louvre_manifest_versions_published ON louvre_manifest_versions(is_published) WHERE is_published = true;

-- Csak egy publikált verzió legyen egyszerre.
CREATE UNIQUE INDEX IF NOT EXISTS idx_louvre_manifest_single_published
  ON louvre_manifest_versions ((is_published))
  WHERE is_published = true;

CREATE OR REPLACE FUNCTION update_louvre_manifest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_louvre_manifest_updated_at ON louvre_manifest_versions;
CREATE TRIGGER set_louvre_manifest_updated_at
  BEFORE UPDATE ON louvre_manifest_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_louvre_manifest_updated_at();

ALTER TABLE louvre_manifest_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view the published Louvre manifest"
  ON louvre_manifest_versions FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage Louvre manifest versions"
  ON louvre_manifest_versions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Tárhely a feltöltött borítóképekhez és a konvertált (AAC/.m4a) hangokhoz
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('louvre-media', 'louvre-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view Louvre media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'louvre-media');

CREATE POLICY "Authenticated users can upload Louvre media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'louvre-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update Louvre media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'louvre-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete Louvre media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'louvre-media' AND auth.role() = 'authenticated');

-- ============================================
-- Seed: a jelenlegi (kódba épített) 3 állomásos demó, már publikálva --
-- így a /louvre oldal a migráció után is pontosan ugyanúgy működik tovább,
-- Viktória pedig ebből kiindulva tudja szerkeszteni az admin felületen.
-- ============================================

INSERT INTO louvre_manifest_versions (version, title, data, is_published, published_at)
VALUES (
  '2026-08-25-001',
  'Hét tárgy, amely hazudik neked (ingyenes ízelítő)',
  $manifest$
  {
    "stations": [
      {
        "id": "sarnyas-bika",
        "title": "A szárnyas bika",
        "navigation": "Richelieu szárny, földszint, mezopotámiai régiségek, Khorsabad-udvar",
        "coverImage": "/images/louvre1.jpeg",
        "segments": [
          { "type": "audio", "id": "a01", "src": "/louvre/audio/sarnyas-bika-a01.wav", "duration": 8, "caption": "Előtted egy asszír őrszellem, egy lamassu áll -- ember feje, oroszlán teste és sasszárnya van. Több tonnás kőtömbből faragták, még Krisztus előtt 700 körül." },
          { "type": "pause", "sec": 20, "prompt": "Sétálj körbe, és számold meg, hány lába van a szobornak!" },
          { "type": "audio", "id": "a02", "src": "/louvre/audio/sarnyas-bika-a02.wav", "duration": 6, "caption": "Ötöt számoltál? Nem tévedtél. A szobrász szándékosan farag ötödik lábat, hogy szemből nézve nyugodtan álljon, oldalról nézve pedig lépésben legyen -- optikai trükk, három évezreddel a mozgókép előtt." },
          { "type": "choice", "question": "Szerinted szemből vagy oldalról hat erősebben a szobor?", "options": [ { "label": "Szemből", "goto": "a03-szembol" }, { "label": "Oldalról", "goto": "a03-oldalrol" } ] },
          { "type": "audio", "id": "a03-szembol", "src": "/louvre/audio/sarnyas-bika-a03-szembol.wav", "duration": 5, "caption": "Szemből a bika mozdulatlan őrző -- ez a kapubejáratok célja volt: megállítani a tekintetet." },
          { "type": "audio", "id": "a03-oldalrol", "src": "/louvre/audio/sarnyas-bika-a03-oldalrol.wav", "duration": 5, "caption": "Oldalról viszont lépésben van -- mintha követne. A palota ura pontosan ezt akarta: sose tudd biztosan, mozog-e." }
        ],
        "codeword": "ŐRZŐ",
        "transcript": "Előtted egy asszír őrszellem, egy lamassu áll, ember feje, oroszlán teste és sasszárnya van, több tonnás kőtömbből faragva Kr. e. 700 körül. Számold meg a lábait: ötöt fogsz találni. A szobrász szándékosan adott hozzá egy ötödik lábat, hogy szemből nézve a szobor nyugodtan álljon, oldalról nézve pedig lépésben legyen -- optikai trükk, három évezreddel a mozgókép feltalálása előtt. Szemből mozdulatlan őrző, oldalról pedig mintha követne."
      },
      {
        "id": "mona-lisa",
        "title": "Mona Lisa",
        "navigation": "Denon szárny, 1. emelet, 711-es terem",
        "coverImage": "/images/louvre1.jpeg",
        "segments": [
          { "type": "audio", "id": "a01", "src": "/louvre/audio/mona-lisa-a01.wav", "duration": 8, "caption": "1911 augusztusában a Mona Lisa egyszerűen eltűnt a falról. Két napig senki sem vette észre -- a múzeum azt hitte, fényképezik." },
          { "type": "pause", "sec": 15, "prompt": "Nézd meg, mekkora a kép valójában -- kisebb, mint gondolnád, ugye?" },
          { "type": "audio", "id": "a02", "src": "/louvre/audio/mona-lisa-a02.wav", "duration": 7, "caption": "A tolvaj egy olasz asztalos volt, Vincenzo Peruggia, aki egy szekrényben töltötte az éjszakát, reggel pedig egyszerűen kisétált a képpel a kabátja alatt. Két évig lapult nála, mire Firenzében megpróbálta eladni." },
          { "type": "choice", "question": "Szerinted a lopás előtt is ilyen híres volt a festmény?", "options": [ { "label": "Igen, mindig is híres volt", "goto": "a03-tevhit" }, { "label": "Nem, a lopás tette híressé", "goto": "a03-igaz" } ] },
          { "type": "audio", "id": "a03-tevhit", "src": "/louvre/audio/mona-lisa-a03-tevhit.wav", "duration": 6, "caption": "Pedig nem: a lopás előtt egy volt a sok reneszánsz portré közül. A világsajtó tette azzá, ami ma." },
          { "type": "audio", "id": "a03-igaz", "src": "/louvre/audio/mona-lisa-a03-igaz.wav", "duration": 6, "caption": "Pontosan. A lopás híre bejárta a világsajtót, és attól kezdve zarándokhely lett a fal, ahol addig a kép lógott." }
        ],
        "codeword": "TOLVAJ",
        "transcript": "1911 augusztusában a Mona Lisa eltűnt a falról, két napig senki nem vette észre. A tolvaj egy olasz asztalos volt, Vincenzo Peruggia, aki egy szekrényben töltötte az éjszakát a Louvre-ban, majd reggel a kabátja alatt kisétált a képpel. Két évig őrizte otthon, mire Firenzében megpróbálta eladni. A lopás előtt a Mona Lisa egy volt a sok reneszánsz portré közül -- a világsajtó és a botrány tette azzá a képpé, amit ma mindenki ismer."
      },
      {
        "id": "napoleon-koronazasa",
        "title": "Napóleon koronázása",
        "navigation": "Denon szárny, 1. emelet, 75. terem (nagy francia festmények terme)",
        "coverImage": "/images/louvre1.jpeg",
        "segments": [
          { "type": "audio", "id": "a01", "src": "/louvre/audio/napoleon-a01.wav", "duration": 8, "caption": "Ez a Louvre legnagyobb festménye, közel tíz méter széles. Jacques-Louis David festette, aki Napóleon hivatalos udvari festője volt." },
          { "type": "pause", "sec": 20, "prompt": "Keresd meg a képen Napóleon anyját, aki a középső páholyban ül!" },
          { "type": "audio", "id": "a02", "src": "/louvre/audio/napoleon-a02.wav", "duration": 7, "caption": "Megtaláltad, ő ül középen, nyugodtan figyeli a jelenetet. Csakhogy Napóleon anyja a valóságban ott sem volt a koronázáson -- otthon maradt, mert veszekedett a fiával. David egyszerűen odafestette, mert Napóleon ezt kérte." }
        ],
        "codeword": "TITOK",
        "transcript": "Ez a Louvre legnagyobb festménye, közel tíz méter széles, Jacques-Louis David munkája, aki Napóleon udvari festője volt. A kép középső páholyában nyugodtan ül Napóleon anyja -- csakhogy a valóságban ő ott sem volt a koronázáson, mert összeveszett a fiával, és otthon maradt. David egyszerűen odafestette, mert Napóleon ezt kérte tőle: a történelem úgy maradjon meg, ahogy ő szerette volna."
      }
    ],
    "bonus": {
      "unlockPhrase": "ŐRZŐ TOLVAJ TITOK",
      "audio": "/louvre/audio/bonus.wav",
      "duration": 10
    }
  }
  $manifest$::jsonb,
  true,
  NOW()
)
ON CONFLICT (version) DO NOTHING;
