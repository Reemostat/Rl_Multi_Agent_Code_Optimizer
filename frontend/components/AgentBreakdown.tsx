'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface TraceEntry {
  strategy: string
  reward: number
}

interface AgentBreakdownProps {
  trace: TraceEntry[]
}

const COLORS = [
  { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
  { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
        <p className="text-sm text-gray-700">
          Contributions: <span className="font-semibold">{data.value}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Percentage: <span className="font-semibold">{(data.payload.percent * 100).toFixed(1)}%</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't show labels for very small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
      className="drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AgentBreakdown({ trace }: AgentBreakdownProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No agent activity data available
      </div>
    )
  }

  // Count contributions by agent
  const agentContributions: Record<string, number> = {}
  trace.forEach((entry) => {
    const agent = entry.strategy || 'unknown'
    agentContributions[agent] = (agentContributions[agent] || 0) + 1
  })

  const data = Object.entries(agentContributions)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
    value,
  }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-800">Agent Contributions</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <defs>
            {COLORS.map((colorObj, index) => (
              <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colorObj.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colorObj.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#colorGradient${index % COLORS.length})`}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#374151', fontSize: '12px' }}
            iconType="circle"
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }}>
                {value} ({((entry.payload.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
