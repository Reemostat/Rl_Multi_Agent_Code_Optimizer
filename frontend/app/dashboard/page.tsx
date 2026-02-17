'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import { optimizeCode, getMetrics } from '@/lib/api'
import Editor from '@monaco-editor/react'
import { LogOut, Settings } from 'lucide-react'
import DiffViewer from '@/components/DiffViewer'
import PolicyDecisionPanel from '@/components/PolicyDecisionPanel'
import OptimizationProgressPanel from '@/components/OptimizationProgressPanel'
import ExecutionMetricsPanel from '@/components/ExecutionMetricsPanel'
import ActionDistributionChart from '@/components/ActionDistributionChart'
import ObjectiveWeightsRadar from '@/components/ObjectiveWeightsRadar'
import PolicyEvolutionChart from '@/components/PolicyEvolutionChart'

export default function DashboardPage() {
  const router = useRouter()
  const {
    code,
    optimizedCode,
    result,
    loading,
    error,
    usage,
    setCode,
    setOptimizedCode,
    setResult,
    setLoading,
    setError,
    setUsage,
    preferences,
    setPreferences,
    resetStore,
  } = useStore()

  const [maxRefinements, setMaxRefinements] = useState(3)
  const [showControls, setShowControls] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Reset results and metrics on mount to ensure clean state on page refresh
    // This ensures the dashboard is like when you log in for the first time
    setCode('')
    setResult(null)
    setOptimizedCode(null)
    setError(null)
    setLoading(false)

    // Only check session, don't redirect automatically
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Session check only - no redirect
    })

    loadMetrics()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only monitor auth state - no redirect
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [router, setCode, setResult, setOptimizedCode, setError, setLoading])

  const loadMetrics = async () => {
    try {
      const metrics = await getMetrics()
      setUsage(metrics)
    } catch (err) {
      console.error('Failed to load metrics:', err)
    }
  }

  const handleOptimize = async () => {
    if (!code.trim()) {
      setError('Please enter code to optimize')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await optimizeCode(
        code,
        maxRefinements,
        preferences.runtime,
        preferences.memory,
        preferences.quality
      )
      setOptimizedCode(response.optimized_code)
      setResult(response)
      await loadMetrics()
    } catch (err: any) {
      setError(err.message || 'Optimization failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Clear all store state before logging out
    resetStore()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handlePreferenceChange = (key: 'runtime' | 'memory' | 'quality', value: number) => {
    // Clamp value to valid range
    const clampedValue = Math.max(0, Math.min(1, value))
    
    const newPrefs = { ...preferences, [key]: clampedValue }
    const total = newPrefs.runtime + newPrefs.memory + newPrefs.quality
    
    // Only normalize if total is greater than 0 and not exactly 1.0
    if (total > 0 && Math.abs(total - 1.0) > 0.001) {
      // Normalize to sum to 1.0
      setPreferences({
        runtime: newPrefs.runtime / total,
        memory: newPrefs.memory / total,
        quality: newPrefs.quality / total,
      })
    } else if (Math.abs(total - 1.0) <= 0.001) {
      // Already normalized, just update the changed value
      setPreferences(newPrefs)
    } else {
      // Fallback: set equal weights
      setPreferences({
        runtime: 0.33,
        memory: 0.33,
        quality: 0.34,
      })
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Header with Portfolio Design */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
        style={{
          background: isScrolled
            ? 'rgba(255, 255, 255, 0.3)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <motion.h1
              whileHover={{ scale: 1.02 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold cursor-pointer relative group"
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.9)] transition-all duration-300">
                Multi RL Agent code optimizer
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.h1>

          <div className="flex items-center gap-4">
            {usage && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full bg-white/30 border border-white/20 backdrop-blur-xl text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <span>{usage.remaining} / {usage.daily_limit} Requests</span>
                </motion.div>
            )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all duration-300"
            >
              <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-16 space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100/80 border border-red-300/50 text-red-700 px-4 py-3 rounded-2xl backdrop-blur-xl"
          >
            {error}
          </motion.div>
        )}

        {/* Optimization Controls - Apple Glass Style */}
        <AnimatePresence>
        {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-3xl p-6 overflow-hidden transition-all duration-300"
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
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <div className="relative z-10"
            >
            <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800/90 flex items-center gap-2">
                    <Settings size={18} className="text-blue-600/80" />
                Optimization Preferences
              </h2>
              <button
                onClick={() => setShowControls(false)}
                    className="text-xs text-gray-500/80 hover:text-gray-700 transition-colors px-2 py-1 rounded-lg hover:bg-white/30"
              >
                Hide
              </button>
            </div>

            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objective Weights (must sum to 1.0)
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    ✓ Applied to optimization
                  </span>
                </label>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          Runtime: {(preferences.runtime * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.runtime}
                      onChange={(e) => handlePreferenceChange('runtime', parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-slider-runtime"
                        style={{
                          background: `linear-gradient(to right, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.3) ${preferences.runtime * 100}%, rgba(255, 255, 255, 0.1) ${preferences.runtime * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                        }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                          Memory: {(preferences.memory * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.memory}
                      onChange={(e) => handlePreferenceChange('memory', parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-slider-memory"
                        style={{
                          background: `linear-gradient(to right, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.3) ${preferences.memory * 100}%, rgba(255, 255, 255, 0.1) ${preferences.memory * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                        }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
                          Quality: {(preferences.quality * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.quality}
                      onChange={(e) => handlePreferenceChange('quality', parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-slider-quality"
                        style={{
                          background: `linear-gradient(to right, rgba(244, 114, 182, 0.3) 0%, rgba(244, 114, 182, 0.3) ${preferences.quality * 100}%, rgba(255, 255, 255, 0.1) ${preferences.quality * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                        }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Total: {((preferences.runtime + preferences.memory + preferences.quality) * 100).toFixed(0)}%
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium mb-2">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Optimization Rounds: {maxRefinements}
                    </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxRefinements}
                  onChange={(e) => setMaxRefinements(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-slider-refinement"
                    style={{
                      background: `linear-gradient(to right, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) ${((maxRefinements - 1) / 4) * 100}%, rgba(244, 114, 182, 0.3) ${((maxRefinements - 1) / 4) * 100}%, rgba(255, 255, 255, 0.1) ${((maxRefinements - 1) / 4) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                    }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Number of iterative optimization rounds (1-5). This controls how many rounds the system will optimize your code.
                </div>
              </div>
            </div>
          </div>
            </motion.div>
        )}
        </AnimatePresence>

        {!showControls && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowControls(true)}
            className="text-xs text-blue-600/80 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
          >
            <Settings size={14} />
            Show Preferences
          </motion.button>
        )}

        {/* Original Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
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
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Original Code</h2>
            <div className="rounded-xl overflow-hidden bg-[#1e1e1e] shadow-inner">
            <Editor
              height="400px"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Monaco, "Courier New", monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
        </motion.div>

        {/* Optimize Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOptimize}
            disabled={loading || !code.trim() || (usage?.remaining ?? 0) <= 0}
            className="relative px-16 py-5 rounded-full font-medium overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Animated liquid shimmer */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Neon glow background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.9)] transition-all duration-300">
              {loading ? 'Optimizing...' : 'Optimize Code'}
            </span>
          </motion.button>
        </div>

        {/* Action Distribution Chart - Show immediately after optimization */}
        {result && result.rl_meta_action && result.rl_meta_action.action_probabilities && result.rl_meta_action.action_probabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
            suppressHydrationWarning
          >
            <ActionDistributionChart
              actionProbabilities={result.rl_meta_action.action_probabilities}
              selectedAction={result.rl_meta_action.selected_action ?? 0}
              entropy={result.rl_meta_action.entropy}
              confidence={result.rl_meta_action.confidence}
            />
          </motion.div>
        )}

        {/* Optimization Summary Card */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
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
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">Optimization Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative rounded-xl p-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="text-xs text-gray-600 mb-1">Strategy</div>
                  <div className="text-xl font-bold text-purple-600">{result.strategy_label}</div>
                  </div>
                <div className="relative rounded-xl p-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="text-xs text-gray-600 mb-1">Reward</div>
                  <div className="text-xl font-bold text-blue-600">{result.reward.toFixed(3)}</div>
                </div>
                <div className="relative rounded-xl p-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="text-xs text-gray-600 mb-1">Runtime</div>
                  <div className="text-xl font-bold text-green-600">
                    {result.metrics.runtime_improvement_pct > 0 ? '+' : ''}
                    {result.metrics.runtime_improvement_pct.toFixed(1)}%
                  </div>
                </div>
                <div className="relative rounded-xl p-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="text-xs text-gray-600 mb-1">Memory</div>
                  <div className="text-xl font-bold text-cyan-600">
                    {result.metrics.memory_improvement_pct > 0 ? '+' : ''}
                    {result.metrics.memory_improvement_pct.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Three Research-Grade Panels */}
              <div className="mt-6 space-y-6">
                {/* Panel 1: Policy Decision */}
                {result.rl_meta_action && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
                      backdropFilter: 'blur(32px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    }}
                  >
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
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                    <div className="relative z-10">
                      <h2 className="text-lg font-semibold mb-6 text-gray-800">🧠 Panel 1 — Policy Decision</h2>
                      <PolicyDecisionPanel rlMetaAction={result.rl_meta_action} />
                    </div>
                  </motion.div>
                )}

                {/* Panel 2: Optimization Progress */}
                {result.trace && result.trace.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
                      backdropFilter: 'blur(32px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    }}
                  >
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
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                    <div className="relative z-10">
                      <h2 className="text-lg font-semibold mb-6 text-gray-800">⚙ Panel 2 — Optimization Progress</h2>
                      <OptimizationProgressPanel trace={result.trace} maxRefinements={maxRefinements} />
                    </div>
                  </motion.div>
                )}

                {/* Panel 3: Execution-Grounded Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }}
                >
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
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <div className="relative z-10">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">📊 Panel 3 — Execution-Grounded Metrics</h2>
                    <ExecutionMetricsPanel metrics={result.metrics} reward={result.reward} />
                  </div>
                </motion.div>
              </div>

              {/* Additional Visualization Charts */}
              {result && (
                <div className="mt-6">
                  {/* Objective Weights Radar */}
                  {result.objective_weights && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <ObjectiveWeightsRadar
                        runtimeWeight={result.objective_weights.runtime}
                        memoryWeight={result.objective_weights.memory}
                        qualityWeight={result.objective_weights.quality}
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Policy Evolution Chart */}
              {result && result.trace && result.trace.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-6"
                >
                  <PolicyEvolutionChart
                    trace={result.trace.map((entry, idx) => ({
                      round: entry.round ?? idx + 1,
                      reward: entry.reward ?? 0,
                      entropy: entry.entropy ?? 0
                    }))}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}


        {/* Code Diff Card */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
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
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Code Diff</h2>
            <div className="bg-gray-900/90 border border-gray-300/50 rounded-xl p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
              {result.diff?.unified_diff?.map((line: string, idx: number) => {
                const isAddition = line.startsWith('+') && !line.startsWith('+++')
                const isDeletion = line.startsWith('-') && !line.startsWith('---')
                const isHeader = line.startsWith('@@') || line.startsWith('+++') || line.startsWith('---')
                
                return (
                  <div
                    key={idx}
                    className={`${
                      isAddition
                        ? 'text-green-400 bg-green-500/20'
                        : isDeletion
                        ? 'text-red-400 bg-red-500/20'
                        : isHeader
                        ? 'text-blue-400'
                        : 'text-gray-300'
                    } whitespace-pre py-0.5`}
                  >
                    {line}
                  </div>
                )
              }) || <div className="text-gray-400">No changes detected</div>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Optimized Code Card */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
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
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Optimized Code</h2>
            <div className="rounded-xl overflow-hidden bg-[#1e1e1e] shadow-inner">
              <Editor
                height="400px"
                defaultLanguage="python"
                value={optimizedCode || ''}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Monaco, "Courier New", monospace',
                  lineNumbers: 'on',
                  readOnly: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                }}
              />
              </div>
            </div>
          </motion.div>
        )}

        {/* RL Agent Analysis Summary */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
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
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">RL Agent Analysis: Complete Optimization Process</h2>
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                    <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">📥 Step 1: Code Input & Initial Analysis</h3>
                <p className="text-gray-600 mb-2">
                  When you submit your code, the system first <span className="font-medium text-blue-600">sanitizes and validates</span> the input to ensure it's safe to execute. 
                  The code is then parsed into an Abstract Syntax Tree (AST) to extract <span className="font-medium text-purple-600">64-dimensional feature vector</span> including:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li>Cyclomatic complexity, nested loop depth, recursion detection</li>
                  <li>AST node counts (functions, classes, imports, decorators)</li>
                  <li>Code style metrics (line length, comment ratio, docstring coverage)</li>
                  <li>Structural metrics (function length, nesting levels, abstraction level)</li>
                  <li>Pattern detection (list comprehensions, generators, lambdas)</li>
                  <li>Data structure operations (list, dict, set, tuple operations)</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  This feature vector becomes the <span className="font-medium text-green-600">observation state</span> for the RL model, encoding everything it needs to understand your code's characteristics.
                </p>
                    </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">⚡ Step 2: Baseline Benchmarking</h3>
                <p className="text-gray-600 mb-2">
                  Before optimization, your code is executed in a <span className="font-medium text-cyan-600">sandboxed environment</span> to establish baseline metrics:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li><span className="font-medium">Runtime:</span> Measured using <code className="bg-gray-100 px-1 rounded">time.perf_counter()</code> - your code took <span className="font-medium text-blue-600">{(result.metrics.baseline_runtime * 1000).toFixed(2)} ms</span></li>
                  <li><span className="font-medium">Memory:</span> Profiled using <code className="bg-gray-100 px-1 rounded">tracemalloc</code> - your code used <span className="font-medium text-purple-600">{result.metrics.baseline_memory.toFixed(2)} MB</span></li>
                  <li><span className="font-medium">Test Pass Rate:</span> Code correctness verified - <span className="font-medium text-green-600">{(result.metrics.test_pass_rate * 100).toFixed(0)}%</span> tests passed</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  These baselines serve as the <span className="font-medium text-orange-600">reference point</span> for measuring improvements. Any optimization must beat these metrics to be considered successful.
                </p>
                      </div>

                      <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">🧠 Step 3: RL Policy Decision</h3>
                <p className="text-gray-600 mb-2">
                  The trained PPO (Proximal Policy Optimization) model analyzes your code's 64-dimensional state vector along with your preference weights 
                  (Runtime: {(preferences.runtime * 100).toFixed(0)}%, Memory: {(preferences.memory * 100).toFixed(0)}%, Quality: {(preferences.quality * 100).toFixed(0)}%) 
                  to select an optimization strategy.
                </p>
                {result.rl_meta_action && (
                  <>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-purple-600">Selected Action: {result.rl_meta_action.selected_action ?? 0}</span> ({result.strategy_label}) 
                      with <span className="font-medium text-blue-600">{(result.rl_meta_action.confidence ? result.rl_meta_action.confidence * 100 : 0).toFixed(1)}%</span> confidence.
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-cyan-600">Entropy: {result.rl_meta_action.entropy?.toFixed(3) ?? 'N/A'}</span> - 
                      {result.rl_meta_action.entropy && result.rl_meta_action.entropy > 0.5 ? (
                        <span className="text-green-600"> The model is exploring diverse strategies (good exploration-exploitation balance)</span>
                      ) : result.rl_meta_action.entropy && result.rl_meta_action.entropy < 0.3 ? (
                        <span className="text-yellow-600"> The model is highly confident (may indicate policy convergence)</span>
                      ) : (
                        <span> Balanced exploration-exploitation</span>
                      )}
                    </p>
                    <p className="text-gray-600 text-xs text-gray-500 mt-1">
                      Action Probabilities: {result.rl_meta_action.action_probabilities?.map((p, i) => `${i}:${(p * 100).toFixed(1)}%`).join(', ') || 'N/A'}
                    </p>
                  </>
                )}
                <p className="text-gray-600 mt-2">
                  The model outputs a <span className="font-medium text-pink-600">strategy mask</span> (e.g., [1, 0, 0] = Runtime Agent only, [1, 1, 1] = All agents) 
                  and calculates blended objective weights that combine your preferences (70%) with action-specific weights (30%).
                </p>
                      </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">🔄 Step 4: Multi-Agent Optimization Loop</h3>
                <p className="text-gray-600 mb-2">
                  Over <span className="font-medium text-blue-600">{result.trace?.length || maxRefinements} refinement rounds</span>, specialized agents work in parallel:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-sm text-gray-600">
                  <li><span className="font-medium text-green-600">Runtime Agent:</span> Focuses on algorithmic improvements, loop optimization, and reducing computational complexity</li>
                  <li><span className="font-medium text-cyan-600">Memory Agent:</span> Optimizes memory usage through generators, in-place operations, and efficient data structures</li>
                  <li><span className="font-medium text-purple-600">Readability Agent:</span> Improves code quality, maintainability, and follows best practices</li>
                  <li><span className="font-medium text-orange-600">Critic Agent:</span> Evaluates all candidate solutions, scoring safety, readability, and overall quality</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  Each round, agents generate candidate optimizations. The Critic scores each candidate using a multi-objective reward function that balances:
                  runtime improvement ({((result.objective_weights?.runtime ?? preferences.runtime) * 100).toFixed(0)}%), 
                  memory reduction ({((result.objective_weights?.memory ?? preferences.memory) * 100).toFixed(0)}%), and 
                  quality score ({((result.objective_weights?.quality ?? preferences.quality) * 100).toFixed(0)}%).
                </p>
                {result.trace && result.trace.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
                    <p className="font-medium text-gray-700 mb-1">Round-by-Round Progress:</p>
                    {result.trace.map((entry, idx) => (
                      <p key={idx} className="text-gray-600">
                        Round {entry.round ?? idx + 1}: {entry.strategy || 'Unknown'} → Reward: <span className="font-medium">{entry.reward?.toFixed(3) ?? 'N/A'}</span>
                        {entry.entropy && ` (Entropy: ${entry.entropy.toFixed(3)})`}
                      </p>
                    ))}
                  </div>
                )}
                      </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">📊 Step 5: Reward Calculation & Selection</h3>
                <p className="text-gray-600 mb-2">
                  For each candidate, the system calculates a <span className="font-medium text-blue-600">multi-objective reward</span>:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li><span className="font-medium">Runtime Component:</span> Weighted improvement in execution time (capped at 70% to prevent dominance)</li>
                  <li><span className="font-medium">Memory Component:</span> Weighted reduction in memory usage</li>
                  <li><span className="font-medium">Quality Component:</span> Critic's quality score (safety, readability, maintainability)</li>
                  <li><span className="font-medium">Test Pass Bonus:</span> +0.2 if all tests pass</li>
                  <li><span className="font-medium">Safety Penalty:</span> -0.15 if code is marked unsafe</li>
                  <li><span className="font-medium">Stability Variance:</span> Penalty for high variance across rounds</li>
                  <li><span className="font-medium">Exploration Bonus:</span> +0.05 for trying optimization</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  The final reward of <span className="font-medium text-green-600">{result.reward.toFixed(3)}</span> reflects the overall optimization quality. 
                  The best candidate (highest reward) becomes the input for the next refinement round, creating an <span className="font-medium text-purple-600">iterative improvement process</span>.
                </p>
                      </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base">✅ Step 6: Final Results & Code Generation</h3>
                <p className="text-gray-600 mb-2">
                  After all refinement rounds complete, the system produces the optimized code with:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li><span className="font-medium text-green-600">Runtime Improvement:</span> {result.metrics.runtime_improvement_pct > 0 ? '+' : ''}{result.metrics.runtime_improvement_pct.toFixed(1)}% 
                    ({result.metrics.baseline_runtime > 0 ? ((result.metrics.baseline_runtime - result.metrics.optimized_runtime) * 1000).toFixed(2) : '0'} ms faster)</li>
                  <li><span className="font-medium text-cyan-600">Memory Improvement:</span> {result.metrics.memory_improvement_pct > 0 ? '+' : ''}{result.metrics.memory_improvement_pct.toFixed(1)}% 
                    ({result.metrics.baseline_memory > result.metrics.optimized_memory ? (result.metrics.baseline_memory - result.metrics.optimized_memory).toFixed(2) : '0'} MB saved)</li>
                  <li><span className="font-medium text-purple-600">Code Changes:</span> {result.diff?.line_changes || 0} lines modified across {result.diff?.original_lines || 'N/A'} original lines</li>
                  <li><span className="font-medium text-blue-600">Test Pass Rate:</span> {(result.metrics.test_pass_rate * 100).toFixed(0)}% (functional correctness maintained)</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  The code diff shows exactly what changed: <span className="text-green-600">green lines</span> are additions, 
                  <span className="text-red-600"> red lines</span> are removals. Each change was evaluated by the RL agent to ensure it improves performance 
                  while maintaining code quality and safety according to your specified preferences.
                </p>
                </div>

            </div>
          </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
