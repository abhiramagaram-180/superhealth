// app/api/records/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

async function assertOwnership(recordId: string, userId: string) {
  const record = await prisma.clinicalRecord.findUnique({
    where: { id: recordId },
    include: { familyMember: { select: { userId: true } } },
  })
  if (!record || record.familyMember.userId !== userId)
    throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return record
}

export const GET = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const record = await prisma.clinicalRecord.findUnique({
    where: { id: params.id },
    include: { prescriptions: true, attachments: true, familyMember: true },
  })
  return ok(record)
})

const updateSchema = z.object({
  visitDate: z.string().optional(),
  facility: z.string().optional(),
  physicianName: z.string().optional(),
  visitType: z.enum(['RECORD', 'REPORT', 'URGENT_CARE']).optional(),
  summary: z.string().optional(),
}).partial()

export const PATCH = withAuth(async (req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const body = await req.json()
  const data = updateSchema.parse(body)

  const updated = await prisma.clinicalRecord.update({
    where: { id: params.id },
    data: {
      ...data,
      visitDate: data.visitDate ? new Date(data.visitDate) : undefined,
    },
    include: { prescriptions: true },
  })
  return ok(updated)
})

export const DELETE = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  await prisma.clinicalRecord.delete({ where: { id: params.id } })
  return ok({ deleted: true })
})
