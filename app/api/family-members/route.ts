// app/api/family-members/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  avatarInitials: z.string().max(2).optional(),
  avatarColor: z.string().optional(),
})

export const GET = withAuth(async (_req, { userId }) => {
  const members = await prisma.familyMember.findMany({
    where: { userId },
    include: {
      conditions: { where: { status: 'ACTIVE' }, take: 3 },
      medications: { where: { isActive: true }, take: 5 },
      _count: { select: { records: true, reports: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return ok(members)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json()
  const data = createSchema.parse(body)

  const member = await prisma.familyMember.create({
    data: {
      userId,
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    },
  })
  return ok(member, 201)
})
