// app/api/medications/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { ok, withAuth } from '@/lib/api'
import { z } from 'zod'

async function assertOwnership(medId: string, userId: string) {
  const med = await prisma.medication.findUnique({
    where: { id: medId },
    include: { familyMember: { select: { userId: true } } },
  })
  if (!med || med.familyMember.userId !== userId)
    throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return med
}

export const GET = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const med = await prisma.medication.findUnique({
    where: { id: params.id },
    include: {
      logs: { orderBy: { scheduledDate: 'desc' }, take: 14 },
    },
  })
  return ok(med)
})

const updateSchema = z.object({
  name: z.string().optional(),
  dosage: z.string().optional(),
  form: z.string().optional(),
  frequency: z.string().optional(),
  scheduleTimes: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'BEDTIME']).optional(),
  dosesRemaining: z.number().optional(),
  isActive: z.boolean().optional(),
  endDate: z.string().optional(),
}).partial()

export const PATCH = withAuth(async (req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const body = await req.json()
  const data = updateSchema.parse(body)

  const updated = await prisma.medication.update({
    where: { id: params.id },
    data: {
      ...data,
      scheduleTimes: data.scheduleTimes ? JSON.stringify(data.scheduleTimes) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  })
  return ok(updated)
})

export const DELETE = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  // Soft delete - mark inactive rather than destroy
  const updated = await prisma.medication.update({
    where: { id: params.id },
    data: { isActive: false, endDate: new Date() },
  })
  return ok(updated)
})
