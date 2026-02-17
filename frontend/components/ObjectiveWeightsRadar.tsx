'use client'

import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import ClientOnlyChart from './ClientOnlyChart'

interface ObjectiveWeightsRadarProps {
  runtimeWeight: number
  memoryWeight: number
  qualityWeight: number
}

export default function ObjectiveWeightsRadar({
  runtimeWeight,
  memoryWeight,
  qualityWeight
}: ObjectiveWeightsRadarProps) {
  const data = [
    {
      subject: 'Runtime',
      value: Math.min(runtimeWeight, 1.0),
      fullMark: 1.0
    },
    {
      subject: 'Memory',
      value: Math.min(memoryWeight, 1.0),
      fullMark: 1.0
    },
    {
      subject: 'Quality',
      value: Math.min(qualityWeight, 1.0),
      fullMark: 1.0
    }
  ]

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
            <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid 
                stroke="rgba(139, 92, 246, 0.2)"
                strokeWidth={1}
              />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 1]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickCount={6}
              />
              <Radar
                name="Objective Weights"
                dataKey="value"
                stroke="url(#radarStroke)"
                fill="url(#radarFill)"
                fillOpacity={0.6}
                strokeWidth={2}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <defs>
                <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </ClientOnlyChart>

        {/* Label */}
        <div className="mt-4 text-center">
          <div className="text-xs font-medium text-gray-600">
            RL-balanced objective priorities
          </div>
        </div>
      </div>
    </div>
  )
}

