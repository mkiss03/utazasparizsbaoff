-- ============================================
-- LOUVRE TOURS — Guided Museum Tour Routes
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

-- Tour stops table
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
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_louvre_tours_status ON louvre_tours(status);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_stops_tour_id ON louvre_tour_stops(tour_id);
CREATE INDEX IF NOT EXISTS idx_louvre_tour_stops_order ON louvre_tour_stops(tour_id, display_order);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_louvre_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_louvre_tours_updated_at
  BEFORE UPDATE ON louvre_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_louvre_tours_updated_at();

CREATE TRIGGER set_louvre_tour_stops_updated_at
  BEFORE UPDATE ON louvre_tour_stops
  FOR EACH ROW
  EXECUTE FUNCTION update_louvre_tours_updated_at();

-- RLS
ALTER TABLE louvre_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE louvre_tour_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read louvre_tours" ON louvre_tours
  FOR SELECT USING (true);
CREATE POLICY "Auth manage louvre_tours" ON louvre_tours
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read louvre_tour_stops" ON louvre_tour_stops
  FOR SELECT USING (true);
CREATE POLICY "Auth manage louvre_tour_stops" ON louvre_tour_stops
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: Louvre – Mesterművek időutazása
-- ============================================

INSERT INTO louvre_tours (title, slug, subtitle, duration_text, summary_text, tips, status, display_order)
VALUES (
  'Louvre – Mesterművek időutazása',
  'louvre-mestermuvek-idoutazasa',
  '3 órás túra a világ legnagyobb múzeumában',
  '3 órás túra',
  'Ajánlott sorrend: kezdés a Sully-szárnnyal, majd Denon-szárny (lépcső fel), végül Richelieu-szárny (leereszkedés). Összes idő: kb. 3 óra (séta és rövid magyarázat belekalkulálva).',
  'A múzeum nagy, ezért érdemes térképet vinni, a termek számai segítenek orientálódni.',
  'published',
  0
);

-- Get the tour ID for stops
DO $$
DECLARE
  tour_uuid UUID;
BEGIN
  SELECT id INTO tour_uuid FROM louvre_tours WHERE slug = 'louvre-mestermuvek-idoutazasa';

  INSERT INTO louvre_tour_stops (tour_id, stop_number, title, location_wing, location_floor, location_rooms, duration_minutes, main_artwork, description, display_order) VALUES
  (tour_uuid, 1, 'A vár mélyén – középkori erőd', 'Sully-szárny', 'Földszint', 'Salles 133–137', 10, NULL, 'Louvre eredeti 12. századi falai és vármaradványai. Figyeld meg az erőd struktúráját, a vizesárkok nyomait, a múzeum történetének kezdetét.', 1),
  (tour_uuid, 2, 'Ókori Egyiptom', 'Sully-szárny', 'Földszint', 'Salles 300–348', 20, 'Taniszi Szfinx', 'A szfinx mérete, anyaga (gránit), az uralkodói hatalom szimbóluma. Az ókori egyiptomi művészet egyik legkiemelkedőbb darabja.', 2),
  (tour_uuid, 3, 'Görög és római antikvitások', 'Sully-szárny', 'Földszint', 'Salles 400–433', 20, 'Milói Vénusz (Salle 345)', 'A test arányait, mozgását, az antik szépségfogalom megjelenését érdemes megfigyelni. A görög szobrászat csúcspontja.', 3),
  (tour_uuid, 4, 'Hellenisztikus dráma: Szamothrakéi Niké', 'Denon-szárny', '1. emelet', 'Salle 703 – Daru-lépcső', 15, 'Szamothrakéi Niké', 'A mozgás dinamikája, a drámai hatás, az energiát sugárzó formák. A Daru-lépcső tetején áll, monumentális elhelyezésben.', 4),
  (tour_uuid, 5, 'Itáliai reneszánsz: Mona Lisa', 'Denon-szárny', '1. emelet', 'Salle 711', 20, 'Mona Lisa (Leonardo da Vinci)', 'Figyeld a mosolyt, a tekintetet, Leonardo sfumato technikáját. A világ leghíresebb festménye üveg mögött, mindig tömegben.', 5),
  (tour_uuid, 6, 'Itáliai reneszánsz: A kánai menyegző', 'Denon-szárny', '1. emelet', 'Salle 711', 15, 'A kánai menyegző (Veronese)', 'Monumentális kompozíció, 130 alak, a tér és a mozgás érzékeltetése. A Mona Lisával szemben lóg – a kontrasztot érdemes átérezni.', 6),
  (tour_uuid, 7, 'Napóleon koronázása', 'Denon-szárny', '1. emelet', 'Salle 702–705', 15, 'Napóleon koronázása (David)', 'A hatalom vizuális megjelenítése. Hatalmas méretű festmény, David mesterműve a francia történelem megörökítésében.', 7),
  (tour_uuid, 8, 'A Szabadság vezeti a népet', 'Denon-szárny', '1. emelet', 'Salle 700', 10, 'A Szabadság vezeti a népet (Delacroix)', 'Forradalom, allegória – a hatalom és a szabadság vizuális kifejezése, a drámai kompozíció. A francia romantika ikonja.', 8),
  (tour_uuid, 9, 'A Medúza tutaja', 'Denon-szárny', '1. emelet', 'Salle 700', 20, 'A Medúza tutaja (Géricault)', 'A kétségbeesést, a drámai fényt, a túlélés témáját figyeld. A romantika egyik legmegrázóbb alkotása.', 9),
  (tour_uuid, 10, 'Michelangelo rabszolgái', 'Richelieu-szárny', 'Földszint', 'Salle 403', 20, 'Haldokló rabszolga, Lázadó rabszolga', 'A márvány küzdelmét, a formák és mozgás feszültségét érdemes megfigyelni. Michelangelo befejezetlenül hagyott remekművei.', 10);
END $$;
