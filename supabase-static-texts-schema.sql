-- Create site_text_content table for static texts
CREATE TABLE IF NOT EXISTS site_text_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_text_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
ON site_text_content FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated users to update"
ON site_text_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial data for Contact Section
INSERT INTO site_text_content (key, value, section) VALUES
  ('contact_title', 'Lépjen kapcsolatba', 'contact'),
  ('contact_subtitle', 'Készen áll felfedezni Párizst? Vegye fel velem a kapcsolatot, és tervezzük meg együtt az Ön álomtúráját!', 'contact'),
  ('contact_location_label', 'Helyszín', 'contact'),
  ('contact_location_value', 'Párizs, Franciaország', 'contact')
ON CONFLICT (key) DO NOTHING;

-- Insert initial data for Footer
INSERT INTO site_text_content (key, value, section) VALUES
  ('footer_description', 'Fedezze fel Párizs varázslatos titkait egy tapasztalt magyar idegenvezetővel.', 'footer'),
  ('footer_copyright', 'Szeidl Viktória. Készült', 'footer'),
  ('footer_services_title', 'Szolgáltatások:', 'footer'),
  ('footer_service_1', 'Városnéző séták', 'footer'),
  ('footer_service_2', 'Programszervezés', 'footer'),
  ('footer_service_3', 'Transzferek', 'footer')
ON CONFLICT (key) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_site_text_content_updated_at
BEFORE UPDATE ON site_text_content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
