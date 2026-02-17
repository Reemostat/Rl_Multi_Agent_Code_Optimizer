-- Add UPDATE policy for invite codes (only if it doesn't exist)
-- This allows users to mark codes as used after signup

-- First, check if the policy exists and drop it if it does
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'invite_codes' 
        AND policyname = 'Users can update invite codes'
    ) THEN
        DROP POLICY "Users can update invite codes" ON invite_codes;
    END IF;
END $$;

-- Now create the UPDATE policy
CREATE POLICY "Users can update invite codes"
    ON invite_codes FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Verify all policies exist
SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has conditions'
        ELSE 'No conditions'
    END as conditions
FROM pg_policies
WHERE tablename = 'invite_codes'
ORDER BY policyname;

