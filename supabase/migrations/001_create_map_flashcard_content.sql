-- Create table for map flashcard content
-- This table stores the 4-card flashcard data for each map point

CREATE TABLE IF NOT EXISTS map_flashcard_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  point_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'point-1', 'point-2', etc.
  point_title VARCHAR(255) NOT NULL, -- e.g., 'Metróvonalak'

  -- Card 1: Flip Card
  flip_front TEXT NOT NULL,
  flip_back TEXT NOT NULL,

  -- Card 2: Pros & Cons (stored as JSON arrays)
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Card 3: Usage Steps (stored as JSON array)
  usage JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Card 4: Guide's Tip
  tip TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE map_flashcard_content ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (so the map can display content)
CREATE POLICY "Allow public read access" ON map_flashcard_content
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update (for admin editing)
CREATE POLICY "Allow authenticated insert" ON map_flashcard_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON map_flashcard_content
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX idx_map_flashcard_point_id ON map_flashcard_content(point_id);

-- Add comment to table
COMMENT ON TABLE map_flashcard_content IS 'Stores flashcard content for interactive map points';
