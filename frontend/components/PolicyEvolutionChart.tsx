'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ClientOnlyChart from './ClientOnlyChart'

interface PolicyEvolutionChartProps {
  trace: Array<{
    round: number
    reward: number
    entropy: number
  }>
}

export default function PolicyEvolutionChart({ trace }: PolicyEvolutionChartProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="relative rounded-2xl p-6 overflow-hidden text-center text-gray-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        No policy evolution data available
      </div>
    )
  }

  const chartData = trace.map((entry) => ({
    round: entry.round,
    reward: entry.reward,
    entropy: entry.entropy
  }))

  // Determine entropy trend
  const entropyTrend = trace.length > 1 
    ? trace[trace.length - 1].entropy - trace[0].entropy
    : 0

  const entropyMessage = entropyTrend < 0
    ? 'Policy is converging during refinement.'
    : entropyTrend > 0
    ? 'Policy is exploring new strategies.'
    : 'Policy entropy is stable.'

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Animated liquid shimmer */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />

      <div className="relative z-10">
        <ClientOnlyChart
          fallback={
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Loading chart...
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(139, 92, 246, 0.1)" 
              />
              <XAxis 
                dataKey="round" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{ value: 'Refinement Round', position: 'insideBottom', offset: -5, style: { fill: '#6b7280', fontSize: 12 } }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#22c55e' }}
                label={{ value: 'Reward', angle: -90, position: 'insideLeft', style: { fill: '#22c55e', fontSize: 12 } }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 11, fill: '#3b82f6' }}
                label={{ value: 'Entropy', angle: 90, position: 'insideRight', style: { fill: '#3b82f6', fontSize: 12 } }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
                formatter={(value: number, name: string) => {
                  if (name === 'reward') {
                    return [value.toFixed(4), 'Reward']
                  }
                  if (name === 'entropy') {
                    return [value.toFixed(4), 'Entropy']
                  }
                  return [value, name]
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reward"
                stroke="url(#rewardGradient)"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
                name="Reward"
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="entropy"
                stroke="url(#entropyGradient)"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Entropy"
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <defs>
                <linearGradient id="rewardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="entropyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </ClientOnlyChart>

        {/* Dynamic message */}
        <div className="mt-4 text-center">
          <div className="text-xs font-medium text-gray-600">
            {entropyMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

