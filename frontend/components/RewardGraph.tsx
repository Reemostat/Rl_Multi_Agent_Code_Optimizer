'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface TraceEntry {
  round: number
  strategy: string
  reward: number
  runtime_delta: number
  memory_delta: number
  objective_weights: {
    runtime: number
    memory: number
    quality: number
  }
  candidates_evaluated: number
}

interface RewardGraphProps {
  trace: TraceEntry[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.name}: <span className="font-semibold">{entry.value.toFixed(3)}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RewardGraph({ trace }: RewardGraphProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No optimization trace available
      </div>
    )
  }

  const data = trace.map((entry, idx) => ({
    round: entry.round || idx + 1,
    reward: entry.reward,
    runtimeDelta: entry.runtime_delta,
    memoryDelta: entry.memory_delta,
  }))

  const maxReward = Math.max(...data.map(d => d.reward))
  const minReward = Math.min(...data.map(d => d.reward))
  const improvement = ((maxReward - minReward) / minReward) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Reward Evolution</h3>
        <div className="text-xs text-gray-600">
          Improvement: <span className="font-semibold text-green-600">+{improvement.toFixed(1)}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            opacity={0.5}
            vertical={false}
          />
          <XAxis 
            dataKey="round" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: 'Refinement Round', 
              position: 'insideBottom', 
              offset: -10, 
              fill: '#6b7280',
              style: { textAnchor: 'middle', fontSize: 12, fontWeight: 500 }
            }}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: 'Reward', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#6b7280',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="reward"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#rewardGradient)"
            dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
            animationDuration={1500}
            animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
