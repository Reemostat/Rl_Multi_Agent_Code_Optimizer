'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Generate deterministic grid lines (based on index to avoid hydration mismatch)
  const generateGridLines = (count: number) => {
    // Use deterministic seed-based "random" values to ensure server/client match
    const seed = 12345 // Fixed seed for consistency
    const seededRandom = (index: number) => {
      const x = Math.sin(index * seed) * 10000
      return x - Math.floor(x)
    }
    
    return Array.from({ length: count }, (_, i) => {
      const rand = seededRandom(i)
      return {
        id: i,
        isHorizontal: rand > 0.5,
        color: seededRandom(i + 100) > 0.5 ? 'blue' : 'purple',
        delay: seededRandom(i + 200) * 5,
        duration: seededRandom(i + 300) * 10 + 10,
        position: seededRandom(i + 400) * 100,
      }
    })
  }

  // Always generate the same grid lines (deterministic) to avoid hydration mismatch
  // Use a default count that works for both server and client
  const gridLines = generateGridLines(mounted ? (isMobile ? 8 : 15) : 15)

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10">
      {/* Base grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Animated neon lines */}
      {gridLines.map((line) => (
        <motion.div
          key={line.id}
          className={`absolute ${
            line.isHorizontal ? 'h-[1px] w-full' : 'w-[1px] h-full'
          } ${
            line.color === 'blue' 
              ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
              : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
          }`}
          initial={{
            opacity: 0 as number,
            [line.isHorizontal ? 'top' : 'left']: `${line.position}%`,
          }}
          animate={{
            opacity: [0, 0.4, 0] as number[],
            [line.isHorizontal ? 'top' : 'left']: [
              `${line.position}%`,
              `${line.position + (line.isHorizontal ? 100 : -100)}%`,
            ],
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            delay: line.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing orbs for depth */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-3xl"
      />
    </div>
  )
}

