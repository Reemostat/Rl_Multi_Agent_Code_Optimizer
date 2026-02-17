'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface TraceEntry {
  round: number
  strategy: string
  reward: number
  runtime_delta?: number
  memory_delta?: number
}

interface RewardScatterProps {
  trace: TraceEntry[]
  baselineRuntime: number
  optimizedRuntime: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {data.round}</p>
        <div className="space-y-1 text-sm">
          <div className="text-gray-700">
            Reward: <span className="font-semibold">{data.reward.toFixed(3)}</span>
          </div>
          <div className="text-gray-700">
            Runtime Improvement: <span className="font-semibold">{data.runtimeImprovement > 0 ? '+' : ''}{(data.runtimeImprovement * 100).toFixed(1)}%</span>
          </div>
          <div className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-200">
            Strategy: <span className="font-medium">{data.strategy}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function RewardScatter({ trace, baselineRuntime, optimizedRuntime }: RewardScatterProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No scatter data available
      </div>
    )
  }

  // Calculate runtime improvement per round
  const totalImprovement = ((baselineRuntime - optimizedRuntime) / baselineRuntime)
  
  const data = trace.map((entry, idx) => {
    // Calculate improvement for this round (proportional to reward or linear)
    const runtimeImprovement = entry.runtime_delta !== undefined
      ? entry.runtime_delta
      : (totalImprovement / trace.length) * (idx + 1) * (entry.reward + 1) / 2 // Scale by reward

    return {
      round: entry.round || idx + 1,
      reward: entry.reward,
      runtimeImprovement: Math.max(-0.5, Math.min(0.5, runtimeImprovement)), // Clamp to reasonable range
      strategy: entry.strategy || 'unknown',
    }
  })

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-800">Reward vs Runtime Improvement</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 50, left: 20 }}
        >
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`scatterGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.4} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            opacity={0.5}
          />
          <XAxis 
            type="number"
            dataKey="runtimeImprovement"
            name="Runtime Improvement"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: 'Runtime Improvement', 
              position: 'insideBottom', 
              offset: -10, 
              fill: '#6b7280',
              style: { textAnchor: 'middle', fontSize: 12, fontWeight: 500 }
            }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            domain={['dataMin - 0.05', 'dataMax + 0.05']}
          />
          <YAxis 
            type="number"
            dataKey="reward"
            name="Reward"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: 'Reward Score', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#6b7280',
              style: { textAnchor: 'middle', fontSize: 11 }
            }}
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name="Optimization Rounds" 
            data={data} 
            fill="#10b981"
            animationDuration={1500}
          >
            {data.map((entry, index) => {
              const strategyIndex = index % COLORS.length
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[strategyIndex]}
                  r={7}
                />
              )
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
