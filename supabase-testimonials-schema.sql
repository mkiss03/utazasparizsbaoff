-- Testimonials table for customer reviews and experiences
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date TEXT,
  avatar TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only visible testimonials)
CREATE POLICY "Allow public read visible testimonials"
ON testimonials FOR SELECT
TO public
USING (is_visible = true);

-- Create policy for authenticated users to manage testimonials
CREATE POLICY "Allow authenticated users to insert testimonials"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update testimonials"
ON testimonials FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete testimonials"
ON testimonials FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_testimonials_updated_at_trigger
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert sample testimonials
INSERT INTO testimonials (name, message, rating, date, avatar, display_order, is_visible) VALUES
('Kovács Mária', 'Fantasztikus élmény volt! Viktória személyessége és szakértelme egyedivé tette a túrát. A Marais negyedben olyan helyekre vitt, amiket sosem találtam volna meg egyedül. Csak ajánlani tudom!', 5, '2024 december', 'K', 1, true),
('Nagy Péter', 'Profi, kedves idegenvezetés! Párizst megismertük Viktória segítségével és rengeteg hasznos tippet kaptunk. A gyerekek is imádták a programokat. Köszönjük szépen!', 5, '2024 november', 'N', 2, true),
('Szabó Anna', 'Tökéletes volt minden! Az idegenvezetés alatt rengeteg érdekességet mesélt Viktória, amiket csak egy helyi ismerhet. Az Eiffel-toronyról készült fotóinkat a mai napig imádjuk. Biztos visszatérünk!', 5, '2024 október', 'S', 3, true),
('Varga László', 'Életre szóló élményt kaptunk! Nem csak egy idegenvezető, hanem egy valódi barát, aki mindent megtett azért, hogy felejthetetlen legyen az utunk. A Louvre-ban töltött időt sosem felejtem el!', 5, '2024 szeptember', 'V', 4, true)
ON CONFLICT DO NOTHING;
