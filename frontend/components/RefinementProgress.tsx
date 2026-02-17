'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TraceEntry {
  round: number
  strategy: string
  reward: number
  runtime_delta?: number
  memory_delta?: number
}

interface RefinementProgressProps {
  trace: TraceEntry[]
  baselineRuntime: number
  baselineMemory: number
  optimizedRuntime: number
  optimizedMemory: number
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
              {entry.name}: <span className="font-semibold">{entry.value > 0 ? '+' : ''}{entry.value.toFixed(2)}%</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RefinementProgress({ trace, baselineRuntime, baselineMemory, optimizedRuntime, optimizedMemory }: RefinementProgressProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No refinement data available
      </div>
    )
  }

  // Calculate improvement per round (linear interpolation if deltas not available)
  const totalRuntimeImprovement = ((baselineRuntime - optimizedRuntime) / baselineRuntime) * 100
  const totalMemoryImprovement = ((baselineMemory - optimizedMemory) / baselineMemory) * 100

  const data = trace.map((entry, idx) => {
    // If deltas are available, use them; otherwise interpolate
    const runtimeDelta = entry.runtime_delta !== undefined 
      ? entry.runtime_delta * 100 
      : (totalRuntimeImprovement / trace.length) * (idx + 1)
    
    const memoryDelta = entry.memory_delta !== undefined
      ? entry.memory_delta * 100
      : (totalMemoryImprovement / trace.length) * (idx + 1)

    return {
      round: entry.round || idx + 1,
      runtimeDelta: Math.max(0, runtimeDelta), // Ensure non-negative for visualization
      memoryDelta: Math.max(0, memoryDelta),
    }
  })

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-800">Refinement Progress</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
        >
          <defs>
            <linearGradient id="runtimeDeltaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="memoryDeltaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
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
              value: 'Improvement (%)', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#6b7280',
              style: { textAnchor: 'middle', fontSize: 11 }
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="runtimeDelta"
            stackId="1"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#runtimeDeltaGradient)"
            name="Runtime Improvement"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="memoryDelta"
            stackId="1"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#memoryDeltaGradient)"
            name="Memory Improvement"
            animationDuration={1500}
            animationBegin={200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
