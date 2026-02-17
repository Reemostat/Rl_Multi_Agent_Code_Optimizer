'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyChartProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Wrapper component to prevent hydration errors with Recharts
 * Only renders children on the client side after hydration
 */
export default function ClientOnlyChart({ children, fallback = null }: ClientOnlyChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}


