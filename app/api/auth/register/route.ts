// app/api/auth/register/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return err('Email already registered', 409)

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true, name: true },
    })

    return ok(user, 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return err(e.errors[0]?.message ?? 'Invalid input', 422)
    return err('Internal server error', 500)
  }
}
