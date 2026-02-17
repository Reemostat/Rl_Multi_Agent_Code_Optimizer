-- Create optimization_history table for tracking optimization runs
CREATE TABLE IF NOT EXISTS optimization_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_code TEXT,
    optimized_code TEXT,
    reward FLOAT,
    runtime_delta FLOAT,
    memory_delta FLOAT,
    runtime_improvement_pct FLOAT,
    memory_improvement_pct FLOAT,
    quality_score FLOAT,
    refinement_depth INTEGER,
    strategy_used VARCHAR(50),
    objective_weights JSONB,
    trace JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_optimization_history_user_id ON optimization_history(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_history_created_at ON optimization_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_optimization_history_reward ON optimization_history(reward DESC);

-- Enable Row Level Security
ALTER TABLE optimization_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own optimization history"
    ON optimization_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage optimization history"
    ON optimization_history FOR ALL
    USING (auth.role() = 'service_role');

