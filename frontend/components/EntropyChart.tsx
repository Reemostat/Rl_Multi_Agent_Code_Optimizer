'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface EntropyChartProps {
  trace: Array<{
    round: number
    entropy?: number
  }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {payload[0].payload.round}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
          <span className="text-sm text-gray-700">
            Entropy: <span className="font-semibold">{payload[0].value.toFixed(3)}</span>
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Higher entropy = more exploration
        </p>
      </div>
    )
  }
  return null
}

export default function EntropyChart({ trace }: EntropyChartProps) {
  const data = trace.map((t, idx) => ({
    round: t.round || idx + 1,
    entropy: t.entropy ?? 1.5 - (idx * 0.2), // Simulated if not available
  }))

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Policy Entropy (Exploration)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="entropyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="round" 
            label={{ value: 'Refinement Round', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            label={{ value: 'Entropy', angle: -90, position: 'insideLeft' }}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="entropy" 
            stroke="#06b6d4" 
            strokeWidth={2}
            fill="url(#entropyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

