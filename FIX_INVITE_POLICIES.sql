-- Fix Invite Code Policies - Safe to run even if policies exist

-- Step 1: Drop existing policies (safe - won't error if they don't exist)
DROP POLICY IF EXISTS "Users can check invite codes" ON invite_codes;
DROP POLICY IF EXISTS "Users can update invite codes" ON invite_codes;
DROP POLICY IF EXISTS "Service role can manage invite codes" ON invite_codes;

-- Step 2: Recreate all policies
-- Service role can do everything
CREATE POLICY "Service role can manage invite codes"
    ON invite_codes FOR ALL
    USING (auth.role() = 'service_role');

-- Anyone can check/read invite codes (even unauthenticated)
CREATE POLICY "Users can check invite codes"
    ON invite_codes FOR SELECT
    USING (true);

-- Authenticated users can update invite codes (to mark as used)
CREATE POLICY "Users can update invite codes"
    ON invite_codes FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Verify policies were created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'invite_codes'
ORDER BY policyname;

