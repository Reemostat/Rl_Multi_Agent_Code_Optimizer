'use client'

import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface RadarChartProps {
  baselineRuntime: number
  baselineMemory: number
  optimizedRuntime: number
  optimizedMemory: number
  baselineQuality?: number
  optimizedQuality?: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.category}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.name}: <span className="font-semibold">{entry.value.toFixed(2)}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RadarChart({
  baselineRuntime,
  baselineMemory,
  optimizedRuntime,
  optimizedMemory,
  baselineQuality = 0.5,
  optimizedQuality = 0.5,
}: RadarChartProps) {
  // Normalize values to 0-100 scale for radar chart
  // Use max values as reference for normalization
  const maxRuntime = Math.max(baselineRuntime, optimizedRuntime) || 1
  const maxMemory = Math.max(baselineMemory, optimizedMemory) || 1

  const data = [
    {
      category: 'Runtime',
      Baseline: (1 - baselineRuntime / maxRuntime) * 100, // Invert so higher is better
      Optimized: (1 - optimizedRuntime / maxRuntime) * 100,
    },
    {
      category: 'Memory',
      Baseline: (1 - baselineMemory / maxMemory) * 100, // Invert so higher is better
      Optimized: (1 - optimizedMemory / maxMemory) * 100,
    },
    {
      category: 'Quality',
      Baseline: baselineQuality * 100,
      Optimized: optimizedQuality * 100,
    },
    {
      category: 'Efficiency',
      Baseline: ((1 - baselineRuntime / maxRuntime) + (1 - baselineMemory / maxMemory) + baselineQuality) / 3 * 100,
      Optimized: ((1 - optimizedRuntime / maxRuntime) + (1 - optimizedMemory / maxMemory) + optimizedQuality) / 3 * 100,
    },
  ]

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-800">Performance Radar</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b7280" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#6b7280" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <PolarGrid 
            stroke="#e5e7eb" 
            opacity={0.5}
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickCount={6}
          />
          <Radar
            name="Baseline"
            dataKey="Baseline"
            stroke="#6b7280"
            fill="url(#baselineGradient)"
            fillOpacity={0.6}
            strokeWidth={2}
            animationDuration={1500}
          />
          <Radar
            name="Optimized"
            dataKey="Optimized"
            stroke="#3b82f6"
            fill="url(#optimizedGradient)"
            fillOpacity={0.6}
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={200}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#374151', fontSize: '12px' }}
            iconType="circle"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-gray-600">Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Optimized</span>
        </div>
      </div>
    </div>
  )
}

