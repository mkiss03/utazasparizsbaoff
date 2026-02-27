-- ============================================
-- LOUVRE TOURS — Interactive Guided Museum Tour
-- Safe to re-run (idempotent)
-- ============================================

-- Main tours table
CREATE TABLE IF NOT EXISTS louvre_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  duration_text TEXT NOT NULL DEFAULT '3 órás túra',
  summary_text TEXT,
  tips TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tour stops table (with rich content for interactive guide)
CREATE TABLE IF NOT EXISTS louvre_tour_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES louvre_tours(id) ON DELETE CASCADE,
  stop_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  location_wing TEXT NOT NULL DEFAULT '',
  location_floor TEXT NOT NULL DEFAULT '',
  location_rooms TEXT NOT NULL DEFAULT '',
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  main_artwork TEXT,
  description TEXT NOT NULL DEFAULT '',
  story TEXT NOT NULL DEFAULT '',
  fun_fact TEXT,
  image_url TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add new columns if they don't exist (for upgrades from v1 schema)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'louvre_tour_stops' AND column_name = 'story') THEN
    ALTER TABLE louvre_tour_stops ADD COLUMN story TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'louvre_tour_stops' AND column_name = 'fun_fact') THEN
    ALTER TABLE louvre_tour_stops ADD COLUMN fun_fact TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'louvre_tour_stops' AND column_name = 'image_url') THEN
    ALTER TABLE louvre_tour_stops ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'louvre_tour_stops' AND column_name = 'is_demo') THEN
    ALTER TABLE louvre_tour_stops ADD COLUMN is_demo BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Purchase tracking
CREATE TABLE IF NOT EXISTS louvre_tour_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  access_token UUID UNIQUE DEFAULT gen_random_uuid(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_louvre_tours_status ON louvre_tours(status);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_stops_tour_id ON louvre_tour_stops(tour_id);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_stops_order ON louvre_tour_stops(tour_id, display_order);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_purchases_email ON louvre_tour_purchases(guest_email);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_purchases_token ON louvre_tour_purchases(access_token);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_purchases_status ON louvre_tour_purchases(payment_status);

-- Updated_at triggers (drop first to avoid "already exists" errors)
CREATE OR REPLACE FUNCTION update_louvre_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_louvre_tours_updated_at ON louvre_tours;
CREATE TRIGGER set_louvre_tours_updated_at
  BEFORE UPDATE ON louvre_tours
  FOR EACH ROW EXECUTE FUNCTION update_louvre_tours_updated_at();

DROP TRIGGER IF EXISTS set_louvre_tour_stops_updated_at ON louvre_tour_stops;
CREATE TRIGGER set_louvre_tour_stops_updated_at
  BEFORE UPDATE ON louvre_tour_stops
  FOR EACH ROW EXECUTE FUNCTION update_louvre_tours_updated_at();

DROP TRIGGER IF EXISTS set_louvre_tour_purchases_updated_at ON louvre_tour_purchases;
CREATE TRIGGER set_louvre_tour_purchases_updated_at
  BEFORE UPDATE ON louvre_tour_purchases
  FOR EACH ROW EXECUTE FUNCTION update_louvre_tours_updated_at();

-- Auto-generate order numbers: LT-YYYYMMDD-NNNN
CREATE OR REPLACE FUNCTION generate_louvre_tour_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 13) AS INTEGER)
  ), 0) + 1 INTO seq_num
  FROM louvre_tour_purchases
  WHERE order_number LIKE 'LT-' || today_str || '-%';

  NEW.order_number := 'LT-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_louvre_tour_order_number ON louvre_tour_purchases;
CREATE TRIGGER set_louvre_tour_order_number
  BEFORE INSERT ON louvre_tour_purchases
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_louvre_tour_order_number();

-- RLS
ALTER TABLE louvre_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE louvre_tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE louvre_tour_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read louvre_tours" ON louvre_tours;
CREATE POLICY "Public read louvre_tours" ON louvre_tours FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth manage louvre_tours" ON louvre_tours;
CREATE POLICY "Auth manage louvre_tours" ON louvre_tours FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read louvre_tour_stops" ON louvre_tour_stops;
CREATE POLICY "Public read louvre_tour_stops" ON louvre_tour_stops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth manage louvre_tour_stops" ON louvre_tour_stops;
CREATE POLICY "Auth manage louvre_tour_stops" ON louvre_tour_stops FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public insert louvre_tour_purchases" ON louvre_tour_purchases;
CREATE POLICY "Public insert louvre_tour_purchases" ON louvre_tour_purchases FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read louvre_tour_purchases" ON louvre_tour_purchases;
CREATE POLICY "Public read louvre_tour_purchases" ON louvre_tour_purchases FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth manage louvre_tour_purchases" ON louvre_tour_purchases;
CREATE POLICY "Auth manage louvre_tour_purchases" ON louvre_tour_purchases FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA (only inserts if tour doesn't exist yet)
-- ============================================

INSERT INTO louvre_tours (title, slug, subtitle, duration_text, summary_text, tips, status, display_order)
SELECT
  'Louvre – Mesterművek időutazása',
  'louvre-mestermuvek-idoutazasa',
  '3 órás túra a világ legnagyobb múzeumában',
  '~3 óra · 10 megálló · 3 szárny',
  'Ajánlott sorrend: kezdés a Sully-szárnnyal, majd Denon-szárny (lépcső fel), végül Richelieu-szárny (leereszkedés).',
  'A múzeum nagy, ezért érdemes térképet vinni – a termek számai segítenek orientálódni.',
  'published',
  0
WHERE NOT EXISTS (SELECT 1 FROM louvre_tours WHERE slug = 'louvre-mestermuvek-idoutazasa');

-- Seed stops (only if the tour has no stops yet)
DO $$
DECLARE
  tour_uuid UUID;
  stop_count INTEGER;
BEGIN
  SELECT id INTO tour_uuid FROM louvre_tours WHERE slug = 'louvre-mestermuvek-idoutazasa';
  IF tour_uuid IS NULL THEN RETURN; END IF;

  SELECT COUNT(*) INTO stop_count FROM louvre_tour_stops WHERE tour_id = tour_uuid;
  IF stop_count > 0 THEN
    -- Update existing stops with rich content (story, fun_fact, is_demo) if they're empty
    UPDATE louvre_tour_stops SET
      story = CASE stop_number
        WHEN 1 THEN 'Mielőtt múzeum lett volna, a Louvre egy középkori erőd volt, amelyet Fülöp Ágost francia király építtetett 1190 körül. Az eredeti vár hatalmas, kör alakú öregtoronnyal (donjon) rendelkezett, amelyet vizesárok vett körül. Ma az erőd alapjainak maradványai a múzeum legalsó szintjén tekinthetők meg – a vastag kőfalak és a vizesárok nyomai évszázadok történetét mesélik el. Figyeld meg az erőd struktúráját: a falak vastagsága elárulja, milyen komoly védelmi szerepet töltött be az építmény.'
        WHEN 2 THEN 'A Louvre egyiptomi gyűjteménye a világ egyik leggazdagabbja, köszönhetően Jean-François Champollionnak, aki megfejtette a hieroglifákat. A Taniszi Szfinx – egy hatalmas gránit szobor – az uralkodói hatalom megtestesítője. A szfinx arcvonásai több fáraót is ábrázolhatnak, mivel az egyiptomiak gyakran újrafaragták a szobrokat. Figyeld meg a szfinx méretét és a gránit megmunkálásának finomságát – mindez kéziszerszámokkal készült, több ezer évvel ezelőtt.'
        WHEN 3 THEN 'A Milói Vénusz (Kr.e. 130-100 körül) a görög szobrászat egyik legismertebb alkotása. Milosz szigetén találta egy paraszt 1820-ban, és azonnal Franciaországba szállították. A szobor Aphroditét, a szerelem istennőjét ábrázolja. Hiányzó karjai rejtély: senki sem tudja biztosan, milyen pozícióban voltak eredetileg. A test arányai, az enyhe csípő-elfordulás (contrapposto) és a drapéria kezelése a hellenisztikus művészet csúcsát mutatják. Figyeld meg, hogyan sugároz nyugalmat és erőt egyszerre.'
        WHEN 4 THEN 'A Szamothrakéi Niké (Kr.e. 190 körül) a győzelem szárnyas istennőjét ábrázolja, amint egy hajó orrára száll le. A Daru-lépcső tetején áll – ez az elhelyezés szándékos, hogy alulról felnézve a szobor még monumentálisabbnak tűnjön. A szél fújta ruha, a kitárt szárnyak és a dinamikus testhelyzet páratlan drámai hatást kelt. Figyeld meg, hogyan tapad a vékony anyag a testre, feltárva az alatta lévő formákat – ez a "nedves drapéria" technika a hellenisztikus szobrászat jellegzetessége.'
        WHEN 5 THEN 'Leonardo da Vinci 1503 és 1519 között festette a Mona Lisát, és soha nem adta ki a kezéből – magával vitte Franciaországba, ahol I. Ferenc király vásárolta meg. A kép titka a sfumato technikában rejlik: Leonardo a kontúrokat elmosta, lágy átmeneteket hozva létre, ami élethű, szinte lélegző arcot eredményez. A mosoly rejtélye optikai illúzió: ha a szemére nézel, mosolyog – ha a szájára nézel, eltűnik. A háttér tájkép szándékosan aszimmetrikus, ami a kép mélységérzetét fokozza. Tipp: először a Mona Lisát nézd meg, majd fordulj meg – a vele szemben lógó hatalmas Kánai menyegző legalább olyan lenyűgöző.'
        WHEN 6 THEN 'Paolo Veronese 1563-ban festette ezt a hatalmas vásznat (677 × 994 cm) egy velencei kolostor étkezőjébe. A bibliai jelenet – Jézus első csodája, a víz borrá változtatása – itt egy pazar velencei lakomaként jelenik meg. A 130 alakot tartalmazó kompozícióban kortárs személyiségek is felismerhetők. Figyeld meg a tér mélységét, a színek gazdagságát és a mozgás érzékeltetését. A Mona Lisával szemben lóg – a méretbeli és stílusbeli kontraszt szándékos.'
        WHEN 7 THEN 'Jacques-Louis David 1807-ben fejezte be ezt a 6×10 méteres monumentális festményt, amely Napóleon 1804-es koronázási szertartását ábrázolja a Notre-Dame-ban. A kép propagandacélú: Napóleon saját magát koronázza meg (nem a pápa), ezzel hangsúlyozva, hogy hatalma nem az egyháztól, hanem saját magától ered. A festményen több mint 200 alak szerepel, mindegyik portrészerű pontossággal. David több részletet is megváltoztatott a valósághoz képest – például Napóleon anyját is belefestette, bár a koronázáson nem volt jelen.'
        WHEN 8 THEN 'Eugène Delacroix 1830-ban festette a képet, az ugyanazon évi júliusi forradalom ihletésére. A központi alak, Marianne – a francia köztársaság allegorikus alakja – a trikolórt lobogtatva vezeti a felkelőket a barikádokon át. A kép ötvözi az allegóriát a nyers realizmussal: Marianne eszményített alak, de körülötte valódi sebesültek és halottak fekszenek. A füst, a mozgás és a drámai fények a romantikus festészet jellegzetességei.'
        WHEN 9 THEN 'Théodore Géricault 1819-ben festette a képet, amely egy valódi tragédiát ábrázol: a Méduse francia hadihajó 1816-os hajótörését. 147 embert zsúfoltak egy rögtönzött tutajra, és 13 nap után csak 15-en élték túl – kannibalizmus és őrület közepette. Géricault megszállottan kutatta a témát: hullaszobákat látogatott, túlélőkkel beszélt. A kép kompozíciója piramis alakú – az alján a halottak és haldoklók, a csúcsán egy alak integet egy távoli hajónak. Figyeld meg a drámai fényt és a testek feszültségét.'
        WHEN 10 THEN 'Michelangelo eredetileg II. Gyula pápa síremlékéhez tervezte ezeket a szobrokat (1513-1516 körül), de a projekt soha nem készült el a tervezett formában. A Haldokló rabszolga álomszerű, beletörődő pózt mutat – mintha a lélek szabadulna a test fogságából. A Lázadó rabszolga ezzel szemben küzd a láncai ellen, teste feszült, izmok feszülnek. Michelangelo szándékosan hagyta befejezetlenül: a „non finito" technika azt sugallja, hogy az alakok a márványból próbálnak kiszabadulni. Figyeld meg, hol csiszolt és hol nyers a felület.'
        ELSE story
      END,
      fun_fact = CASE stop_number
        WHEN 1 THEN 'A Louvre-t eredetileg nem palotának, hanem erődnek építették a vikingek elleni védelemre!'
        WHEN 2 THEN 'A Taniszi Szfinx-et a 19. században találták meg, és olyan nehéz volt, hogy különleges hajóval szállították Franciaországba.'
        WHEN 3 THEN 'A szobor két részből áll – a felső és alsó felet külön faragták, majd csapokkal illesztették össze.'
        WHEN 4 THEN 'A szobrot 118 darabra törve találták meg Szamothraké szigetén 1863-ban, és évekig tartott az összerakása.'
        WHEN 5 THEN 'A Mona Lisa 1911-ben eltűnt a Louvre-ból! Egy olasz festő, Vincenzo Peruggia lopta el, és két évig rejtegette az ágy alatt.'
        WHEN 6 THEN 'Napóleon hadserege hozta el a festményt Velencéből 1797-ben. Olyan nagy volt, hogy a szállításhoz ketté kellett vágni.'
        WHEN 7 THEN 'David két változatot is festett – a másik ma a Versailles-i palotában van.'
        WHEN 8 THEN 'Ez a festmény ihlette a Szabadság-szobrot is – Bartholdi, a szobrász, bevallottan Delacroix képéből merített.'
        WHEN 9 THEN 'Géricault a festmény kedvéért hónapokat töltött hullaszobákban, hogy a halott testek ábrázolása minél hitelesebb legyen.'
        WHEN 10 THEN 'A szobrokat Michelangelo Roberto Strozinak ajándékozta, aki továbbadta a francia királynak – így kerültek Párizsba.'
        ELSE fun_fact
      END,
      is_demo = CASE WHEN stop_number <= 2 THEN true ELSE false END
    WHERE tour_id = tour_uuid AND (story = '' OR story IS NULL);
    RETURN;
  END IF;

  -- Fresh insert of all 10 stops
  INSERT INTO louvre_tour_stops (tour_id, stop_number, title, location_wing, location_floor, location_rooms, duration_minutes, main_artwork, description, story, fun_fact, is_demo, display_order) VALUES
  (tour_uuid, 1, 'A vár mélyén – középkori erőd', 'Sully-szárny', 'Földszint', 'Salles 133–137', 10, NULL,
   'Louvre eredeti 12. századi falai és vármaradványai.',
   'Mielőtt múzeum lett volna, a Louvre egy középkori erőd volt, amelyet Fülöp Ágost francia király építtetett 1190 körül. Az eredeti vár hatalmas, kör alakú öregtoronnyal (donjon) rendelkezett, amelyet vizesárok vett körül. Ma az erőd alapjainak maradványai a múzeum legalsó szintjén tekinthetők meg – a vastag kőfalak és a vizesárok nyomai évszázadok történetét mesélik el. Figyeld meg az erőd struktúráját: a falak vastagsága elárulja, milyen komoly védelmi szerepet töltött be az építmény.',
   'A Louvre-t eredetileg nem palotának, hanem erődnek építették a vikingek elleni védelemre!',
   true, 1),

  (tour_uuid, 2, 'Ókori Egyiptom', 'Sully-szárny', 'Földszint', 'Salles 300–348', 20, 'Taniszi Szfinx',
   'Az ókori egyiptomi művészet egyik legkiemelkedőbb darabja.',
   'A Louvre egyiptomi gyűjteménye a világ egyik leggazdagabbja, köszönhetően Jean-François Champollionnak, aki megfejtette a hieroglifákat. A Taniszi Szfinx – egy hatalmas gránit szobor – az uralkodói hatalom megtestesítője. A szfinx arcvonásai több fáraót is ábrázolhatnak, mivel az egyiptomiak gyakran újrafaragták a szobrokat. Figyeld meg a szfinx méretét és a gránit megmunkálásának finomságát – mindez kéziszerszámokkal készült, több ezer évvel ezelőtt.',
   'A Taniszi Szfinx-et a 19. században találták meg, és olyan nehéz volt, hogy különleges hajóval szállították Franciaországba.',
   true, 2),

  (tour_uuid, 3, 'Görög és római antikvitások – Milói Vénusz', 'Sully-szárny', 'Földszint', 'Salle 345', 20, 'Milói Vénusz',
   'A görög szobrászat csúcspontja – az antik szépségfogalom megtestesítője.',
   'A Milói Vénusz (Kr.e. 130-100 körül) a görög szobrászat egyik legismertebb alkotása. Milosz szigetén találta egy paraszt 1820-ban, és azonnal Franciaországba szállították. A szobor Aphroditét, a szerelem istennőjét ábrázolja. Hiányzó karjai rejtély: senki sem tudja biztosan, milyen pozícióban voltak eredetileg. A test arányai, az enyhe csípő-elfordulás (contrapposto) és a drapéria kezelése a hellenisztikus művészet csúcsát mutatják. Figyeld meg, hogyan sugároz nyugalmat és erőt egyszerre.',
   'A szobor két részből áll – a felső és alsó felet külön faragták, majd csapokkal illesztették össze.',
   false, 3),

  (tour_uuid, 4, 'Szamothrakéi Niké', 'Denon-szárny', '1. emelet', 'Salle 703 – Daru-lépcső', 15, 'Szamothrakéi Niké',
   'A mozgás dinamikája és a drámai energia a hellenisztikus művészet csúcsa.',
   'A Szamothrakéi Niké (Kr.e. 190 körül) a győzelem szárnyas istennőjét ábrázolja, amint egy hajó orrára száll le. A Daru-lépcső tetején áll – ez az elhelyezés szándékos, hogy alulról felnézve a szobor még monumentálisabbnak tűnjön. A szél fújta ruha, a kitárt szárnyak és a dinamikus testhelyzet páratlan drámai hatást kelt. Figyeld meg, hogyan tapad a vékony anyag a testre, feltárva az alatta lévő formákat – ez a "nedves drapéria" technika a hellenisztikus szobrászat jellegzetessége.',
   'A szobrot 118 darabra törve találták meg Szamothraké szigetén 1863-ban, és évekig tartott az összerakása.',
   false, 4),

  (tour_uuid, 5, 'Mona Lisa', 'Denon-szárny', '1. emelet', 'Salle 711', 20, 'Mona Lisa (Leonardo da Vinci)',
   'A világ leghíresebb festménye – Leonardo sfumato technikájának csúcsa.',
   'Leonardo da Vinci 1503 és 1519 között festette a Mona Lisát, és soha nem adta ki a kezéből – magával vitte Franciaországba, ahol I. Ferenc király vásárolta meg. A kép titka a sfumato technikában rejlik: Leonardo a kontúrokat elmosta, lágy átmeneteket hozva létre, ami élethű, szinte lélegző arcot eredményez. A mosoly rejtélye optikai illúzió: ha a szemére nézel, mosolyog – ha a szájára nézel, eltűnik. A háttér tájkép szándékosan aszimmetrikus, ami a kép mélységérzetét fokozza. Tipp: először a Mona Lisát nézd meg, majd fordulj meg – a vele szemben lógó hatalmas Kánai menyegző legalább olyan lenyűgöző.',
   'A Mona Lisa 1911-ben eltűnt a Louvre-ból! Egy olasz festő, Vincenzo Peruggia lopta el, és két évig rejtegette az ágy alatt.',
   false, 5),

  (tour_uuid, 6, 'A kánai menyegző', 'Denon-szárny', '1. emelet', 'Salle 711', 15, 'A kánai menyegző (Veronese)',
   'A Louvre legnagyobb festménye – 130 alak monumentális kompozícióban.',
   'Paolo Veronese 1563-ban festette ezt a hatalmas vásznat (677 × 994 cm) egy velencei kolostor étkezőjébe. A bibliai jelenet – Jézus első csodája, a víz borrá változtatása – itt egy pazar velencei lakomaként jelenik meg. A 130 alakot tartalmazó kompozícióban kortárs személyiségek is felismerhetők. Figyeld meg a tér mélységét, a színek gazdagságát és a mozgás érzékeltetését. A Mona Lisával szemben lóg – a méretbeli és stílusbeli kontraszt szándékos.',
   'Napóleon hadserege hozta el a festményt Velencéből 1797-ben. Olyan nagy volt, hogy a szállításhoz ketté kellett vágni.',
   false, 6),

  (tour_uuid, 7, 'Napóleon koronázása', 'Denon-szárny', '1. emelet', 'Salle 702', 15, 'Napóleon koronázása (David)',
   'A hatalom vizuális megjelenítése – David monumentális mesterműve.',
   'Jacques-Louis David 1807-ben fejezte be ezt a 6×10 méteres monumentális festményt, amely Napóleon 1804-es koronázási szertartását ábrázolja a Notre-Dame-ban. A kép propagandacélú: Napóleon saját magát koronázza meg (nem a pápa), ezzel hangsúlyozva, hogy hatalma nem az egyháztól, hanem saját magától ered. A festményen több mint 200 alak szerepel, mindegyik portrészerű pontossággal. David több részletet is megváltoztatott a valósághoz képest – például Napóleon anyját is belefestette, bár a koronázáson nem volt jelen.',
   'David két változatot is festett – a másik ma a Versailles-i palotában van.',
   false, 7),

  (tour_uuid, 8, 'A Szabadság vezeti a népet', 'Denon-szárny', '1. emelet', 'Salle 700', 10, 'A Szabadság vezeti a népet (Delacroix)',
   'A francia romantika ikonja – forradalom és allegória egyetlen képben.',
   'Eugène Delacroix 1830-ban festette a képet, az ugyanazon évi júliusi forradalom ihletésére. A központi alak, Marianne – a francia köztársaság allegorikus alakja – a trikolórt lobogtatva vezeti a felkelőket a barikádokon át. A kép ötvözi az allegóriát a nyers realizmussal: Marianne eszményített alak, de körülötte valódi sebesültek és halottak fekszenek. A füst, a mozgás és a drámai fények a romantikus festészet jellegzetességei.',
   'Ez a festmény ihlette a Szabadság-szobrot is – Bartholdi, a szobrász, bevallottan Delacroix képéből merített.',
   false, 8),

  (tour_uuid, 9, 'A Medúza tutaja', 'Denon-szárny', '1. emelet', 'Salle 700', 20, 'A Medúza tutaja (Géricault)',
   'A romantika egyik legmegrázóbb alkotása – a kétségbeesés és túlélés drámája.',
   'Théodore Géricault 1819-ben festette a képet, amely egy valódi tragédiát ábrázol: a Méduse francia hadihajó 1816-os hajótörését. 147 embert zsúfoltak egy rögtönzött tutajra, és 13 nap után csak 15-en élték túl – kannibalizmus és őrület közepette. Géricault megszállottan kutatta a témát: hullaszobákat látogatott, túlélőkkel beszélt. A kép kompozíciója piramis alakú – az alján a halottak és haldoklók, a csúcsán egy alak integet egy távoli hajónak. Figyeld meg a drámai fényt és a testek feszültségét.',
   'Géricault a festmény kedvéért hónapokat töltött hullaszobákban, hogy a halott testek ábrázolása minél hitelesebb legyen.',
   false, 9),

  (tour_uuid, 10, 'Michelangelo rabszolgái', 'Richelieu-szárny', 'Földszint', 'Salle 403', 20, 'Haldokló rabszolga, Lázadó rabszolga',
   'Michelangelo befejezetlenül hagyott remekművei – a márvány küzdelme.',
   'Michelangelo eredetileg II. Gyula pápa síremlékéhez tervezte ezeket a szobrokat (1513-1516 körül), de a projekt soha nem készült el a tervezett formában. A Haldokló rabszolga álomszerű, beletörődő pózt mutat – mintha a lélek szabadulna a test fogságából. A Lázadó rabszolga ezzel szemben küzd a láncai ellen, teste feszült, izmok feszülnek. Michelangelo szándékosan hagyta befejezetlenül: a „non finito" technika azt sugallja, hogy az alakok a márványból próbálnak kiszabadulni. Figyeld meg, hol csiszolt és hol nyers a felület.',
   'A szobrokat Michelangelo Roberto Strozinak ajándékozta, aki továbbadta a francia királynak – így kerültek Párizsba.',
   false, 10);
END $$;
