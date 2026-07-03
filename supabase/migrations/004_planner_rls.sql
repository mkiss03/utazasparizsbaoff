-- Programszervező modul — RLS a `planner` sémához
-- v2 tervdokumentum, 1. fázis
--
-- NEM lett lefuttatva a production adatbázison. Csak dev/preview környezetben.
--
-- Elv (3. fejezet a tervdokumentumban):
--   - a publikus wizard (anon) csak `insert`-elhet a planner.requests-be,
--     és olvashatja az aktív katalógust (destinations, zones, program_items,
--     rules egy adott destination-höz)
--   - az itineraries táblából kifelé kizárólag a kind='published' sorok
--     láthatók, és csak érvényes share_token birtokában
--   - minden más (update/delete a fenti táblákon, bármilyen hozzáférés a
--     configs / review_events táblákhoz) kizárólag hitelesített admin
--     (authenticated) felhasználónak érhető el

ALTER TABLE planner.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.program_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.review_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner.configs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- destinations: publikus olvasás csak az aktív desztinációkra
-- ---------------------------------------------------------------------
CREATE POLICY "public read active destinations" ON planner.destinations
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "admin full access destinations" ON planner.destinations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- zones: publikus olvasás (a wizard/térkép ezekre hivatkozik)
-- ---------------------------------------------------------------------
CREATE POLICY "public read zones" ON planner.zones
  FOR SELECT
  USING (true);

CREATE POLICY "admin full access zones" ON planner.zones
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- program_items: publikus olvasás csak az aktív katalógusra
-- (a motor és a szerkesztő katalógus-kereséséhez kell)
-- ---------------------------------------------------------------------
CREATE POLICY "public read active program items" ON planner.program_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "admin full access program items" ON planner.program_items
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- rules: publikus olvasás (a motor kliens-oldali futtatásához is kellhet)
-- ---------------------------------------------------------------------
CREATE POLICY "public read rules" ON planner.rules
  FOR SELECT
  USING (true);

CREATE POLICY "admin full access rules" ON planner.rules
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- requests: anon csak insert-elhet (a wizard beküldése), semmit nem olvashat
-- vissza -- az admin review queue authenticated felhasználóként fér hozzá
-- ---------------------------------------------------------------------
CREATE POLICY "public insert requests" ON planner.requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin full access requests" ON planner.requests
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- itineraries: publikus olvasás kizárólag a published verziókra.
-- A share_token maga a belépési kulcs (nem kitalálható UUID) -- az app
-- kód mindig `.eq('share_token', token)`-nel szűr, RLS csak azt biztosítja,
-- hogy generated/edited (nem publikált) verzió sosem szivároghat ki, és
-- share_token nélküli sort senki nem tud publikusan lekérni.
-- ---------------------------------------------------------------------
CREATE POLICY "public read published itinerary by share token" ON planner.itineraries
  FOR SELECT
  USING (
    kind = 'published'
    AND share_token IS NOT NULL
  );

CREATE POLICY "admin full access itineraries" ON planner.itineraries
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- review_events / configs: admin-only, semmilyen publikus hozzáférés
-- ---------------------------------------------------------------------
CREATE POLICY "admin full access review events" ON planner.review_events
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin full access configs" ON planner.configs
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
