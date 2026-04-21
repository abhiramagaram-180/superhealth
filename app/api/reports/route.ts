// app/api/reports/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

const createSchema = z.object({
  familyMemberId: z.string(),
  title: z.string().min(1),
  category: z.enum(['BLOOD_WORK', 'RADIOLOGY', 'VACCINATION', 'OTHER']).default('BLOOD_WORK'),
  labName: z.string().optional(),
  physicianName: z.string().optional(),
  reportDate: z.string(),
  status: z.enum(['NORMAL', 'FOLLOW_UP_NEEDED', 'CRITICAL', 'PENDING']).default('NORMAL'),
  summary: z.string().optional(),
  testResults: z.array(z.object({
    name: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    normalRange: z.string().optional(),
    trend: z.enum(['UP', 'DOWN', 'STABLE']).optional(),
    status: z.enum(['NORMAL', 'ELEVATED', 'LOW', 'CRITICAL']).optional(),
  })).optional(),
})

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const memberId = searchParams.get('memberId')
  const category = searchParams.get('category')

  if (memberId) {
    const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
    if (!member || member.userId !== userId) return err('Not found', 404)
  }

  const reports = await prisma.labReport.findMany({
    where: {
      familyMember: { userId },
      ...(memberId ? { familyMemberId: memberId } : {}),
      ...(category ? { category } : {}),
    },
    include: { testResults: true },
    orderBy: { reportDate: 'desc' },
  })
  return ok(reports)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json()
  const data = createSchema.parse(body)

  const member = await prisma.familyMember.findUnique({ where: { id: data.familyMemberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  const report = await prisma.labReport.create({
    data: {
      familyMemberId: data.familyMemberId,
      title: data.title,
      category: data.category,
      labName: data.labName,
      physicianName: data.physicianName,
      reportDate: new Date(data.reportDate),
      status: data.status,
      summary: data.summary,
      testResults: data.testResults ? { create: data.testResults } : undefined,
    },
    include: { testResults: true },
  })
  return ok(report, 201)
})
