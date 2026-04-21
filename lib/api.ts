// lib/api.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}

/** Wraps a route handler with auth + error handling */
export function withAuth(
  handler: (req: Request, ctx: { params: any; userId: string }) => Promise<Response>
) {
  return async (req: Request, ctx: { params: any }) => {
    try {
      const session = await getSession()
      if (!session?.user) return err('Unauthorized', 401)
      const userId = (session.user as any).id as string
      return await handler(req, { ...ctx, userId })
    } catch (e: any) {
      console.error(e)
      if (e.message === 'UNAUTHORIZED') return err('Unauthorized', 401)
      if (e.code === 'P2025') return err('Not found', 404)
      return err('Internal server error', 500)
    }
  }
}
