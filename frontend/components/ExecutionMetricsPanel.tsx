'use client'

interface ExecutionMetricsPanelProps {
  metrics?: {
    baseline_runtime: number
    baseline_memory: number
    optimized_runtime: number
    optimized_memory: number
    runtime_improvement_pct: number
    memory_improvement_pct: number
  }
  reward?: number
}

export default function ExecutionMetricsPanel({ metrics, reward }: ExecutionMetricsPanelProps) {
  if (!metrics) {
    return (
      <div className="text-center text-gray-500 py-8">
        No execution metrics available
      </div>
    )
  }

  const runtimeImprovement = metrics.runtime_improvement_pct
  const memoryImprovement = metrics.memory_improvement_pct
  const runtimeMs = metrics.baseline_runtime * 1000
  const optimizedRuntimeMs = metrics.optimized_runtime * 1000

  return (
    <div className="space-y-6">
      {/* Baseline vs Optimized Runtime */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Runtime Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(107, 114, 128, 0.3)',
            }}
          >
            <div className="text-xs font-medium text-gray-600/80 mb-2">Baseline Runtime</div>
            <div className="text-2xl font-bold text-gray-700">{runtimeMs.toFixed(2)} ms</div>
          </div>

          <div className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <div className="text-xs font-medium text-green-600/80 mb-2">Optimized Runtime</div>
            <div className="text-2xl font-bold text-green-600">{optimizedRuntimeMs.toFixed(2)} ms</div>
          </div>
        </div>

        {/* Runtime Improvement */}
        <div className="mt-4 relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-blue-600/80 mb-1">Runtime Improvement</div>
              <div className={`text-2xl font-bold ${
                runtimeImprovement > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {runtimeImprovement > 0 ? '+' : ''}{runtimeImprovement.toFixed(1)}%
              </div>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={runtimeImprovement > 0 ? '#22c55e' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${Math.abs(runtimeImprovement) * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {Math.abs(runtimeImprovement).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Improvement */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Memory Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(107, 114, 128, 0.3)',
            }}
          >
            <div className="text-xs font-medium text-gray-600/80 mb-2">Baseline Memory</div>
            <div className="text-2xl font-bold text-gray-700">{metrics.baseline_memory.toFixed(2)} MB</div>
          </div>

          <div className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <div className="text-xs font-medium text-cyan-600/80 mb-2">Optimized Memory</div>
            <div className="text-2xl font-bold text-cyan-600">{metrics.optimized_memory.toFixed(2)} MB</div>
          </div>
        </div>

        {/* Memory Improvement */}
        <div className="mt-4 relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-cyan-600/80 mb-1">Memory Improvement</div>
              <div className={`text-2xl font-bold ${
                memoryImprovement > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {memoryImprovement > 0 ? '+' : ''}{memoryImprovement.toFixed(1)}%
              </div>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={memoryImprovement > 0 ? '#22c55e' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${Math.abs(memoryImprovement) * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {Math.abs(memoryImprovement).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Reward */}
      {reward !== undefined && (
        <div className="relative rounded-xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-purple-600/80 mb-2">Final Reward</div>
          <div className={`text-3xl font-bold ${
            reward > 0 ? 'text-green-600' : reward < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {reward >= 0 ? '+' : ''}{reward.toFixed(3)}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Multi-objective reward combining runtime, memory, and quality improvements
          </div>
        </div>
      )}
    </div>
  )
}

