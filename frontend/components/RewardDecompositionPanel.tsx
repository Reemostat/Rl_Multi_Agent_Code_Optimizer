'use client'

interface RewardDecompositionPanelProps {
  reward: number
  components?: {
    runtime_component?: number
    memory_component?: number
    quality_component?: number
    test_bonus?: number
    length_penalty?: number
    safety_penalty?: number
    stability_variance?: number
  }
  trace?: Array<{
    round: number
    components?: {
      runtime_component?: number
      memory_component?: number
      quality_component?: number
      test_bonus?: number
      length_penalty?: number
      safety_penalty?: number
      stability_variance?: number
    }
  }>
}

export default function RewardDecompositionPanel({ reward, components, trace }: RewardDecompositionPanelProps) {
  // Get latest round components or use provided components
  const latestComponents = trace && trace.length > 0 
    ? trace[trace.length - 1]?.components || components
    : components

  const runtimeComp = latestComponents?.runtime_component ?? 0
  const memoryComp = latestComponents?.memory_component ?? 0
  const qualityComp = latestComponents?.quality_component ?? 0
  const testBonus = latestComponents?.test_bonus ?? 0
  const lengthPenalty = latestComponents?.length_penalty ?? 0
  const safetyPenalty = latestComponents?.safety_penalty ?? 0
  const stabilityVariance = latestComponents?.stability_variance ?? 0

  const total = runtimeComp + memoryComp + qualityComp + testBonus + lengthPenalty + safetyPenalty - Math.abs(stabilityVariance)

  return (
    <div className="relative rounded-xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Reward Decomposition</h3>
      
      <div className="space-y-3">
        {/* Runtime Component */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-700">Runtime Contribution</span>
          </div>
          <span className={`text-sm font-semibold ${runtimeComp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {runtimeComp >= 0 ? '+' : ''}{runtimeComp.toFixed(3)}
          </span>
        </div>

        {/* Memory Component */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-sm text-gray-700">Memory Contribution</span>
          </div>
          <span className={`text-sm font-semibold ${memoryComp >= 0 ? 'text-cyan-600' : 'text-red-600'}`}>
            {memoryComp >= 0 ? '+' : ''}{memoryComp.toFixed(3)}
          </span>
        </div>

        {/* Quality Component */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-700">Quality Contribution</span>
          </div>
          <span className={`text-sm font-semibold ${qualityComp >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {qualityComp >= 0 ? '+' : ''}{qualityComp.toFixed(3)}
          </span>
        </div>

        {/* Test Bonus */}
        {testBonus > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-700">Test Pass Bonus</span>
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              +{testBonus.toFixed(3)}
            </span>
          </div>
        )}

        {/* Length/Complexity Penalty */}
        {lengthPenalty < 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-700">Length/Complexity Penalty</span>
            </div>
            <span className="text-sm font-semibold text-red-600">
              {lengthPenalty.toFixed(3)}
            </span>
          </div>
        )}

        {/* Safety Penalty */}
        {safetyPenalty < 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-700">Safety Penalty</span>
            </div>
            <span className="text-sm font-semibold text-orange-600">
              {safetyPenalty.toFixed(3)}
            </span>
          </div>
        )}

        {/* Stability Variance */}
        {stabilityVariance > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-gray-700">Stability Variance</span>
            </div>
            <span className="text-sm font-semibold text-amber-600">
              -{stabilityVariance.toFixed(3)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="pt-3 mt-3 border-t border-gray-200/20">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">Total Reward</span>
            <span className={`text-lg font-bold ${reward >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {reward >= 0 ? '+' : ''}{reward.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Breakdown Bar */}
      <div className="mt-4 pt-4 border-t border-gray-200/20">
        <div className="text-xs text-gray-600 mb-2">Component Breakdown</div>
        <div className="flex h-4 rounded-full overflow-hidden">
          {runtimeComp > 0 && (
            <div 
              className="bg-green-500"
              style={{ width: `${(Math.abs(runtimeComp) / Math.abs(total || 1)) * 100}%` }}
              title={`Runtime: ${runtimeComp.toFixed(3)}`}
            />
          )}
          {memoryComp > 0 && (
            <div 
              className="bg-cyan-500"
              style={{ width: `${(Math.abs(memoryComp) / Math.abs(total || 1)) * 100}%` }}
              title={`Memory: ${memoryComp.toFixed(3)}`}
            />
          )}
          {qualityComp > 0 && (
            <div 
              className="bg-purple-500"
              style={{ width: `${(Math.abs(qualityComp) / Math.abs(total || 1)) * 100}%` }}
              title={`Quality: ${qualityComp.toFixed(3)}`}
            />
          )}
          {testBonus > 0 && (
            <div 
              className="bg-emerald-500"
              style={{ width: `${(Math.abs(testBonus) / Math.abs(total || 1)) * 100}%` }}
              title={`Test Bonus: ${testBonus.toFixed(3)}`}
            />
          )}
          {lengthPenalty < 0 && (
            <div 
              className="bg-red-500"
              style={{ width: `${(Math.abs(lengthPenalty) / Math.abs(total || 1)) * 100}%` }}
              title={`Length Penalty: ${lengthPenalty.toFixed(3)}`}
            />
          )}
          {safetyPenalty < 0 && (
            <div 
              className="bg-orange-500"
              style={{ width: `${(Math.abs(safetyPenalty) / Math.abs(total || 1)) * 100}%` }}
              title={`Safety Penalty: ${safetyPenalty.toFixed(3)}`}
            />
          )}
          {stabilityVariance > 0 && (
            <div 
              className="bg-amber-500"
              style={{ width: `${(Math.abs(stabilityVariance) / Math.abs(total || 1)) * 100}%` }}
              title={`Stability Variance: ${stabilityVariance.toFixed(3)}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

