-- Create bundle_topics table
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wflvxjssecyegghlbqmq/sql

CREATE TABLE IF NOT EXISTS bundle_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by bundle
CREATE INDEX IF NOT EXISTS bundle_topics_bundle_id_idx ON bundle_topics(bundle_id);

-- Row Level Security
ALTER TABLE bundle_topics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all topics
CREATE POLICY "Anyone can read bundle_topics"
  ON bundle_topics FOR SELECT
  USING (true);

-- Allow authenticated users (admins/vendors) to insert
CREATE POLICY "Authenticated users can insert bundle_topics"
  ON bundle_topics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update bundle_topics"
  ON bundle_topics FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete bundle_topics"
  ON bundle_topics FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_bundle_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bundle_topics_updated_at
  BEFORE UPDATE ON bundle_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_bundle_topics_updated_at();
