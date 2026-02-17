'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Zap, Mail, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup' && inviteCode) {
        // Just check if the invite code exists (don't check if it's used)
        // The code will be marked as used only after email verification
        const { data, error: inviteError } = await supabase
          .from('invite_codes')
          .select('code')
          .eq('code', inviteCode)
          .single()

        if (inviteError || !data) {
          setError('Invalid invite code. Please check and try again.')
          setLoading(false)
          return
        }
      }

      let authResult
      if (mode === 'signup') {
        // Sign up with email verification enabled
        authResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify-email`,
          },
        })
      } else {
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      }

      if (authResult.error) throw authResult.error

      // For signup, check if email confirmation is required
      if (mode === 'signup') {
        // Check if user needs email verification
        if (authResult.data.user && !authResult.data.session) {
          // Email confirmation required - store invite code info temporarily
          // Store the invite code in user metadata so we can mark it as used after verification
          if (inviteCode && authResult.data.user) {
            // Store invite code in user metadata for later use during verification
            await supabase.auth.updateUser({
              data: { invite_code: inviteCode }
            })
            
            // Store the invite code association with this email (but don't mark as used yet)
            // This allows multiple people to sign up with the same code
            // Each will be marked as used only after their email verification
            try {
              await supabase
                .from('invite_codes')
                .update({
                  used_by_email: email,
                  // Don't set used=true yet - wait for email verification
                })
                .eq('code', inviteCode)
            } catch (err) {
              // If update fails (e.g., RLS policy), that's okay
              // The invite code is stored in user metadata, which is sufficient
              console.log('Note: Could not update invite code table, but invite code stored in user metadata')
            }
          }
          
          setVerificationSent(true)
          setError('')
          return
        } else if (authResult.data.user && authResult.data.session) {
          // Email auto-confirmed (if Supabase has autoconfirm enabled)
          // Mark invite code as used immediately
          if (inviteCode) {
            await supabase
              .from('invite_codes')
              .update({
                used: true,
                used_by_email: email,
              })
              .eq('code', inviteCode)
          }
          router.push('/dashboard')
          return
        }
      }

      // For login, check if email is verified
      if (mode === 'login') {
        if (authResult.data.session && authResult.data.user) {
          // Check if email is verified
          if (!authResult.data.user.email_confirmed_at && !authResult.data.user.confirmed_at) {
            setError('Please verify your email before logging in. Check your inbox for the verification link.')
            setLoading(false)
            return
          }
          router.push('/dashboard')
        } else {
          setError('Login failed. Please check your credentials.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-lg"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-gradient mb-2"
          >
          RL Code Agent
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-sm"
          >
          Invite-only code optimization platform
          </motion.p>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100/80 rounded-xl p-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </motion.button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required={mode === 'signup'}
                placeholder="Enter invite code"
              />
              <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/50 rounded-xl">
                <p className="text-sm text-gray-700 mb-1">
                  Don't have an invite code? Request one by emailing:
                </p>
                <a
                  href="mailto:rm7336@nyu.edu"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 break-all"
                >
                  rm7336@nyu.edu
                </a>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              required
              placeholder="your@email.com"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              required
              placeholder="••••••••"
            />
          </motion.div>

          {verificationSent ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50/80 border border-blue-300/50 text-blue-800 px-4 py-3 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold mb-1">Check your email!</p>
                  <p className="text-sm">
                    We've sent a verification link to <strong>{email}</strong>.
                    Please click the link in the email to verify your account.
                  </p>
                  <p className="text-xs mt-2 text-blue-600">
                    After verification, you can log in with your credentials.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100/80 border border-red-300/50 text-red-700 px-4 py-3 rounded-xl backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || verificationSent}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Zap size={18} className="animate-spin" />
                Loading...
              </>
            ) : verificationSent ? (
              <>
                <CheckCircle size={18} />
                Verification Email Sent
              </>
            ) : mode === 'login' ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>
      </motion.div>
      
      {/* Watermark */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400/60 font-medium">
        Made by Rishit Maheshwari
      </div>
    </div>
  )
}
