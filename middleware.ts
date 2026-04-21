// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  // Protect all routes except login, register, and public assets
  matcher: [
    '/((?!login|register|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
