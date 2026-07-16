-- Programszervező modul — egyszerű, fix programterv sablon
--
-- A korábbi, kérdőív-alapú wizard/flow-szerkesztő (planner.flows,
-- planner.requests/itineraries) egy önálló, később értékesíthető modul
-- marad, de a valós ügyféligény ennél jóval egyszerűbb: Viktória saját
-- kézzel állítja össze egy adott foglaláshoz a napra bontott programtervet
-- (fix napok, szabad szöveges tételek, időpontok, "lefoglalva" pipák), amit
-- aztán egy szép, megosztható oldalon küld el a vendégnek -- ugyanabban a
-- vizuális stílusban, amit a wizard-nál már láttunk.
--
-- Ez egy ÚJ, önálló tábla -- szándékosan NEM a meglévő planner.itineraries
-- táblát bővíti, mert az a motor (ProgramItem-alapú, katalógushoz kötött)
-- struktúráját tükrözi, ez viszont szabad szöveges, kézzel szerkesztett
-- tartalom.
--
-- NEM lett lefuttatva a production adatbázison. Csak dev/preview
-- Supabase környezetben futtatandó kézzel.

CREATE TABLE IF NOT EXISTS planner.trip_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,

  guest_name VARCHAR(255),
  date_range_label VARCHAR(100) NOT NULL,   -- pl. "2026.07.11-07.14."
  accommodation VARCHAR(255),
  headcount SMALLINT,

  -- napi blokkok: [{ id, dateLabel, note, items: [{ id, time, text, confirmed }] }]
  days JSONB NOT NULL DEFAULT '[]'::jsonb,

  curator_message TEXT,

  is_published BOOLEAN NOT NULL DEFAULT false,
  share_token UUID NOT NULL DEFAULT gen_random_uuid(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_trip_plans_destination ON planner.trip_plans(destination_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_planner_trip_plans_share_token ON planner.trip_plans(share_token);

ALTER TABLE planner.trip_plans ENABLE ROW LEVEL SECURITY;

-- A vendég a megosztott linkből (share_token) csak a publikált tervet
-- olvashatja -- semmi mást nem lát a táblából.
CREATE POLICY "public read published trip plans" ON planner.trip_plans
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "admin full access trip plans" ON planner.trip_plans
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
