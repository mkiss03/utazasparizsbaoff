-- ============================================
-- MARKETPLACE V2 MIGRATION
-- Bundle Status Workflow + Vendor Onboarding
-- ============================================

-- ============================================
-- 1. BUNDLE STATUS WORKFLOW
-- ============================================

-- Create bundle_status enum
DO $$ BEGIN
  CREATE TYPE bundle_status AS ENUM ('draft','submitted_for_review','approved','rejected','published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add status workflow columns to bundles
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS status bundle_status DEFAULT 'draft';
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Add difficulty_level and estimated_time_minutes if missing
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'beginner';
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER DEFAULT 30;

-- Backfill: sync existing is_published=true → status='published'
UPDATE bundles SET status = 'published' WHERE is_published = true AND status = 'draft';

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_bundles_status ON bundles(status);

-- ============================================
-- 2. VENDOR APPLICATION FIELDS ON PROFILES
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_application_text TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_applied_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_approved_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_rejection_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_avatar_url TEXT;

-- Index for vendor listing queries
CREATE INDEX IF NOT EXISTS idx_profiles_vendor_status ON profiles(role, is_approved) WHERE role = 'vendor';

-- ============================================
-- 3. UPDATE RLS POLICIES FOR BUNDLE STATUS
-- ============================================

-- Drop old published-only policy, replace with status-aware
DROP POLICY IF EXISTS "Public can view published bundles" ON bundles;
CREATE POLICY "Public can view published bundles"
  ON bundles FOR SELECT
  USING (status = 'published' OR is_published = true);

-- Super admin can view all bundles (including submitted_for_review)
-- Already covered by existing "Vendors can view own bundles" policy which checks super_admin

-- ============================================
-- 4. VENDOR PROFILE RLS
-- ============================================

-- Allow vendors to update their own profile
DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Allow anyone to read approved vendor profiles (for marketplace display)
DO $$ BEGIN
  CREATE POLICY "Public can view approved vendor profiles"
    ON profiles FOR SELECT
    USING (
      role = 'vendor' AND is_approved = true
      OR auth.uid() = id
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role = 'super_admin'
      )
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
