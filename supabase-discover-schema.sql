-- ============================================
-- Discover Items Table
-- ============================================
-- This table stores the dynamic "Discover Paris" cards
-- Admin can create, edit, delete, and reorder these items

CREATE TABLE IF NOT EXISTS discover_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  category TEXT, -- e.g., 'Gasztronómia', 'Múzeumok', 'Rejtett Kincsek'
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_discover_items_order ON discover_items(sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discover_items_published ON discover_items(is_published);
CREATE INDEX IF NOT EXISTS idx_discover_items_category ON discover_items(category);

-- Enable Row Level Security
ALTER TABLE discover_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published items
CREATE POLICY "Public can view published discover items"
  ON discover_items FOR SELECT
  USING (is_published = true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert discover items"
  ON discover_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update discover items"
  ON discover_items FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete discover items"
  ON discover_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discover_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_discover_items_updated_at
  BEFORE UPDATE ON discover_items
  FOR EACH ROW
  EXECUTE FUNCTION update_discover_items_updated_at();

-- ============================================
-- Sample Data
-- ============================================
INSERT INTO discover_items (title, description, category, sort_order, image_url, link_url) VALUES
  ('Gasztronómia', 'Fedezze fel Párizs kulináris kincseit, a Michelin-csillagos éttermektől a bájos bistrókig.', 'Gasztronómia', 1, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', '/discover#gastronomy'),
  ('Múzeumok', 'Merüljön el a művészetben és történelemben - a Louvre-tól a modern galériákig.', 'Kultúra', 2, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', '/discover#museums'),
  ('Rejtett Kincsek', 'Ismerje meg Párizs titkos kertjeit, rejtett udvarait és helyi kedvenceit.', 'Felfedezés', 3, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', '/discover#hidden-gems'),
  ('Építészet', 'Csodálja meg a párizsi építészet sokszínűségét - a gotikától a modern kori mestermûvekig.', 'Kultúra', 4, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f', '/discover#architecture'),
  ('Szórakozás', 'Tapasztalja meg Párizs pezsgő éjszakai életét, kabaréit és színházait.', 'Szórakozás', 5, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', '/discover#entertainment'),
  ('Vásárlás', 'Luxusdivatház vagy vintage piac? Fedezze fel a párizsi shopping élményt.', 'Vásárlás', 6, 'https://images.unsplash.com/photo-1483985988355-763728e1935b', '/discover#shopping')
ON CONFLICT DO NOTHING;

-- ============================================
-- Storage Bucket for Discover Images
-- ============================================
-- Create storage bucket for discover item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('discover-images', 'discover-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for discover images
CREATE POLICY "Public can view discover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'discover-images');

CREATE POLICY "Authenticated users can upload discover images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'discover-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update discover images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'discover-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete discover images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'discover-images'
    AND auth.role() = 'authenticated'
  );
