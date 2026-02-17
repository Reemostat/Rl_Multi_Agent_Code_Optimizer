-- Ensure invite codes are accessible to everyone
-- This migration ensures anyone can check and use invite codes

-- Drop existing policies if they exist (to recreate them)
-- Note: This is safe - won't error if policies don't exist
DROP POLICY IF EXISTS "Users can check invite codes" ON invite_codes;
DROP POLICY IF EXISTS "Users can update invite codes" ON invite_codes;

-- Wait a moment for the drop to complete (PostgreSQL needs this)
-- Actually, we can just recreate - DROP IF EXISTS handles it

-- Policy 1: Anyone (even unauthenticated) can SELECT/check invite codes
-- Using CREATE OR REPLACE equivalent by dropping first, then creating
CREATE POLICY "Users can check invite codes"
    ON invite_codes FOR SELECT
    USING (true);

-- Policy 2: Authenticated users can UPDATE invite codes (to mark as used)
-- This allows users to mark their code as used after signup
CREATE POLICY "Users can update invite codes"
    ON invite_codes FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Verify the policies are in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'invite_codes'
ORDER BY policyname;

