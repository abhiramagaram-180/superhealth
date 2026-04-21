// app/api/medication-logs/route.ts
import { prisma } from '@/lib/prisma'
import { ok, err, withAuth } from '@/lib/api'
import { z } from 'zod'

// GET  /api/medication-logs?memberId=&date=YYYY-MM-DD
// POST /api/medication-logs  { medicationId, scheduledDate, scheduledTime, status }

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url)
  const memberId = searchParams.get('memberId')
  const dateStr = searchParams.get('date')

  if (!memberId) return err('memberId required', 400)

  const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  const date = dateStr ? new Date(dateStr) : new Date()
  date.setHours(0, 0, 0, 0)
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)

  // Fetch medication logs for the date, or synthesize from medications if no logs exist
  const logs = await prisma.medicationLog.findMany({
    where: {
      familyMemberId: memberId,
      scheduledDate: { gte: date, lt: nextDay },
    },
    include: { medication: true },
    orderBy: { scheduledTime: 'asc' },
  })

  // If no logs for today, auto-generate from active medications
  if (logs.length === 0 && dateStr === new Date().toISOString().split('T')[0]) {
    const meds = await prisma.medication.findMany({
      where: { familyMemberId: memberId, isActive: true },
    })
    const generatedLogs = []
    for (const med of meds) {
      const times: string[] = med.scheduleTimes ? JSON.parse(med.scheduleTimes) : []
      for (const time of times) {
        const log = await prisma.medicationLog.upsert({
          where: { medicationId_scheduledDate_scheduledTime: { medicationId: med.id, scheduledDate: date, scheduledTime: time } },
          update: {},
          create: { medicationId: med.id, familyMemberId: memberId, scheduledDate: date, scheduledTime: time, status: 'PENDING' },
          include: { medication: true },
        })
        generatedLogs.push(log)
      }
    }
    return ok(generatedLogs.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)))
  }

  return ok(logs)
})

const logSchema = z.object({
  medicationId: z.string(),
  familyMemberId: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  status: z.enum(['TAKEN', 'MISSED', 'PENDING']),
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json()
  const data = logSchema.parse(body)

  const member = await prisma.familyMember.findUnique({ where: { id: data.familyMemberId } })
  if (!member || member.userId !== userId) return err('Not found', 404)

  const date = new Date(data.scheduledDate)
  date.setHours(0, 0, 0, 0)

  const log = await prisma.medicationLog.upsert({
    where: {
      medicationId_scheduledDate_scheduledTime: {
        medicationId: data.medicationId,
        scheduledDate: date,
        scheduledTime: data.scheduledTime,
      },
    },
    update: {
      status: data.status,
      takenAt: data.status === 'TAKEN' ? new Date() : null,
    },
    create: {
      medicationId: data.medicationId,
      familyMemberId: data.familyMemberId,
      scheduledDate: date,
      scheduledTime: data.scheduledTime,
      status: data.status,
      takenAt: data.status === 'TAKEN' ? new Date() : undefined,
    },
    include: { medication: true },
  })

  // Decrement dosesRemaining when taken
  if (data.status === 'TAKEN') {
    await prisma.medication.updateMany({
      where: { id: data.medicationId, dosesRemaining: { gt: 0 } },
      data: { dosesRemaining: { decrement: 1 } },
    })
  }

  return ok(log)
})

// GET /api/medication-logs/adherence?memberId=&days=7
export async function adherence(memberId: string, days: number, userId: string) {
  const member = await prisma.familyMember.findUnique({ where: { id: memberId } })
  if (!member || member.userId !== userId) return null

  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  const logs = await prisma.medicationLog.findMany({
    where: { familyMemberId: memberId, scheduledDate: { gte: from }, status: { not: 'PENDING' } },
  })

  const taken = logs.filter(l => l.status === 'TAKEN').length
  const total = logs.length
  const rate = total === 0 ? 100 : Math.round((taken / total) * 100)

  return { taken, missed: total - taken, total, rate }
}
