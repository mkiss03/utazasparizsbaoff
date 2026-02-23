-- ============================================
-- MUSEUM GUIDE - Louvre Interaktív Útikalauz
-- Futtasd ezt a Supabase SQL Editor-ban
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. MUSEUM GUIDE ARTWORKS TÁBLA
-- ============================================

CREATE TABLE IF NOT EXISTS museum_guide_artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  year TEXT NOT NULL,
  wing TEXT NOT NULL CHECK (wing IN ('Denon', 'Sully', 'Richelieu')),
  floor TEXT NOT NULL,
  room TEXT NOT NULL,
  story TEXT NOT NULL,
  fun_fact TEXT,
  image_url TEXT,
  gradient TEXT NOT NULL DEFAULT 'linear-gradient(160deg, #E8DDD0 0%, #D4C9BC 40%, #C4B8A8 100%)',
  map_position_x NUMERIC(5,2) NOT NULL DEFAULT 50,
  map_position_y NUMERIC(5,2) NOT NULL DEFAULT 50,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_museum_guide_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_museum_guide_artworks_updated_at
  BEFORE UPDATE ON museum_guide_artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_museum_guide_updated_at();

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_museum_guide_artworks_order ON museum_guide_artworks(display_order);
CREATE INDEX IF NOT EXISTS idx_museum_guide_artworks_published ON museum_guide_artworks(is_published);

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE museum_guide_artworks ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can see published artworks
CREATE POLICY "Museum guide artworks are publicly readable"
  ON museum_guide_artworks
  FOR SELECT
  USING (true);

-- Admin write: only authenticated users can manage
CREATE POLICY "Admins can manage museum guide artworks"
  ON museum_guide_artworks
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 4. SEED DATA — 6 alap alkotás
-- ============================================

INSERT INTO museum_guide_artworks (title, artist, year, wing, floor, room, story, fun_fact, gradient, map_position_x, map_position_y, display_order) VALUES
(
  'Mona Lisa',
  'Leonardo da Vinci',
  '1503–1519',
  'Denon',
  '1. emelet',
  '711. terem',
  E'A világ leghíresebb festménye, amit évente 10 millió ember néz meg – de igazából egy bűntény tette szupersztárrá.\n\n1911-ben Vincenzo Peruggia, egy olasz üveges, aki korábban a Louvre-ban dolgozott, egyszerűen a kabátja alá rejtve lopta el. Két évig keresték a rendőrök szerte Európában, és pont a botrány miatt lett a Mona Lisa az, ami ma: a világ leghíresebb festménye.\n\nAmikor ránézel, figyeld meg a hátteret: a bal és jobb oldal nem illeszkedik – ez Leonardo szándékos trükkje, ami a titokzatosságot fokozza.',
  'A festmény mérete mindössze 77 × 53 cm — sokakat meglep, milyen kicsi valójában.',
  'linear-gradient(160deg, #E8DDD0 0%, #D4C9BC 40%, #C4B8A8 100%)',
  30, 58, 1
),
(
  'Szamothrakéi Niké',
  'Ismeretlen görög mester',
  'Kr. e. ~190',
  'Denon',
  'Lépcsőház',
  'Daru-lépcső',
  E'Ez a 2,75 méteres márványszobor egy hajó orrán álló győzelem-istennőt ábrázol, és a Louvre egyik legdrámaibb látványa.\n\nA szobrot 1863-ban találták Szamothraké szigetén, több száz darabra törve. Az újraalkotása évtizedekig tartott.\n\nFigyeld meg, ahogy a ruha a testhez simul, mintha valódi szél fújná. Karja és feje hiányzik, de épp ez teszi tökéletessé: a képzelet befejezi azt, amit a kő nem.',
  'A lépcsőház tetejére helyezték, hogy alulról nézve még monumentálisabb legyen — pont úgy, ahogy egy hajó orrán állt volna.',
  'linear-gradient(160deg, #D6DDE4 0%, #C4CDD6 40%, #B0BBC6 100%)',
  22, 48, 2
),
(
  'Milói Vénusz',
  'Alexandrosz (feltételezett)',
  'Kr. e. ~130–100',
  'Sully',
  'Földszint',
  '346. terem',
  E'Egy görög paraszt találta Mélosz szigetén 1820-ban, miközben a földjét szántotta. A francia haditengerészet azonnal felismerte az értékét és Párizsba szállította.\n\nA karok hiánya a mai napig rejtély — van, aki szerint almát tartott, mások szerint egy pajzsba nézett.\n\nA szobor az ókori szépségideált testesíti meg, és a Louvre egyik legfontosabb kincse.',
  'A szobrot eredetileg színesre festették! Az ókori görögök szobrai mind élénk színűek voltak.',
  'linear-gradient(160deg, #DDE4D6 0%, #C6D0BC 40%, #B4C0A8 100%)',
  60, 52, 3
),
(
  'A szabadság vezeti a népet',
  'Eugène Delacroix',
  '1830',
  'Denon',
  '1. emelet',
  '700. terem',
  E'Ez a festmény az 1830-as júliusi forradalmat ábrázolja.\n\nMarianne, a félmeztelen nő a francia trikolórral, a Szabadság allegóriája lett — őt látod minden francia euró érmén és bélyegen is.\n\nDelacroix állítólag saját magát is belefestette: ő a cilinderes férfi a barikádon. A kép egyszerre dokumentum és szimbólum, a francia identitás egyik legfontosabb vizuális ikonja.',
  NULL,
  'linear-gradient(160deg, #E4D6DD 0%, #D0BCC6 40%, #C0A8B4 100%)',
  35, 66, 4
),
(
  'Hammurapi törvényoszlopa',
  'Babilóni mesterek',
  'Kr. e. ~1792–1750',
  'Richelieu',
  'Földszint',
  '227. terem',
  E'Az emberiség egyik legrégebbi írott törvénygyűjteménye: 282 törvény, kőbe vésve, közel 4000 évvel ezelőtt.\n\nA tetején Hammurapi király áll Shamash, a napisten előtt, aki a törvényeket adja neki. Innen ered a „szemet szemért, fogat fogért" mondás.\n\nA 2,25 m magas diorit sztélé szinte tökéletes állapotban maradt fenn.',
  'A törvények között szerepel a minimálbér és a fogyasztóvédelem első formája is!',
  'linear-gradient(160deg, #E4DED6 0%, #D0C8BC 40%, #C0B6A8 100%)',
  35, 22, 5
),
(
  'Nagy Szfinx',
  'Egyiptomi mesterek',
  'Kr. e. ~2600',
  'Sully',
  'Alagsor',
  'Szfinx kripta',
  E'Ez a gránit szfinx egyike a legjobb állapotban fennmaradt egyiptomi szfinxeknek.\n\nAz alagsorba lépve, a félhomályban megpillantani ezt az ősi szobrot — olyan élmény, mintha időutazáson vennél részt.\n\nA Louvre egyiptomi gyűjteménye a világon a második legnagyobb Kairó után, és ez a szfinx az egyik legrégebbi darabja.',
  NULL,
  'linear-gradient(160deg, #D6E0E4 0%, #BCD0D4 40%, #A8C0C4 100%)',
  65, 38, 6
);
