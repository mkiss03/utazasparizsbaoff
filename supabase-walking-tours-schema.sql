-- ============================================
-- WALKING TOURS - Sétatúra Foglalási Rendszer
-- Futtasd ezt a Supabase SQL Editor-ban
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. WALKING TOURS TÁBLA (túra események)
-- ============================================
CREATE TABLE IF NOT EXISTS walking_tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  tour_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  meeting_point TEXT NOT NULL,
  meeting_point_url TEXT,
  price_per_person NUMERIC(10,2) NOT NULL DEFAULT 25.00,
  min_participants INTEGER NOT NULL DEFAULT 4,
  max_participants INTEGER NOT NULL DEFAULT 15,
  current_bookings INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  highlights TEXT[],
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexek
CREATE INDEX IF NOT EXISTS idx_walking_tours_date ON walking_tours(tour_date);
CREATE INDEX IF NOT EXISTS idx_walking_tours_status ON walking_tours(status);
CREATE INDEX IF NOT EXISTS idx_walking_tours_slug ON walking_tours(slug);

-- ============================================
-- 2. WALKING TOUR BOOKINGS TÁBLA (foglalások)
-- ============================================
CREATE TABLE IF NOT EXISTS walking_tour_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  walking_tour_id UUID NOT NULL REFERENCES walking_tours(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  num_participants INTEGER NOT NULL DEFAULT 1
    CHECK (num_participants >= 1),
  total_amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT DEFAULT 'card',
  booking_status TEXT NOT NULL DEFAULT 'confirmed'
    CHECK (booking_status IN ('confirmed', 'cancelled_by_user', 'cancelled_by_admin')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexek
CREATE INDEX IF NOT EXISTS idx_wt_bookings_tour ON walking_tour_bookings(walking_tour_id);
CREATE INDEX IF NOT EXISTS idx_wt_bookings_status ON walking_tour_bookings(payment_status, booking_status);

-- ============================================
-- 3. UPDATED_AT TRIGGER (ha még nem létezik)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_walking_tours_updated_at
  BEFORE UPDATE ON walking_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_walking_tour_bookings_updated_at
  BEFORE UPDATE ON walking_tour_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. AUTO ORDER NUMBER GENERÁLÁS
-- ============================================
CREATE OR REPLACE FUNCTION generate_walking_tour_order_number()
RETURNS TRIGGER AS $$
DECLARE
  tour_date DATE;
  seq_num INTEGER;
BEGIN
  SELECT wt.tour_date INTO tour_date
  FROM walking_tours wt WHERE wt.id = NEW.walking_tour_id;

  SELECT COUNT(*) + 1 INTO seq_num
  FROM walking_tour_bookings
  WHERE walking_tour_id = NEW.walking_tour_id;

  NEW.order_number := 'WT-' || TO_CHAR(tour_date, 'YYYYMMDD') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_walking_tour_order_number
  BEFORE INSERT ON walking_tour_bookings
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_walking_tour_order_number();

-- ============================================
-- 5. CURRENT_BOOKINGS AUTO-UPDATE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_walking_tour_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.booking_status = 'confirmed' AND NEW.payment_status = 'completed' THEN
    UPDATE walking_tours
    SET current_bookings = current_bookings + NEW.num_participants
    WHERE id = NEW.walking_tour_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.booking_status = 'confirmed' AND OLD.payment_status = 'completed'
       AND (NEW.booking_status != 'confirmed' OR NEW.payment_status = 'refunded') THEN
      UPDATE walking_tours
      SET current_bookings = GREATEST(current_bookings - OLD.num_participants, 0)
      WHERE id = NEW.walking_tour_id;
    ELSIF NEW.booking_status = 'confirmed' AND NEW.payment_status = 'completed'
       AND (OLD.booking_status != 'confirmed' OR OLD.payment_status != 'completed') THEN
      UPDATE walking_tours
      SET current_bookings = current_bookings + NEW.num_participants
      WHERE id = NEW.walking_tour_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER walking_tour_booking_count_trigger
  AFTER INSERT OR UPDATE ON walking_tour_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_walking_tour_booking_count();

-- ============================================
-- 6. RLS (Row Level Security)
-- ============================================
ALTER TABLE walking_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE walking_tour_bookings ENABLE ROW LEVEL SECURITY;

-- Walking tours: mindenki látja a published/completed túrákat
CREATE POLICY "Public can view published walking tours"
  ON walking_tours FOR SELECT
  USING (status IN ('published', 'completed'));

-- Walking tours: admin mindent lát
CREATE POLICY "Admin can view all walking tours"
  ON walking_tours FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Walking tours: admin insert/update/delete
CREATE POLICY "Admin can insert walking tours"
  ON walking_tours FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admin can update walking tours"
  ON walking_tours FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admin can delete walking tours"
  ON walking_tours FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Bookings: bárki (anon is) létrehozhat foglalást
CREATE POLICY "Anyone can create walking tour bookings"
  ON walking_tour_bookings FOR INSERT
  WITH CHECK (true);

-- Bookings: bárki láthatja (a publikus success oldalhoz kell)
CREATE POLICY "Anyone can view walking tour bookings"
  ON walking_tour_bookings FOR SELECT
  USING (true);

-- Bookings: admin update (visszatérítés, lemondás)
CREATE POLICY "Admin can update walking tour bookings"
  ON walking_tour_bookings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ============================================
-- 7. CALENDAR SETTINGS TÁBLA (naptár megjelenés)
-- ============================================
CREATE TABLE IF NOT EXISTS walking_tour_calendar_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_calendar_settings_updated_at
  BEFORE UPDATE ON walking_tour_calendar_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE walking_tour_calendar_settings ENABLE ROW LEVEL SECURITY;

-- Mindenki olvashatja
CREATE POLICY "Anyone can read calendar settings"
  ON walking_tour_calendar_settings FOR SELECT
  USING (true);

-- Admin kezelhet
CREATE POLICY "Admin can insert calendar settings"
  ON walking_tour_calendar_settings FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admin can update calendar settings"
  ON walking_tour_calendar_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admin can delete calendar settings"
  ON walking_tour_calendar_settings FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
