'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ObjectiveWeightEvolutionProps {
  trace: Array<{
    round: number
    objective_weights?: {
      runtime?: number
      memory?: number
      quality?: number
    }
  }>
  initialWeights?: {
    runtime: number
    memory: number
    quality: number
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {data.round}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.name}: <span className="font-semibold">{(entry.value * 100).toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function ObjectiveWeightEvolution({ trace, initialWeights }: ObjectiveWeightEvolutionProps) {
  const data = trace.map((t, idx) => {
    const weights = t.objective_weights || {}
    return {
      round: t.round || idx + 1,
      Runtime: weights.runtime ?? initialWeights?.runtime ?? 0.6,
      Memory: weights.memory ?? initialWeights?.memory ?? 0.25,
      Quality: weights.quality ?? initialWeights?.quality ?? 0.15,
    }
  })

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Objective Weight Evolution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="round" 
            label={{ value: 'Refinement Round', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            label={{ value: 'Weight', angle: -90, position: 'insideLeft' }}
            domain={[0, 1]}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Runtime" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Memory" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Quality" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

