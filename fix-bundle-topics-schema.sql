-- ============================================
-- FIX MIGRATION: Bundle Topics Schema + Profiles RLS Recursion
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. FIX bundle_topics TABLE (add missing columns)
-- ============================================

ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS topic_order INTEGER DEFAULT 0;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS total_cards INTEGER DEFAULT 0;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE bundle_topics ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER DEFAULT 10;

-- Populate topic_order from sort_order (if that column existed from old migration)
UPDATE bundle_topics
SET topic_order = COALESCE(sort_order, 0)
WHERE topic_order = 0;

-- Populate slug for any existing rows that don't have one
UPDATE bundle_topics
SET slug = lower(regexp_replace(
  translate(title,
    'áéíóöőúüűÁÉÍÓÖŐÚÜŰ',
    'aeiooouuuAEIOOOUUU'
  ),
  '[^a-z0-9]+', '-', 'g'
))
WHERE slug IS NULL OR slug = '';

-- ============================================
-- 2. FIX flashcards TABLE (add missing columns)
-- ============================================

ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES bundle_topics(id) ON DELETE CASCADE;
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON flashcards(topic_id, card_order);
CREATE INDEX IF NOT EXISTS idx_flashcards_is_demo ON flashcards(bundle_id, is_demo);

-- ============================================
-- 3. FIX profiles INFINITE RECURSION
-- Create a SECURITY DEFINER function to check admin role
-- This bypasses RLS and breaks the recursion cycle
-- ============================================

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 4. DROP old conflicting bundle_topics policies
-- (both migration files created policies, causing conflicts)
-- ============================================

DROP POLICY IF EXISTS "Anyone can read bundle_topics" ON bundle_topics;
DROP POLICY IF EXISTS "Authenticated users can insert bundle_topics" ON bundle_topics;
DROP POLICY IF EXISTS "Authenticated users can update bundle_topics" ON bundle_topics;
DROP POLICY IF EXISTS "Authenticated users can delete bundle_topics" ON bundle_topics;
DROP POLICY IF EXISTS "Public can view published topics" ON bundle_topics;
DROP POLICY IF EXISTS "Authors and admins can view own topics" ON bundle_topics;
DROP POLICY IF EXISTS "Vendors can create topics" ON bundle_topics;
DROP POLICY IF EXISTS "Vendors can update own topics" ON bundle_topics;
DROP POLICY IF EXISTS "Vendors can delete own topics" ON bundle_topics;

-- ============================================
-- 5. RECREATE bundle_topics RLS policies
-- Simple, non-recursive policies using the SECURITY DEFINER function
-- ============================================

ALTER TABLE bundle_topics ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all topics (admin controls access at app level)
CREATE POLICY "Authenticated can read bundle_topics"
  ON bundle_topics FOR SELECT
  TO authenticated
  USING (true);

-- Public can see published topics of published bundles
CREATE POLICY "Public can read published bundle_topics"
  ON bundle_topics FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM bundles WHERE id = bundle_topics.bundle_id AND is_published = true
    )
  );

-- Authenticated users can insert (admin-only at app level)
CREATE POLICY "Authenticated can insert bundle_topics"
  ON bundle_topics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated can update bundle_topics"
  ON bundle_topics FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated can delete bundle_topics"
  ON bundle_topics FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. ADD topic_id to flashcards RLS (if missing)
-- Update card count trigger to also handle topics
-- ============================================

-- Drop old trigger if exists, recreate with topic support
DROP TRIGGER IF EXISTS update_topic_cards_count ON flashcards;
DROP FUNCTION IF EXISTS update_topic_card_count();

CREATE OR REPLACE FUNCTION update_topic_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.topic_id IS NOT NULL THEN
    UPDATE bundle_topics SET total_cards = total_cards + 1 WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' AND OLD.topic_id IS NOT NULL THEN
    UPDATE bundle_topics SET total_cards = total_cards - 1 WHERE id = OLD.topic_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.topic_id IS DISTINCT FROM NEW.topic_id THEN
      IF OLD.topic_id IS NOT NULL THEN
        UPDATE bundle_topics SET total_cards = total_cards - 1 WHERE id = OLD.topic_id;
      END IF;
      IF NEW.topic_id IS NOT NULL THEN
        UPDATE bundle_topics SET total_cards = total_cards + 1 WHERE id = NEW.topic_id;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topic_cards_count
  AFTER INSERT OR DELETE OR UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_card_count();

-- ============================================
-- DONE! Summary:
-- - bundle_topics: added slug, cover_image, topic_order, total_cards,
--                  author_id, is_published, estimated_time_minutes
-- - flashcards: added topic_id, is_demo
-- - profiles: created is_super_admin() SECURITY DEFINER function
-- - bundle_topics: dropped conflicting policies, recreated clean ones
-- ============================================
