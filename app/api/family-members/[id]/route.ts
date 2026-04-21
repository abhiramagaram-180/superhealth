// app/api/family-members/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

async function assertOwnership(memberId: string, userId: string) {
  const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
  if (!member || member.userId !== userId) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return member
}

export const GET = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)

  const member = await prisma.familyMember.findUnique({
    where: { id: params.id },
    include: {
      conditions: true,
      allergies: true,
      medications: { where: { isActive: true } },
      reports: {
        orderBy: { reportDate: 'desc' },
        take: 10,
        include: { testResults: true },
      },
      records: {
        orderBy: { visitDate: 'desc' },
        take: 5,
        include: { prescriptions: true },
      },
    },
  })
  return ok(member)
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  status: z.enum(['STABLE', 'CRITICAL', 'MONITORING']).optional(),
}).partial()

export const PATCH = withAuth(async (req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const body = await req.json()
  const data = updateSchema.parse(body)

  const updated = await prisma.familyMember.update({
    where: { id: params.id },
    data: {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    },
  })
  return ok(updated)
})

export const DELETE = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  await prisma.familyMember.delete({ where: { id: params.id } })
  return ok({ deleted: true })
})
