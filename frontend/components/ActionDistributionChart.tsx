'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ClientOnlyChart from './ClientOnlyChart'

interface ActionDistributionChartProps {
  actionProbabilities: number[] // length 7
  selectedAction: number
  entropy?: number
  confidence?: number
}

const ACTION_LABELS = [
  'Algorithmic',           // 0
  'Memory',                // 1
  'In-place',              // 2
  'Recursion→Iteration',   // 3
  'Vectorization',         // 4
  'Alternative',           // 5
  'Stop'                   // 6
]

export default function ActionDistributionChart({
  actionProbabilities,
  selectedAction,
  entropy,
  confidence
}: ActionDistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Ensure we have valid data
  if (!actionProbabilities || actionProbabilities.length === 0) {
    return (
      <div className="relative rounded-2xl p-6 overflow-hidden text-center text-gray-400"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(139, 92, 246, 0.1)',
        }}
      >
        No action probability data available
      </div>
    )
  }

  // Ensure we have exactly 7 actions, pad with zeros if needed
  const probs = [...actionProbabilities]
  while (probs.length < 7) {
    probs.push(0)
  }

  const chartData = probs.slice(0, 7).map((prob, idx) => ({
    action: ACTION_LABELS[idx] || `Action ${idx}`,
    probability: Math.max(0, Math.min(1, prob)), // Clamp to [0, 1]
    isSelected: idx === selectedAction
  }))

  // Calculate confidence percentage
  const confidencePercent = confidence !== undefined ? (confidence * 100).toFixed(0) : '0'

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(139, 92, 246, 0.1)',
      }}
    >
      {/* Animated liquid shimmer - only render on client to avoid hydration mismatch */}
      {isMounted && (
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      <div className="relative z-10">
        {/* Policy Confidence Text - Above Chart */}
        <div className="mb-4">
          <div className="text-base font-semibold text-purple-300 mb-2">
            Confidence: {confidencePercent}%
          </div>
          {entropy !== undefined && (
            <div className="text-sm text-gray-300">
              {entropy < 0.3 && (
                <span className="text-yellow-300">Policy is highly confident (low entropy)</span>
              )}
              {entropy > 1.2 && (
                <span className="text-blue-300">Policy is exploring (high entropy)</span>
              )}
            </div>
          )}
        </div>

        {/* Vertical Bar Chart */}
        <ClientOnlyChart
          fallback={
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Loading chart...
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(139, 92, 246, 0.2)" 
              />
              <XAxis 
                dataKey="action" 
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
                domain={[0, 1]}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(4), 'Probability']}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  color: '#cbd5e1',
                }}
                labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="probability" 
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.isSelected 
                      ? 'url(#selectedGradient)' 
                      : 'url(#defaultGradient)'
                    }
                    opacity={entry.isSelected ? 1 : 0.6}
                    style={{
                      filter: entry.isSelected ? 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.8))' : 'none',
                    }}
                  />
                ))}
              </Bar>
              <defs>
                {/* Brighter gradient for selected action (vertical bars) */}
                <linearGradient id="selectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                </linearGradient>
                {/* Softer gradient for non-selected actions (vertical bars) */}
                <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      </div>
    </div>
  )
}

