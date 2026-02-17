import type { Metadata } from 'next'
import './globals.css'
import AnimatedBackground from '@/components/AnimatedBackground'

export const metadata: Metadata = {
  title: 'RL Code Agent - Autonomous Code Optimization',
  description: 'Invite-only code optimization platform powered by reinforcement learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {<AnimatedBackground />}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

