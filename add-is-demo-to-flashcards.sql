-- Add is_demo column to flashcards table for demo card functionality
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create index for demo cards query performance
CREATE INDEX IF NOT EXISTS idx_flashcards_is_demo ON flashcards(bundle_id, is_demo);
