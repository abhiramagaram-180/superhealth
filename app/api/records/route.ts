// app/api/records/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

const createSchema = z.object({
  familyMemberId: z.string(),
  visitDate: z.string(),
  facility: z.string().optional(),
  physicianName: z.string().optional(),
  visitType: z.enum(['RECORD', 'REPORT', 'URGENT_CARE']).default('RECORD'),
  summary: z.string().optional(),
  prescriptions: z.array(z.object({
    medicationName: z.string(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
  })).optional(),
})

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const memberId = searchParams.get('memberId')
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  // Verify member ownership
  if (memberId) {
    const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
    if (!member || member.userId !== userId) return err('Not found', 404)
  }

  const records = await prisma.clinicalRecord.findMany({
    where: {
      familyMember: { userId },
      ...(memberId ? { familyMemberId: memberId } : {}),
      ...(type ? { visitType: type } : {}),
    },
    include: {
      prescriptions: true,
      attachments: true,
      familyMember: { select: { id: true, name: true } },
    },
    orderBy: { visitDate: 'desc' },
    take: limit,
  })
  return ok(records)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json()
  const data = createSchema.parse(body)

  // Verify member ownership
  const member = await prisma.familyMember.findUnique({ where: { id: data.familyMemberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  const record = await prisma.clinicalRecord.create({
    data: {
      familyMemberId: data.familyMemberId,
      visitDate: new Date(data.visitDate),
      facility: data.facility,
      physicianName: data.physicianName,
      visitType: data.visitType,
      summary: data.summary,
      prescriptions: data.prescriptions
        ? { create: data.prescriptions }
        : undefined,
    },
    include: { prescriptions: true },
  })
  return ok(record, 201)
})
