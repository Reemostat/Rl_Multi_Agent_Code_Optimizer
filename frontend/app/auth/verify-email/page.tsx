'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Verifying your email...')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase sends tokens in URL hash fragments (e.g., #access_token=...&type=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        // Also check query params (fallback)
        const token = searchParams.get('token')
        const typeParam = searchParams.get('type')

        // Check if we have tokens in hash (Supabase default)
        if (accessToken || refreshToken) {
          // Supabase automatically handles the session when tokens are in hash
          // Just wait a moment for Supabase to process it
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Get the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (session && session.user) {
            // Check if email is verified
            if (session.user.email_confirmed_at || session.user.confirmed_at) {
              setStatus('success')
              setMessage('Your email has been verified successfully!')
              setUserEmail(session.user.email || null)
              
              // Mark invite code as used
              await markInviteCodeAsUsed(session.user.email)
              
              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } else {
              setStatus('error')
              setMessage('Email verification incomplete. Please try the link again.')
            }
          } else {
            setStatus('error')
            setMessage('Session not found. Please try the verification link again or log in.')
          }
          return
        }

        // Fallback: Try to get existing session (might already be verified)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (session && session.user) {
          if (session.user.email_confirmed_at || session.user.confirmed_at) {
            // User is already verified
            setStatus('success')
            setMessage('Your email is already verified!')
            setUserEmail(session.user.email || null)
            
            // Mark invite code as used
            await markInviteCodeAsUsed(session.user.email)
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            return
          } else {
            setStatus('error')
            setMessage('Email not yet verified. Please check your email for the verification link.')
            return
          }
        }

        // No tokens and no session
        setStatus('error')
        setMessage('Verification token not found. Please check your email and click the verification link again.')
      } catch (err: any) {
        console.error('Verification error:', err)
        setStatus('error')
        setMessage(err.message || 'An error occurred during verification.')
      }
    }

    verifyEmail()
  }, [router, searchParams])

  const markInviteCodeAsUsed = async (email: string | undefined) => {
    if (!email) return

    try {
      // Get the user's session to find their invite code from metadata
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.user_metadata?.invite_code) {
        const inviteCode = user.user_metadata.invite_code
        
        // Mark this specific invite code as used for this email
        // This allows the same code to be used by multiple people until they verify
        const { error: updateError } = await supabase
          .from('invite_codes')
          .update({ 
            used: true,
            used_by_email: email 
          })
          .eq('code', inviteCode)

        if (updateError) {
          console.error('Error updating invite code:', updateError)
          // Fallback: try to find by email
          const { data: inviteCodes } = await supabase
            .from('invite_codes')
            .select('code')
            .eq('used_by_email', email)
            .eq('used', false)
            .limit(1)

          if (inviteCodes && inviteCodes.length > 0) {
            await supabase
              .from('invite_codes')
              .update({ used: true })
              .eq('code', inviteCodes[0].code)
          }
        }
      } else {
        // Fallback: find by email if metadata not available
        const { data: inviteCodes, error } = await supabase
          .from('invite_codes')
          .select('code')
          .eq('used_by_email', email)
          .eq('used', false)
          .limit(1)

        if (!error && inviteCodes && inviteCodes.length > 0) {
          await supabase
            .from('invite_codes')
            .update({ used: true })
            .eq('code', inviteCodes[0].code)
        }
      }
    } catch (err) {
      console.error('Error marking invite code:', err)
      // Don't fail verification if invite code update fails
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-lg text-center"
      >
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            {userEmail && (
              <p className="text-sm text-gray-500 mb-4">
                Verified: <strong>{userEmail}</strong>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Dashboard →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <Link
              href="/login"
              className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Go to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

