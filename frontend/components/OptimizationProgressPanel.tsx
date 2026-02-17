'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts'
import ClientOnlyChart from './ClientOnlyChart'

interface OptimizationProgressPanelProps {
  trace?: Array<{
    round: number
    strategy: string
    reward: number
    selected_action?: number
  }>
  maxRefinements?: number
}

export default function OptimizationProgressPanel({ trace, maxRefinements = 3 }: OptimizationProgressPanelProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No optimization progress data available
      </div>
    )
  }

  const chartData = trace.map((entry) => ({
    round: entry.round,
    strategy: entry.strategy,
    reward: entry.reward,
    selectedAction: entry.selected_action
  }))

  const stopCondition = trace.length < maxRefinements 
    ? `Stopped at round ${trace.length} (early termination)`
    : `Completed ${trace.length} refinement rounds`

  const finalReward = trace[trace.length - 1]?.reward ?? 0
  const bestRound = trace.reduce((best, current) => 
    current.reward > best.reward ? current : best
  , trace[0])

  return (
    <div className="space-y-6">
      {/* Round-by-Round Strategy */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Round-by-Round Strategy</h3>
        <div className="space-y-2">
          {trace.map((entry, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: idx === trace.length - 1 
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: idx === trace.length - 1 
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === trace.length - 1 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {entry.round}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {entry.strategy ? entry.strategy.charAt(0).toUpperCase() + entry.strategy.slice(1) : 'None'}
                  </div>
                  {entry.selected_action !== undefined && (
                    <div className="text-xs text-gray-600">Action #{entry.selected_action}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  entry.reward > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.reward >= 0 ? '+' : ''}{entry.reward.toFixed(3)}
                </div>
                <div className="text-xs text-gray-600">Reward</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Per Round Line Chart */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Reward Evolution</h3>
        <ClientOnlyChart
          fallback={
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              Loading chart...
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="round" 
                tick={{ fontSize: 10 }}
                label={{ value: 'Round', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={['auto', 'auto']}
                label={{ value: 'Reward', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'Reward']}
                labelFormatter={(label) => `Round ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reward" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      </div>

      {/* Stop Condition & Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-blue-600/80 mb-2">Stop Condition</div>
          <div className="text-sm font-semibold text-blue-600">{stopCondition}</div>
        </div>

        <div className="relative rounded-xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          <div className="text-xs font-medium text-purple-600/80 mb-2">Best Round</div>
          <div className="text-sm font-semibold text-purple-600">
            Round {bestRound.round} ({bestRound.reward.toFixed(3)})
          </div>
        </div>
      </div>
    </div>
  )
}

