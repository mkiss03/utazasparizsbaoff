-- Programszervező modul — vizuális flow-szerkesztő adatrétege
-- v2 tervdokumentum kiterjesztése: Creator-stílusú, node-alapú szerkesztő,
-- amivel Viktória (majd később bármelyik tenant) kód nélkül építheti fel a
-- vendég-wizard kérdéseit, kártyáit és elágazásait.
--
-- NEM lett lefuttatva a production adatbázison. Csak dev/preview
-- Supabase környezetben futtatandó kézzel.

CREATE TABLE IF NOT EXISTS planner.flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,

  -- A teljes node-gráf egyetlen JSON dokumentumként: { nodes: [...], edges: [...] }.
  -- Lásd lib/planner/flow-types.ts -- FlowGraph. Egyetlen blob-ban tárolva
  -- (nem normalizált node/edge táblákban), mert a szerkesztő mindig a teljes
  -- gráfot tölti be és menti vissza egyben -- ez a legegyszerűbb, legkevésbé
  -- hibalehetőséget rejtő modell egy vizuális canvas-hoz.
  graph JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (destination_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_planner_flows_destination ON planner.flows(destination_id);

ALTER TABLE planner.flows ENABLE ROW LEVEL SECURITY;

-- A publikált flow-t a vendég-oldali runtime is olvashatja (a jövőbeli
-- /programtervezo migráció előkészítéseként), minden más admin-only.
CREATE POLICY "public read published flows" ON planner.flows
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "admin full access flows" ON planner.flows
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
