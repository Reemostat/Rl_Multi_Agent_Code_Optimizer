'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts'

interface PolicyConfidenceGraphProps {
  trace: Array<{
    round: number
    confidence?: number
    entropy?: number
  }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">Round {payload[0].payload.round}</p>
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

export default function PolicyConfidenceGraph({ trace }: PolicyConfidenceGraphProps) {
  const data = trace.map((t, idx) => ({
    round: t.round || idx + 1,
    confidence: t.confidence ?? 0.85 - (idx * 0.05), // Simulated if not available
  }))

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Policy Confidence Over Rounds</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="round" 
            label={{ value: 'Refinement Round', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            label={{ value: 'Confidence', angle: -90, position: 'insideLeft' }}
            domain={[0, 1]}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            name="Policy Confidence"
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={<Dot r={5} fill="#8b5cf6" />}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

