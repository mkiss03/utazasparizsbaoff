-- Add INSERT policy for authenticated users to site_text_content table
-- This is needed for UPSERT operations in the admin panel

-- Create policy for authenticated users to insert
CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert"
ON site_text_content FOR INSERT
TO authenticated
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'site_text_content'
ORDER BY policyname;
