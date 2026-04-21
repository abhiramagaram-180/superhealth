// app/api/dashboard/[memberId]/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'

export const GET = withAuth(async (_req, { params, userId }) => {
  const member = await prisma.familyMember.findUnique({ where: { id: params.memberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  // All data in parallel
  const [
    conditions,
    allergies,
    medications,
    recentRecords,
    latestReport,
    refillAlerts,
    adherenceData,
  ] = await Promise.all([
    prisma.condition.findMany({
      where: { familyMemberId: params.memberId, status: 'ACTIVE' },
    }),
    prisma.allergy.findMany({
      where: { familyMemberId: params.memberId },
      orderBy: [{ severity: 'desc' }],
    }),
    prisma.medication.findMany({
      where: { familyMemberId: params.memberId, isActive: true },
      orderBy: [{ timeOfDay: 'asc' }],
    }),
    prisma.clinicalRecord.findMany({
      where: { familyMemberId: params.memberId },
      orderBy: { visitDate: 'desc' },
      take: 3,
      include: { prescriptions: true },
    }),
    prisma.labReport.findFirst({
      where: { familyMemberId: params.memberId, category: 'BLOOD_WORK' },
      orderBy: { reportDate: 'desc' },
      include: { testResults: true },
    }),
    prisma.medication.findMany({
      where: {
        familyMemberId: params.memberId,
        isActive: true,
        dosesRemaining: { lte: 7, not: null },
      },
      orderBy: { dosesRemaining: 'asc' },
    }),
    // 7-day adherence
    (async () => {
      const from = new Date()
      from.setDate(from.getDate() - 7)
      from.setHours(0, 0, 0, 0)
      const logs = await prisma.medicationLog.findMany({
        where: {
          familyMemberId: params.memberId,
          scheduledDate: { gte: from },
          status: { not: 'PENDING' },
        },
      })
      const taken = logs.filter(l => l.status === 'TAKEN').length
      const total = logs.length
      return { taken, missed: total - taken, total, rate: total === 0 ? 100 : Math.round((taken / total) * 100) }
    })(),
  ])

  return ok({
    member,
    conditions,
    allergies,
    medications,
    recentRecords,
    latestReport,
    refillAlerts,
    adherence: adherenceData,
  })
})
