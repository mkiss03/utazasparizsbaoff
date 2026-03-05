-- ============================================
-- MIGRATION: Add Bundle Topics (Témakörök)
-- ============================================
-- Adds intermediate layer: Bundle → Topics → Flashcards
-- Bundle = city-level container (1 per city on marketplace)
-- Topic = themed card group within a bundle (e.g., "Metro", "Food")

-- ============================================
-- 1. CREATE BUNDLE_TOPICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bundle_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  topic_order INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  estimated_time_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bundle_topics_bundle ON bundle_topics(bundle_id, topic_order);
CREATE INDEX IF NOT EXISTS idx_bundle_topics_author ON bundle_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_bundle_topics_published ON bundle_topics(is_published);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_bundle_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bundle_topics_updated_at
  BEFORE UPDATE ON bundle_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_bundle_topics_updated_at();

-- ============================================
-- 2. ADD topic_id TO FLASHCARDS
-- ============================================

ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES bundle_topics(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON flashcards(topic_id, card_order);

-- ============================================
-- 3. CARD COUNT TRIGGER FOR TOPICS
-- ============================================

CREATE OR REPLACE FUNCTION update_topic_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.topic_id IS NOT NULL THEN
    UPDATE bundle_topics SET total_cards = total_cards + 1 WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' AND OLD.topic_id IS NOT NULL THEN
    UPDATE bundle_topics SET total_cards = total_cards - 1 WHERE id = OLD.topic_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- topic changed
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
-- 4. RLS POLICIES FOR BUNDLE_TOPICS
-- ============================================

ALTER TABLE bundle_topics ENABLE ROW LEVEL SECURITY;

-- Public can view published topics of published bundles
CREATE POLICY "Public can view published topics"
  ON bundle_topics FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM bundles WHERE id = bundle_topics.bundle_id AND is_published = true
    )
  );

-- Authors and admins can view all their topics
CREATE POLICY "Authors and admins can view own topics"
  ON bundle_topics FOR SELECT
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Vendors can create topics in their own bundles
CREATE POLICY "Vendors can create topics"
  ON bundle_topics FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      EXISTS (
        SELECT 1 FROM bundles WHERE id = bundle_topics.bundle_id AND author_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
      )
    )
  );

-- Vendors can update their own topics
CREATE POLICY "Vendors can update own topics"
  ON bundle_topics FOR UPDATE
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Vendors can delete their own topics
CREATE POLICY "Vendors can delete own topics"
  ON bundle_topics FOR DELETE
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- 5. ADD STATUS + VENDOR FIELDS TO BUNDLES
-- ============================================

-- Add status field if missing (for review workflow)
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- ============================================
-- MIGRATION SUMMARY
-- ============================================
-- New hierarchy: Bundle (city) → Topics (themes) → Flashcards
-- - bundle_topics table created with RLS
-- - flashcards.topic_id added (nullable for backward compat)
-- - Card count triggers for topics
-- - Vendors can manage their own topics within bundles
