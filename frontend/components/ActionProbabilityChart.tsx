'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface ActionProbabilityChartProps {
  actionProbabilities: number[]
  selectedAction?: number
}

const ACTION_LABELS = [
  'Algorithmic',
  'Memory',
  'In-place',
  'Recursion→Iter',
  'Vectorization',
  'Alternative',
  'Stop'
]

const COLORS = [
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f472b6', // pink
  '#f97316', // orange
  '#ef4444', // red
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="text-sm text-gray-700">
            Probability: <span className="font-semibold">{(data.probability * 100).toFixed(1)}%</span>
          </span>
        </div>
        {data.selected && (
          <p className="text-xs text-green-600 mt-2 font-medium">✓ Selected Action</p>
        )}
      </div>
    )
  }
  return null
}

export default function ActionProbabilityChart({ 
  actionProbabilities, 
  selectedAction 
}: ActionProbabilityChartProps) {
  const data = actionProbabilities.map((prob, idx) => ({
    name: ACTION_LABELS[idx] || `Action ${idx}`,
    probability: prob,
    selected: idx === selectedAction,
  }))

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Action Probability Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            type="number" 
            domain={[0, 1]}
            label={{ value: 'Probability', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="probability" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.selected ? COLORS[index] : COLORS[index]}
                opacity={entry.selected ? 1 : 0.6}
                stroke={entry.selected ? '#fff' : 'none'}
                strokeWidth={entry.selected ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

