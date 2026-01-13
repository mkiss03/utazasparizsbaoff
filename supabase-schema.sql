-- Viktória Szeidl - Parisian Tour Guide Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profile table (hero, about, contact info)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Fedezze fel Párizs titkait',
  hero_subtitle TEXT DEFAULT 'Személyre szabott túrák a Fények Városában',
  hero_cta_text TEXT DEFAULT 'Fedezze fel a túrákat',
  hero_background_image TEXT,
  about_title TEXT NOT NULL DEFAULT 'Rólam',
  about_description TEXT NOT NULL DEFAULT 'Üdvözlöm! Viktória vagyok, licencelt párizsi idegenvezetője és a francia kultúra szenvedélyes rajongója.',
  about_image TEXT,
  contact_email TEXT DEFAULT 'viktoria@parizstourist.com',
  contact_phone TEXT DEFAULT '+33 6 12 34 56 78',
  contact_whatsapp TEXT DEFAULT '+33612345678',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration NUMERIC(4, 2) DEFAULT 3.0,
  max_group_size INTEGER DEFAULT 8,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tour-images', 'tour-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Insert default profile data
INSERT INTO profile (hero_title, hero_subtitle, about_title, about_description)
VALUES (
  'Fedezze fel Párizs titkait',
  'Személyre szabott túrák a Fények Városában',
  'Rólam',
  'Üdvözlöm! Viktória vagyok, licencelt párizsi idegenvezetője és a francia kultúra szenvedélyes rajongója. Több mint 10 éve élek Párizsban, és szeretném megosztani veletek a város rejtett kincseit.'
)
ON CONFLICT DO NOTHING;

-- Insert sample tours
INSERT INTO tours (title, slug, short_description, price, duration, max_group_size, is_featured, display_order)
VALUES
  ('Klasszikus Párizs', 'klasszikus-parizs', 'Fedezze fel Párizs legismertebb nevezetességeit egyetlen varázslatos túra során.', 150.00, 3.0, 8, true, 1),
  ('Montmartre Művészei', 'montmartre-muveszei', 'Sétáljon a művészek negyedében, ahol Picasso és Van Gogh is alkotott.', 120.00, 2.5, 10, false, 2),
  ('Gasztronómiai Kaland', 'gasztro nomiai-kaland', 'Kóstolja meg Párizs legjobb ételeit és borait egy autentikus túrán.', 180.00, 4.0, 6, true, 3),
  ('Rejtett Párizs', 'rejtett-parizs', 'Fedezze fel a turistautakról távol eső, varázslatos zugokat és helyi titkokat.', 140.00, 3.0, 8, false, 4)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access, authenticated write access
CREATE POLICY "Public can view profile"
  ON profile FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update profile"
  ON profile FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view tours"
  ON tours FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert tours"
  ON tours FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tours"
  ON tours FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tours"
  ON tours FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery"
  ON gallery FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery"
  ON gallery FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_order ON tours(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);
