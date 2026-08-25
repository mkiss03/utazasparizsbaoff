-- ============================================
-- Louvre Audio Guide — Fázis 1 (MVP) séma
-- ============================================
-- Ingyenes, 3 állomásos mini túra piacméréshez.
-- Nincs voucher/Stripe ebben a fázisban -- csak email-gyűjtés
-- és anonim, bejelentkezés nélküli használati esemény-napló,
-- hogy mérhető legyen a feliratkozási és teljesítési arány.

CREATE TABLE IF NOT EXISTS louvre_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'louvre-mini-tour',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_louvre_leads_email ON louvre_leads(email);
CREATE INDEX IF NOT EXISTS idx_louvre_leads_created_at ON louvre_leads(created_at DESC);

ALTER TABLE louvre_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for the free Louvre mini tour"
  ON louvre_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view Louvre leads"
  ON louvre_leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anonim eseménynapló: nincs personal data, csak egy kliensoldalon
-- generált random azonosító (nem összeköthető a lead emailjével).
-- Ebből számoljuk a "completion ráta" és "bónusz-feloldási ráta" metrikákat
-- a Fázis 1 sikermérésének leírása szerint.
CREATE TABLE IF NOT EXISTS louvre_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'tour_started',
      'station_completed',
      'tour_completed',
      'bonus_unlocked',
      'install_prompted',
      'install_accepted'
    )
  ),
  station_id TEXT,
  manifest_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_louvre_events_type ON louvre_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_louvre_events_client ON louvre_events(client_id);

ALTER TABLE louvre_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log anonymous Louvre tour events"
  ON louvre_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view Louvre events"
  ON louvre_events FOR SELECT
  USING (auth.role() = 'authenticated');
