-- ============================================
-- Newsletter Subscribers Table
-- ============================================
-- This table stores email addresses of newsletter subscribers

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(is_active, subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view all subscribers (for admin panel)
CREATE POLICY "Authenticated users can view subscribers"
  ON subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can update subscriber status (for unsubscribe/reactivate)
CREATE POLICY "Authenticated users can update subscribers"
  ON subscribers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete subscribers
CREATE POLICY "Authenticated users can delete subscribers"
  ON subscribers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to check if email already exists
CREATE OR REPLACE FUNCTION check_subscriber_exists(subscriber_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscribers
    WHERE email = subscriber_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
