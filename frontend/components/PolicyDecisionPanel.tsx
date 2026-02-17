'use client'

interface PolicyDecisionPanelProps {
  rlMetaAction?: {
    selected_action?: number
    action_probabilities?: number[]
    entropy?: number
    confidence?: number
    strategy_mask?: number[]
  }
}

const ACTION_LABELS = [
  'Algorithmic Optimization',
  'Memory Optimization',
  'In-place Refactor',
  'Recursion→Iteration',
  'Vectorization',
  'Alternative Solution',
  'Stop'
]

export default function PolicyDecisionPanel({ rlMetaAction }: PolicyDecisionPanelProps) {
  if (!rlMetaAction) {
    return (
      <div className="text-center text-gray-500 py-8">
        No policy decision data available
      </div>
    )
  }

  const selectedAction = rlMetaAction.selected_action ?? 0
  const entropy = rlMetaAction.entropy ?? 0
  const confidence = rlMetaAction.confidence ?? 0
  const strategyMask = rlMetaAction.strategy_mask || [0, 0, 0]

  // Determine confidence color and status
  const confidencePercent = confidence * 100
  const confidenceColor = confidencePercent > 90 ? 'yellow' : confidencePercent >= 70 ? 'green' : 'blue'
  const confidenceStatus = confidencePercent > 90 
    ? 'High confidence, may be overconfident' 
    : confidencePercent >= 70 
    ? 'Good confidence' 
    : 'Moderate confidence, exploring'

  // Determine entropy health
  const entropyHealth = entropy > 1.5 ? 'healthy' : entropy < 1.0 ? 'low' : 'moderate'

  return (
    <div className="space-y-6">
      {/* 1. Confidence Score Display */}
      <div className="relative rounded-xl p-6 overflow-hidden"
          style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${
            confidenceColor === 'yellow' ? 'rgba(234, 179, 8, 0.3)' :
            confidenceColor === 'green' ? 'rgba(34, 197, 94, 0.3)' :
            'rgba(59, 130, 246, 0.3)'
          }`,
          }}
        >
        <div className="text-sm font-semibold text-gray-800 mb-4">🎯 Confidence Score</div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-4xl font-bold" style={{
            color: confidenceColor === 'yellow' ? '#ca8a04' :
                   confidenceColor === 'green' ? '#16a34a' :
                   '#2563eb'
          }}>
            {confidencePercent.toFixed(1)}%
          </span>
          </div>
        <div className="w-full bg-gray-200/50 rounded-full h-4 mb-3 overflow-hidden">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              confidenceColor === 'yellow' ? 'bg-yellow-500' :
              confidenceColor === 'green' ? 'bg-green-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <p className={`text-sm ${
          confidenceColor === 'yellow' ? 'text-yellow-700' :
          confidenceColor === 'green' ? 'text-green-700' :
          'text-blue-700'
        }`}>
          {confidenceColor === 'yellow' && '🟡 '}
          {confidenceColor === 'green' && '🟢 '}
          {confidenceColor === 'blue' && '🔵 '}
          {confidenceStatus}
        </p>
        </div>

      {/* 2. Policy Status Summary */}
      <div className="relative rounded-xl p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="text-sm font-semibold text-gray-800 mb-4">📋 Policy Status Summary</div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Entropy Status:</span>
            <span className={`text-sm font-bold ${
              entropyHealth === 'healthy' ? 'text-green-600' :
              entropyHealth === 'low' ? 'text-yellow-600' :
              'text-blue-600'
            }`}>
              {entropyHealth === 'healthy' ? '🟢 Healthy' :
               entropyHealth === 'low' ? '🟡 Low' :
               '🔵 Moderate'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Selected Strategy:</span>
            <span className="text-sm font-bold text-purple-600">
              Action {selectedAction}: {ACTION_LABELS[selectedAction]}
            </span>
          </div>
          
          <div>
            <span className="text-sm text-gray-700">Strategy Mask:</span>
            <div className="mt-1 flex gap-2">
              {strategyMask.map((mask, idx) => (
                <span 
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    mask === 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {idx === 0 && 'Runtime'}
                  {idx === 1 && 'Memory'}
                  {idx === 2 && 'Quality'}
                  {mask === 1 ? ' ✓' : ' ✗'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

