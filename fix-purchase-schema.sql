-- Fix purchase flow: make order_id optional in user_purchases
-- Run this in Supabase SQL Editor if user_purchases table already exists

ALTER TABLE user_purchases ALTER COLUMN order_id DROP NOT NULL;

-- If user_purchases table doesn't exist yet, create it:
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bundle_id)
);

ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_purchases' AND policyname = 'Users can view own purchases'
  ) THEN
    CREATE POLICY "Users can view own purchases"
      ON user_purchases FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Users can insert their own purchases (for mock payment)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_purchases' AND policyname = 'Users can create own purchases'
  ) THEN
    CREATE POLICY "Users can create own purchases"
      ON user_purchases FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
