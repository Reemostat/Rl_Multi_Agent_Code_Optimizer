'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

interface BaselineComparisonChartProps {
  baseline: {
    runtime: number
    memory: number
    complexity?: number
    lines?: number
  }
  optimized: {
    runtime: number
    memory: number
    complexity?: number
    lines?: number
  }
}

export default function BaselineComparisonChart({ baseline, optimized }: BaselineComparisonChartProps) {
  // Normalize values for radar chart (0-100 scale)
  const maxRuntime = Math.max(baseline.runtime, optimized.runtime) || 1
  const maxMemory = Math.max(baseline.memory, optimized.memory) || 1
  const maxComplexity = Math.max(baseline.complexity || 10, optimized.complexity || 10)
  const maxLines = Math.max(baseline.lines || 100, optimized.lines || 100)

  const data = [
    {
      metric: 'Runtime',
      baseline: (baseline.runtime / maxRuntime) * 100,
      optimized: (optimized.runtime / maxRuntime) * 100,
      fullMark: 100,
    },
    {
      metric: 'Memory',
      baseline: (baseline.memory / maxMemory) * 100,
      optimized: (optimized.memory / maxMemory) * 100,
      fullMark: 100,
    },
    {
      metric: 'Complexity',
      baseline: ((baseline.complexity || 10) / maxComplexity) * 100,
      optimized: ((optimized.complexity || 10) / maxComplexity) * 100,
      fullMark: 100,
    },
    {
      metric: 'Lines',
      baseline: ((baseline.lines || 100) / maxLines) * 100,
      optimized: ((optimized.lines || 100) / maxLines) * 100,
      fullMark: 100,
    },
  ]

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Baseline vs Optimized Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(0,0,0,0.1)" />
          <PolarAngleAxis dataKey="metric" stroke="#666" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
          <Radar
            name="Baseline"
            dataKey="baseline"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
          <Radar
            name="Optimized"
            dataKey="optimized"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

