import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Check if user needs onboarding (no username or display name)
    const needsOnboarding = !token?.username || !token?.displayName

    // Redirect to onboarding if needed
    if (needsOnboarding && pathname !== '/onboarding' && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token, req }) {
        // All authenticated users can access protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/profile/:path*',
    '/api/user/:path*',
    '/api/protected/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}