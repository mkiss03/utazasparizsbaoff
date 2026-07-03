-- Programszervező modul — dedikált `planner` séma
-- v2 tervdokumentum, 1. fázis
--
-- FONTOS: ez a fájl NEM lett lefuttatva a production adatbázison.
-- Csak dev/preview Supabase környezetben futtatandó kézzel vagy Supabase
-- branching segítségével. Lásd: SUPABASE_SETUP.md / a modul tervdokumentuma.
--
-- A modul teljes adatrétege a `planner` sémában él, elkülönítve a `public`
-- sémától, hogy később önálló egységként kiemelhető legyen
-- (pl. `pg_dump --schema=planner`).

CREATE SCHEMA IF NOT EXISTS planner;

-- ---------------------------------------------------------------------
-- planner.destinations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'hu',
  timezone VARCHAR(50) NOT NULL DEFAULT 'Europe/Paris',
  hero_image TEXT,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- planner.zones
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  center_lat DOUBLE PRECISION NOT NULL,
  center_lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_zones_destination ON planner.zones(destination_id);

-- ---------------------------------------------------------------------
-- planner.program_items
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.program_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',

  category VARCHAR(100) NOT NULL,
  duration_min INTEGER NOT NULL,
  energy_level SMALLINT NOT NULL CHECK (energy_level BETWEEN 1 AND 3),

  time_of_day TEXT[] NOT NULL DEFAULT '{}', -- 'morning' | 'afternoon' | 'evening'
  indoor_outdoor VARCHAR(10) NOT NULL CHECK (indoor_outdoor IN ('indoor', 'outdoor', 'mixed')),

  zone_id UUID REFERENCES planner.zones(id) ON DELETE SET NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,

  opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  price_range VARCHAR(20),
  booking_required BOOLEAN NOT NULL DEFAULT false,

  tags TEXT[] NOT NULL DEFAULT '{}',
  priority SMALLINT NOT NULL DEFAULT 0,

  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_program_items_destination ON planner.program_items(destination_id);
CREATE INDEX IF NOT EXISTS idx_planner_program_items_zone ON planner.program_items(zone_id);
CREATE INDEX IF NOT EXISTS idx_planner_program_items_active ON planner.program_items(is_active) WHERE is_active = true;

-- ---------------------------------------------------------------------
-- planner.rules
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,
  rule_type VARCHAR(100) NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_rules_destination ON planner.rules(destination_id);

-- ---------------------------------------------------------------------
-- planner.requests — a vendég beküldött kérése
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,
  contact_email VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'draft_ready', 'in_review', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_requests_destination ON planner.requests(destination_id);
CREATE INDEX IF NOT EXISTS idx_planner_requests_status ON planner.requests(status);

-- ---------------------------------------------------------------------
-- planner.itineraries — verziózott tervek
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES planner.requests(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES planner.destinations(id) ON DELETE CASCADE,

  version INTEGER NOT NULL DEFAULT 1,
  kind VARCHAR(20) NOT NULL CHECK (kind IN ('generated', 'edited', 'published')),

  days JSONB NOT NULL DEFAULT '[]'::jsonb,
  editor_notes JSONB NOT NULL DEFAULT '{}'::jsonb,

  edited_by UUID,
  published_at TIMESTAMPTZ,
  share_token UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (request_id, version)
);

CREATE INDEX IF NOT EXISTS idx_planner_itineraries_request ON planner.itineraries(request_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_planner_itineraries_share_token
  ON planner.itineraries(share_token) WHERE share_token IS NOT NULL;

-- A gépi vázlat (kind='generated') sosem módosítható utólag: a szerkesztés
-- mindig új sort (új verziót) hoz létre. Ez adatbázis-szinten kényszerítve:
CREATE OR REPLACE FUNCTION planner.prevent_generated_itinerary_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.kind = 'generated' THEN
    RAISE EXCEPTION 'planner.itineraries: a generated verzió nem módosítható, csak új verzió hozható létre';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_generated_itinerary_update ON planner.itineraries;
CREATE TRIGGER trg_prevent_generated_itinerary_update
  BEFORE UPDATE ON planner.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION planner.prevent_generated_itinerary_update();

-- ---------------------------------------------------------------------
-- planner.review_events — audit napló
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.review_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES planner.itineraries(id) ON DELETE CASCADE,
  actor UUID,
  action VARCHAR(100) NOT NULL,
  diff JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planner_review_events_itinerary ON planner.review_events(itinerary_id);

-- ---------------------------------------------------------------------
-- planner.configs — tenant / white-label beállítások
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planner.configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL UNIQUE REFERENCES planner.destinations(id) ON DELETE CASCADE,
  branding JSONB NOT NULL DEFAULT '{}'::jsonb,
  attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
