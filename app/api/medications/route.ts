// app/api/medications/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

const createSchema = z.object({
  familyMemberId: z.string(),
  name: z.string().min(1),
  dosage: z.string().optional(),
  form: z.string().optional(),
  frequency: z.string().optional(),
  scheduleTimes: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'BEDTIME']).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  dosesRemaining: z.number().optional(),
  refillThreshold: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const memberId = searchParams.get('memberId')
  const activeOnly = searchParams.get('active') !== 'false'

  if (memberId) {
    const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
    if (!member || member.userId !== userId) return err('Not found', 404)
  }

  const meds = await prisma.medication.findMany({
    where: {
      familyMember: { userId },
      ...(memberId ? { familyMemberId: memberId } : {}),
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: [{ timeOfDay: 'asc' }, { createdAt: 'asc' }],
  })
  return ok(meds)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json()
  const data = createSchema.parse(body)

  const member = await prisma.familyMember.findUnique({ where: { id: data.familyMemberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  const med = await prisma.medication.create({
    data: {
      ...data,
      scheduleTimes: data.scheduleTimes ? JSON.stringify(data.scheduleTimes) : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  })
  return ok(med, 201)
})
