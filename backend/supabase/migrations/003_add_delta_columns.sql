-- Add delta columns if they don't exist (for backwards compatibility)
DO $$ 
BEGIN
    -- Add runtime_delta if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'optimization_history' 
        AND column_name = 'runtime_delta'
    ) THEN
        ALTER TABLE optimization_history ADD COLUMN runtime_delta FLOAT;
    END IF;

    -- Add memory_delta if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'optimization_history' 
        AND column_name = 'memory_delta'
    ) THEN
        ALTER TABLE optimization_history ADD COLUMN memory_delta FLOAT;
    END IF;
END $$;

