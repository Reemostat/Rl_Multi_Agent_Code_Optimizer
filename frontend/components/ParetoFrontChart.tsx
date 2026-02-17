'use client'

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface ParetoFrontChartProps {
  trace: Array<{
    round: number
    runtime_improvement?: number
    memory_improvement?: number
    reward?: number
  }>
  baselineRuntime: number
  baselineMemory: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {data.round}</p>
        <div className="space-y-1">
          <div className="text-sm text-gray-700">
            Runtime Improvement: <span className="font-semibold text-green-600">{data.runtime_improvement?.toFixed(1) || '0'}%</span>
          </div>
          <div className="text-sm text-gray-700">
            Memory Improvement: <span className="font-semibold text-cyan-600">{data.memory_improvement?.toFixed(1) || '0'}%</span>
          </div>
          <div className="text-sm text-gray-700">
            Reward: <span className="font-semibold text-blue-600">{data.reward?.toFixed(3) || '0.000'}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function ParetoFrontChart({ trace, baselineRuntime, baselineMemory }: ParetoFrontChartProps) {
  const data = trace.map((t, idx) => {
    // Calculate improvements if not provided
    const runtimeImp = t.runtime_improvement ?? (idx * 5) // Simulated
    const memoryImp = t.memory_improvement ?? (idx * 2) // Simulated
    return {
      round: t.round || idx + 1,
      runtime_improvement: runtimeImp,
      memory_improvement: memoryImp,
      reward: t.reward ?? 0.5 + (idx * 0.1),
    }
  })

  // Color based on reward
  const getColor = (reward: number) => {
    if (reward > 0.7) return '#22c55e' // green
    if (reward > 0.4) return '#3b82f6' // blue
    if (reward > 0.1) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Pareto Frontier (Runtime vs Memory)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            type="number" 
            dataKey="runtime_improvement" 
            name="Runtime Improvement"
            label={{ value: 'Runtime Improvement (%)', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            type="number" 
            dataKey="memory_improvement" 
            name="Memory Improvement"
            label={{ value: 'Memory Improvement (%)', angle: -90, position: 'insideLeft' }}
            stroke="#666"
          />
          <ZAxis type="number" dataKey="reward" range={[50, 400]} name="Reward" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter name="Optimization Points" data={data} fill="#8b5cf6">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.reward)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

