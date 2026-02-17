import { create } from 'zustand'

interface TraceEntry {
  round: number
  strategy: string
  reward: number
  runtime_delta?: number
  memory_delta?: number
  objective_weights?: {
    runtime: number
    memory: number
    quality: number
  }
  candidates_evaluated?: number
  confidence?: number
  entropy?: number
  action_probabilities?: number[]
  selected_action?: number
  components?: {
    runtime_component?: number
    memory_component?: number
    quality_component?: number
    test_bonus?: number
    length_penalty?: number
    safety_penalty?: number
    stability_variance?: number
  }
  runtime_improvement?: number
  memory_improvement?: number
}

interface OptimizationResult {
  rl_meta_action?: {
    selected_action?: number
    action_probabilities?: number[]
    entropy?: number
    confidence?: number
    model_path?: string
    strategy_mask?: number[]
    runtime_weight?: number
    memory_weight?: number
    quality_weight?: number
    refinement_depth?: number
  }
  optimized_code: string
  strategy: string
  strategy_label: string
  reward: number
  metrics: {
    baseline_runtime: number
    baseline_memory: number
    optimized_runtime: number
    optimized_memory: number
    runtime_improvement_pct: number
    memory_improvement_pct: number
    test_pass_rate: number
    quality_score?: number
    quality_breakdown?: Record<string, number>
    safety_status?: string
  }
  trace: TraceEntry[]
  objective_weights: {
    runtime: number
    memory: number
    quality: number
  }
  diff: {
    unified_diff: string[]
    original_lines: number
    optimized_lines: number
    line_changes: number
  }
  warnings: string[]
}

interface AppState {
  code: string
  optimizedCode: string | null
  result: OptimizationResult | null
  loading: boolean
  error: string | null
  usage: {
    requests_today: number
    daily_limit: number
    remaining: number
  } | null
  modelStatus: 'loading' | 'ready' | 'error'
  preferences: {
    runtime: number
    memory: number
    quality: number
  }
  
  setCode: (code: string) => void
  setOptimizedCode: (code: string | null) => void
  setResult: (result: OptimizationResult | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUsage: (usage: AppState['usage']) => void
  setModelStatus: (status: AppState['modelStatus']) => void
  setPreferences: (prefs: Partial<AppState['preferences']>) => void
  resetStore: () => void
}

export const useStore = create<AppState>((set) => ({
  code: '',
  optimizedCode: null,
  result: null,
  loading: false,
  error: null,
  usage: null,
  modelStatus: 'loading',
  preferences: {
    runtime: 0.6,
    memory: 0.25,
    quality: 0.15,
  },
  
  setCode: (code) => set({ code }),
  setOptimizedCode: (code) => set({ optimizedCode: code }),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUsage: (usage) => set({ usage }),
  setModelStatus: (status) => set({ modelStatus: status }),
  setPreferences: (prefs) => set((state) => ({
    preferences: { ...state.preferences, ...prefs }
  })),
  resetStore: () => set({
    code: '',
    optimizedCode: null,
    result: null,
    loading: false,
    error: null,
    usage: null,
    modelStatus: 'loading',
    preferences: {
      runtime: 0.6,
      memory: 0.25,
      quality: 0.15,
    },
  }),
}))

