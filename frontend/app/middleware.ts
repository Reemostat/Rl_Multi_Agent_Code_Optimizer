import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // No automatic redirects - only logout button will redirect to login
  // Users can access dashboard even without session (they'll just see errors when trying to optimize)

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

