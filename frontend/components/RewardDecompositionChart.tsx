'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface RewardDecompositionChartProps {
  trace: Array<{
    round: number
    reward?: number
    components?: {
      runtime_component?: number
      memory_component?: number
      quality_component?: number
      test_bonus?: number
      length_penalty?: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {data.round}</p>
        <p className="text-sm text-gray-600 mb-3">
          Total Reward: <span className="font-semibold text-blue-600">{data.totalReward?.toFixed(3) || 'N/A'}</span>
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.name}: <span className="font-semibold">{entry.value?.toFixed(3) || '0.000'}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RewardDecompositionChart({ trace }: RewardDecompositionChartProps) {
  const data = trace.map((t, idx) => {
    const components = t.components || {}
    return {
      round: t.round || idx + 1,
      'Runtime': components.runtime_component ?? 0,
      'Memory': components.memory_component ?? 0,
      'Quality': components.quality_component ?? 0,
      'Test Bonus': components.test_bonus ?? 0,
      'Penalty': components.length_penalty ?? 0,
      totalReward: t.reward,
    }
  })

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Reward Decomposition by Component</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="round" 
            label={{ value: 'Refinement Round', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            label={{ value: 'Reward Component', angle: -90, position: 'insideLeft' }}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Runtime" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Memory" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Quality" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Test Bonus" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Penalty" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

