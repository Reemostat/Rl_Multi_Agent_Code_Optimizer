-- Create invite_codes table
CREATE TABLE IF NOT EXISTS invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_by_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create usage_limits table
CREATE TABLE IF NOT EXISTS usage_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requests_today INTEGER DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index on invite_codes for faster lookups
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_used ON invite_codes(used);

-- Create index on usage_limits
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_last_reset ON usage_limits(last_reset);

-- Enable Row Level Security
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invite_codes (service role can read all, users can check if code exists)
CREATE POLICY "Service role can manage invite codes"
    ON invite_codes FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Users can check invite codes"
    ON invite_codes FOR SELECT
    USING (true);

-- RLS Policies for usage_limits (users can only see their own)
CREATE POLICY "Users can view own usage"
    ON usage_limits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage limits"
    ON usage_limits FOR ALL
    USING (auth.role() = 'service_role');

-- Function to reset daily usage limits
CREATE OR REPLACE FUNCTION reset_daily_usage()
RETURNS void AS $$
BEGIN
    UPDATE usage_limits
    SET requests_today = 0, last_reset = NOW()
    WHERE last_reset < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

