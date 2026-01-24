-- Add tags column to posts table for SEO and categorization
-- This allows blog posts to have hashtags for better search engine optimization

-- Add tags column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN posts.tags IS 'Comma-separated hashtags for SEO and meta data (e.g., "#párizs, #utazás, #tippek")';

-- Create index on tags for faster search queries
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(to_tsvector('hungarian', COALESCE(tags, '')));
