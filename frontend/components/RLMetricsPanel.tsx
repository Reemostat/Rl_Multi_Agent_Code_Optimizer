'use client'

interface RLMetricsPanelProps {
  rlMetaAction?: {
    selected_action?: number
    action_probabilities?: number[]
    entropy?: number
    confidence?: number
    refinement_depth?: number
    runtime_weight?: number
    memory_weight?: number
    quality_weight?: number
    strategy_mask?: number[]
  }
  trace?: Array<{
    round: number
    entropy?: number
    confidence?: number
  }>
}

const ACTION_LABELS = [
  'Algorithmic',
  'Memory',
  'In-place',
  'Recursion→Iter',
  'Vectorization',
  'Alternative',
  'Stop'
]

export default function RLMetricsPanel({ rlMetaAction, trace }: RLMetricsPanelProps) {
  if (!rlMetaAction) return null

  const entropy = rlMetaAction.entropy ?? 0
  const confidence = rlMetaAction.confidence ?? 0
  const selectedAction = rlMetaAction.selected_action ?? 0
  const actionProbs = rlMetaAction.action_probabilities || []
  
  // Determine exploration state with more specific messaging
  const isExploring = entropy > 1.5
  const isConverging = entropy < 1.0
  const entropyOverRounds = trace?.map(t => ({
    round: t.round || 0,
    entropy: t.entropy ?? entropy
  })) || []
  
  // Determine which strategy the policy is converging toward
  const getConvergenceStrategy = () => {
    if (!rlMetaAction) return "optimal strategy"
    const maxWeight = Math.max(
      rlMetaAction.runtime_weight ?? 0,
      rlMetaAction.memory_weight ?? 0,
      rlMetaAction.quality_weight ?? 0
    )
    if (maxWeight === (rlMetaAction.runtime_weight ?? 0)) return "runtime-focused optimization"
    if (maxWeight === (rlMetaAction.memory_weight ?? 0)) return "memory-focused optimization"
    return "quality-focused optimization"
  }
  
  const explorationState = isExploring 
    ? "Policy is exploring diverse strategies" 
    : isConverging 
    ? `Policy is converging toward ${getConvergenceStrategy()}`
    : "Policy is balancing exploration and exploitation"

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Confidence Score */}
        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-purple-600/80 mb-2">Policy Confidence</div>
          <div className="text-2xl font-bold text-purple-600">{(confidence * 100).toFixed(1)}%</div>
          <div className="mt-2 h-2 bg-purple-200/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Entropy */}
        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-cyan-600/80 mb-2">Entropy</div>
          <div className="text-2xl font-bold text-cyan-600">{entropy.toFixed(3)}</div>
          <div className="text-xs text-gray-600 mt-2">
            {isExploring ? '🔍 Exploring' : isConverging ? '🎯 Converging' : '⚖️ Balanced'}
          </div>
        </div>

        {/* Selected Action */}
        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-green-600/80 mb-2">Selected Action</div>
          <div className="text-lg font-bold text-green-600">{ACTION_LABELS[selectedAction] || `Action ${selectedAction}`}</div>
          <div className="text-xs text-gray-600 mt-1">Action #{selectedAction}</div>
        </div>

        {/* Refinement Depth */}
        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-blue-600/80 mb-2">Refinement Depth</div>
          <div className="text-2xl font-bold text-blue-600">{rlMetaAction.refinement_depth ?? 3}</div>
          <div className="text-xs text-gray-600 mt-1">Rounds</div>
        </div>
      </div>

      {/* Action Probabilities Bar Chart */}
      <div className="relative rounded-xl p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Action Probability Distribution</h3>
        <div className="space-y-2">
          {actionProbs.map((prob, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-600 font-medium">
                {ACTION_LABELS[idx] || `Action ${idx}`}
              </div>
              <div className="flex-1 h-6 bg-gray-200/30 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === selectedAction 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{ width: `${prob * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-semibold text-gray-700">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              {idx === selectedAction && (
                <span className="text-xs font-bold text-green-600">✓ Selected</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Entropy Over Rounds Line Graph */}
      {entropyOverRounds.length > 0 && (
        <div className="relative rounded-xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Entropy Evolution Over Rounds</h3>
          <div className="space-y-2">
            {entropyOverRounds.map((entry, idx) => {
              const maxEntropy = 2.5 // Max theoretical entropy for 7 actions
              const percentage = (entry.entropy / maxEntropy) * 100
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-600 font-medium">Round {entry.round}</div>
                  <div className="flex-1 h-4 bg-gray-200/30 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs font-semibold text-cyan-600 text-right">
                    {entry.entropy.toFixed(3)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200/20">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Current Entropy:</span> {entropy.toFixed(3)} 
              {isExploring && ' (High - Exploring)'}
              {isConverging && ' (Low - Exploiting)'}
              {!isExploring && !isConverging && ' (Moderate - Balanced)'}
            </div>
          </div>
        </div>
      )}

      {/* Objective Weights & Strategy Mask */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Objective Weights */}
        <div className="relative rounded-xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Objective Weights (RL-Chosen)</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Runtime</span>
                <span className="text-xs font-semibold text-green-600">
                  {((rlMetaAction.runtime_weight ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${(rlMetaAction.runtime_weight ?? 0) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Memory</span>
                <span className="text-xs font-semibold text-cyan-600">
                  {((rlMetaAction.memory_weight ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${(rlMetaAction.memory_weight ?? 0) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Quality</span>
                <span className="text-xs font-semibold text-purple-600">
                  {((rlMetaAction.quality_weight ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${(rlMetaAction.quality_weight ?? 0) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Mask & Exploration State */}
        <div className="relative rounded-xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Strategy Mask & Exploration</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-2">Active Agents</div>
              <div className="flex gap-2">
                {rlMetaAction.strategy_mask?.map((mask, idx) => {
                  const labels = ['Runtime', 'Memory', 'Readability']
                  return (
                    <div
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        mask === 1
                          ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                          : 'bg-gray-200/20 text-gray-500 border border-gray-300/30'
                      }`}
                    >
                      {labels[idx]} {mask === 1 ? '✓' : '✗'}
                    </div>
                  )
                }) || [0, 0, 0].map((_, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200/20 text-gray-500">
                    Agent {idx + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/20">
              <div className="text-xs text-gray-600 mb-1">Exploration State</div>
              <div className={`text-sm font-medium ${
                isExploring ? 'text-cyan-600' : isConverging ? 'text-green-600' : 'text-blue-600'
              }`}>
                {explorationState}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Entropy {entropy > 1.5 ? 'high' : entropy < 1.0 ? 'low' : 'moderate'} = {isExploring ? 'exploring' : isConverging ? 'exploiting' : 'balanced'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

