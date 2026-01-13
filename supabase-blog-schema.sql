-- Blog Posts Table for Párizs Tour Guide
-- Add this to your existing Supabase database

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Create index on published posts for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, published_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (is_published = true);

-- RLS Policy: Authenticated users can view all posts
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog post
INSERT INTO posts (title, slug, excerpt, content, cover_image, is_published, published_at)
VALUES (
  'Párizs rejtett kincsei: A Marais negyed',
  'parizs-rejtett-kincsei-marais',
  'Fedezze fel a Marais varázslatos utcáit, ahol a történelem és a modern divat találkozik.',
  '<h2>Üdvözöljük a Marais negyedben!</h2><p>A Marais Párizs egyik legérdekesebb és legváltozatosabb negyede. Itt találhatók a város legszebb múzeumai, éttermei és butikjai.</p><h3>Mit érdemes megnézni?</h3><ul><li><strong>Place des Vosges</strong> - Párizs legrégebbi tere</li><li><strong>Musée Carnavalet</strong> - Párizs történetének múzeuma</li><li><strong>Rue des Rosiers</strong> - A zsidó negyed szíve</li></ul><p>Gyere el velem egy sétára, és fedezd fel Te is ezeket a csodálatos helyeket!</p>',
  '/images/blog-marais.jpg',
  true,
  NOW()
)
ON CONFLICT DO NOTHING;

-- Create storage bucket for blog images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog images
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
