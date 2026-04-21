// app/api/reports/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { ok, withAuth } from '@/lib/api'
import { z } from 'zod'

async function assertOwnership(reportId: string, userId: string) {
  const report = await prisma.labReport.findUnique({
    where: { id: reportId },
    include: { familyMember: { select: { userId: true } } },
  })
  if (!report || report.familyMember.userId !== userId)
    throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return report
}

export const GET = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const report = await prisma.labReport.findUnique({
    where: { id: params.id },
    include: { testResults: true, familyMember: { select: { id: true, name: true } } },
  })
  return ok(report)
})

const updateSchema = z.object({
  title: z.string().optional(),
  category: z.enum(['BLOOD_WORK', 'RADIOLOGY', 'VACCINATION', 'OTHER']).optional(),
  labName: z.string().optional(),
  physicianName: z.string().optional(),
  reportDate: z.string().optional(),
  status: z.enum(['NORMAL', 'FOLLOW_UP_NEEDED', 'CRITICAL', 'PENDING']).optional(),
  summary: z.string().optional(),
}).partial()

export const PATCH = withAuth(async (req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  const body = await req.json()
  const data = updateSchema.parse(body)

  const updated = await prisma.labReport.update({
    where: { id: params.id },
    data: {
      ...data,
      reportDate: data.reportDate ? new Date(data.reportDate) : undefined,
    },
    include: { testResults: true },
  })
  return ok(updated)
})

export const DELETE = withAuth(async (_req, { params, userId }) => {
  await assertOwnership(params.id, userId)
  await prisma.labReport.delete({ where: { id: params.id } })
  return ok({ deleted: true })
})
