'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface MetricsChartProps {
  baselineRuntime: number
  baselineMemory: number
  optimizedRuntime: number
  optimizedMemory: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
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

export default function MetricsChart({
  baselineRuntime,
  baselineMemory,
  optimizedRuntime,
  optimizedMemory,
}: MetricsChartProps) {
  // Normalize data for better visualization - use percentage of baseline
  const runtimeData = [
    {
      name: 'Baseline',
      Runtime: 100, // 100% baseline
      type: 'Runtime',
    },
    {
      name: 'Optimized',
      Runtime: (optimizedRuntime / baselineRuntime) * 100, // Percentage of baseline
      type: 'Runtime',
    },
  ]

  const memoryData = [
    {
      name: 'Baseline',
      Memory: 100, // 100% baseline
      type: 'Memory',
    },
    {
      name: 'Optimized',
      Memory: (optimizedMemory / baselineMemory) * 100, // Percentage of baseline
      type: 'Memory',
    },
  ]

  const runtimeImprovement = ((baselineRuntime - optimizedRuntime) / baselineRuntime) * 100
  const memoryImprovement = ((baselineMemory - optimizedMemory) / baselineMemory) * 100

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Performance Comparison</h3>
      </div>
      
      {/* Runtime Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Runtime Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600">Runtime</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart 
            data={runtimeData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="runtimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              opacity={0.5}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1d5db' }}
              domain={[0, 120]}
              label={{ 
                value: '% of Baseline', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#6b7280',
                style: { textAnchor: 'middle', fontSize: 10 }
              }} 
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Bar 
              dataKey="Runtime" 
              name="Runtime (% of Baseline)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={0}
            >
              {runtimeData.map((entry, index) => (
                <Cell key={`runtime-${index}`} fill="url(#runtimeGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center">
          <div className="inline-block px-3 py-1 bg-green-100/80 text-green-700 rounded-md text-xs font-medium">
            {runtimeImprovement > 0 ? '+' : ''}{runtimeImprovement.toFixed(1)}% Improvement
          </div>
        </div>
      </div>

      {/* Memory Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Memory Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs text-gray-600">Memory</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart 
            data={memoryData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              opacity={0.5}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#d1d5db' }}
              domain={[0, 120]}
              label={{ 
                value: '% of Baseline', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#6b7280',
                style: { textAnchor: 'middle', fontSize: 10 }
              }} 
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Bar 
              dataKey="Memory" 
              name="Memory (% of Baseline)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={200}
            >
              {memoryData.map((entry, index) => (
                <Cell key={`memory-${index}`} fill="url(#memoryGradient)" />
              ))}
            </Bar>
        </BarChart>
      </ResponsiveContainer>
        <div className="mt-2 text-center">
          <div className="inline-block px-3 py-1 bg-purple-100/80 text-purple-700 rounded-md text-xs font-medium">
            {memoryImprovement > 0 ? '+' : ''}{memoryImprovement.toFixed(1)}% Improvement
          </div>
        </div>
      </div>

      {/* Absolute Values Display */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Baseline Runtime</div>
          <div className="text-sm font-semibold text-gray-800">{(baselineRuntime * 1000).toFixed(2)} ms</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Optimized Runtime</div>
          <div className="text-sm font-semibold text-blue-600">{(optimizedRuntime * 1000).toFixed(2)} ms</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Baseline Memory</div>
          <div className="text-sm font-semibold text-gray-800">{baselineMemory.toFixed(2)} MB</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Optimized Memory</div>
          <div className="text-sm font-semibold text-purple-600">{optimizedMemory.toFixed(2)} MB</div>
        </div>
      </div>
    </div>
  )
}
