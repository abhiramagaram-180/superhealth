// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean slate
  await prisma.medicationLog.deleteMany()
  await prisma.testResult.deleteMany()
  await prisma.labReport.deleteMany()
  await prisma.allergy.deleteMany()
  await prisma.condition.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.clinicalRecord.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.familyMember.deleteMany()
  await prisma.user.deleteMany()

  // ── User ──────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'demo@healthsanctuary.com',
      name: 'John Richardson',
      passwordHash,
    },
  })
  console.log(`✅ Created user: ${user.email}`)

  // ── Family Members ────────────────────────────────────────────────────────
  const john = await prisma.familyMember.create({
    data: {
      userId: user.id,
      name: 'John Richardson',
      role: 'Primary Account',
      dateOfBirth: new Date('1978-10-12'),
      bloodType: 'O+',
      status: 'STABLE',
      avatarInitials: 'JR',
      avatarColor: 'from-blue-200 to-blue-300',
    },
  })

  const sarah = await prisma.familyMember.create({
    data: {
      userId: user.id,
      name: 'Sarah Richardson',
      role: 'Spouse',
      dateOfBirth: new Date('1981-03-22'),
      bloodType: 'A+',
      status: 'STABLE',
      avatarInitials: 'SR',
      avatarColor: 'from-rose-200 to-rose-300',
    },
  })

  const timmy = await prisma.familyMember.create({
    data: {
      userId: user.id,
      name: 'Little Timmy',
      role: 'Child',
      dateOfBirth: new Date('2016-07-04'),
      bloodType: 'A+',
      status: 'STABLE',
      avatarInitials: 'TM',
      avatarColor: 'from-amber-200 to-amber-300',
    },
  })
  console.log(`✅ Created ${3} family members`)

  // ── Conditions ────────────────────────────────────────────────────────────
  await prisma.condition.createMany({
    data: [
      { familyMemberId: john.id, name: 'Type 2 Diabetes', diagnosedDate: new Date('2019-06-01'), status: 'ACTIVE' },
      { familyMemberId: john.id, name: 'Hypertension', diagnosedDate: new Date('2020-02-15'), status: 'ACTIVE' },
      { familyMemberId: john.id, name: 'Hyperlipidemia', diagnosedDate: new Date('2021-08-10'), status: 'ACTIVE' },
      { familyMemberId: sarah.id, name: 'Seasonal Allergies', diagnosedDate: new Date('2015-04-01'), status: 'MONITORING' },
    ],
  })

  // ── Allergies ─────────────────────────────────────────────────────────────
  await prisma.allergy.createMany({
    data: [
      { familyMemberId: john.id, name: 'Penicillin', severity: 'SEVERE', reaction: 'Anaphylaxis' },
      { familyMemberId: john.id, name: 'Latex', severity: 'MODERATE', reaction: 'Contact dermatitis' },
      { familyMemberId: sarah.id, name: 'Shellfish', severity: 'MODERATE', reaction: 'Hives, swelling' },
      { familyMemberId: timmy.id, name: 'Peanuts', severity: 'SEVERE', reaction: 'Anaphylaxis' },
    ],
  })
  console.log('✅ Created conditions and allergies')

  // ── Medications ───────────────────────────────────────────────────────────
  const lisinopril = await prisma.medication.create({
    data: {
      familyMemberId: john.id,
      name: 'Lisinopril',
      dosage: '10mg',
      form: 'Oral Tablet',
      frequency: 'Daily',
      scheduleTimes: JSON.stringify(['08:00']),
      instructions: 'Take with food',
      timeOfDay: 'MORNING',
      color: 'bg-amber-100 text-amber-700',
      icon: 'medication',
      dosesRemaining: 3,
      refillThreshold: 7,
    },
  })

  const multivitamin = await prisma.medication.create({
    data: {
      familyMemberId: john.id,
      name: 'Multi-Vitamin',
      dosage: 'Adult Daily',
      form: 'Capsule',
      frequency: 'Daily',
      scheduleTimes: JSON.stringify(['08:30']),
      timeOfDay: 'MORNING',
      color: 'bg-orange-100 text-orange-700',
      icon: 'local_pharmacy',
      dosesRemaining: 45,
    },
  })

  const systane = await prisma.medication.create({
    data: {
      familyMemberId: john.id,
      name: 'Systane Drops',
      dosage: 'Both eyes',
      form: 'Drops',
      frequency: 'Daily',
      scheduleTimes: JSON.stringify(['14:00']),
      timeOfDay: 'AFTERNOON',
      color: 'bg-blue-100 text-blue-700',
      icon: 'water_drop',
      dosesRemaining: 20,
    },
  })

  const atorvastatin = await prisma.medication.create({
    data: {
      familyMemberId: john.id,
      name: 'Atorvastatin',
      dosage: '20mg',
      form: 'Oral Tablet',
      frequency: 'Daily',
      scheduleTimes: JSON.stringify(['21:00']),
      timeOfDay: 'EVENING',
      color: 'bg-indigo-100 text-indigo-700',
      icon: 'bedtime',
      dosesRemaining: 7,
      refillThreshold: 7,
    },
  })

  const metformin = await prisma.medication.create({
    data: {
      familyMemberId: john.id,
      name: 'Metformin',
      dosage: '500mg',
      form: 'Oral Tablet',
      frequency: 'BID',
      scheduleTimes: JSON.stringify(['08:00', '20:00']),
      instructions: 'Take with meals',
      timeOfDay: 'MORNING',
      color: 'bg-green-100 text-green-700',
      icon: 'medication',
      dosesRemaining: 30,
    },
  })
  console.log('✅ Created medications')

  // ── Medication Logs (today) ───────────────────────────────────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.medicationLog.createMany({
    data: [
      {
        medicationId: multivitamin.id,
        familyMemberId: john.id,
        scheduledDate: today,
        scheduledTime: '08:30',
        status: 'TAKEN',
        takenAt: new Date(),
      },
      {
        medicationId: lisinopril.id,
        familyMemberId: john.id,
        scheduledDate: today,
        scheduledTime: '08:00',
        status: 'PENDING',
      },
      {
        medicationId: systane.id,
        familyMemberId: john.id,
        scheduledDate: today,
        scheduledTime: '14:00',
        status: 'PENDING',
      },
      {
        medicationId: atorvastatin.id,
        familyMemberId: john.id,
        scheduledDate: today,
        scheduledTime: '21:00',
        status: 'PENDING',
      },
    ],
  })
  console.log('✅ Created medication logs')

  // ── Clinical Records ──────────────────────────────────────────────────────
  const record1 = await prisma.clinicalRecord.create({
    data: {
      familyMemberId: john.id,
      visitDate: new Date('2024-03-14'),
      facility: 'Metro Health Clinic',
      physicianName: 'Dr. Sarah Vance',
      visitType: 'RECORD',
      summary: 'HbA1c review. Recommended slight increase in daily aerobic activity. Patient reporting fatigue. Blood pressure well controlled on current regimen. Discussed dietary modifications for cholesterol management.',
      prescriptions: {
        create: [
          { medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Daily' },
          { medicationName: 'Metformin', dosage: '500mg', frequency: 'BID' },
        ],
      },
    },
  })

  const record2 = await prisma.clinicalRecord.create({
    data: {
      familyMemberId: john.id,
      visitDate: new Date('2024-01-08'),
      facility: 'Metro Health Clinic',
      physicianName: 'Dr. Sarah Vance',
      visitType: 'REPORT',
      summary: 'Lipid panel analyzed. LDL elevated at 142 mg/dL. Initiated Atorvastatin 20mg. Patient educated on low-sodium diet and benefits of omega-3 supplementation.',
      prescriptions: {
        create: [
          { medicationName: 'Atorvastatin', dosage: '20mg', frequency: 'Daily at bedtime' },
        ],
      },
    },
  })

  const record3 = await prisma.clinicalRecord.create({
    data: {
      familyMemberId: john.id,
      visitDate: new Date('2023-10-22'),
      facility: 'Metro Health Clinic',
      physicianName: 'Dr. Sarah Vance',
      visitType: 'RECORD',
      summary: 'Overall stable. Vision screening normal. Cardiac stress test scheduled and completed with satisfactory results. Immunizations up to date.',
    },
  })

  await prisma.clinicalRecord.create({
    data: {
      familyMemberId: john.id,
      visitDate: new Date('2023-08-12'),
      facility: 'City General Hospital',
      physicianName: 'Dr. James Aris',
      visitType: 'RECORD',
      summary: 'Minor grade 2 ankle sprain treated with compression and ice. Prescribed Ibuprofen 400mg for swelling. No fractures detected in X-ray. RICE protocol advised for 2 weeks.',
      prescriptions: {
        create: [
          { medicationName: 'Ibuprofen', dosage: '400mg', frequency: 'TID with food, 14 days' },
        ],
      },
    },
  })
  console.log('✅ Created clinical records')

  // ── Lab Reports ───────────────────────────────────────────────────────────
  const cbcReport = await prisma.labReport.create({
    data: {
      familyMemberId: john.id,
      title: 'CBC & Metabolic Panel',
      category: 'BLOOD_WORK',
      labName: 'LabCorp',
      reportDate: new Date('2023-10-24'),
      status: 'NORMAL',
      summary: 'Glucose levels and white blood cell counts within standard range. Kidney function markers stable.',
    },
  })

  await prisma.testResult.createMany({
    data: [
      { reportId: cbcReport.id, name: 'HbA1c', value: '5.6', unit: '%', normalRange: '< 5.7%', trend: 'DOWN', status: 'NORMAL' },
      { reportId: cbcReport.id, name: 'Blood Pressure', value: '128/82', unit: 'mmHg', normalRange: '< 130/80', trend: 'STABLE', status: 'NORMAL' },
      { reportId: cbcReport.id, name: 'Resting HR', value: '64', unit: 'bpm', normalRange: '60-100', trend: 'DOWN', status: 'NORMAL' },
      { reportId: cbcReport.id, name: 'Creatinine', value: '1.0', unit: 'mg/dL', normalRange: '0.7-1.3', trend: 'STABLE', status: 'NORMAL' },
    ],
  })

  const lipidReport = await prisma.labReport.create({
    data: {
      familyMemberId: john.id,
      title: 'Lipid Profile',
      category: 'BLOOD_WORK',
      labName: 'General Medical',
      reportDate: new Date('2023-08-12'),
      status: 'FOLLOW_UP_NEEDED',
      summary: 'LDL Cholesterol slightly elevated at 142 mg/dL. Consultation recommended. HDL within acceptable range.',
    },
  })

  await prisma.testResult.createMany({
    data: [
      { reportId: lipidReport.id, name: 'LDL Cholesterol', value: '142', unit: 'mg/dL', normalRange: '< 100', trend: 'UP', status: 'ELEVATED' },
      { reportId: lipidReport.id, name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', normalRange: '> 40', trend: 'STABLE', status: 'NORMAL' },
      { reportId: lipidReport.id, name: 'Triglycerides', value: '148', unit: 'mg/dL', normalRange: '< 150', trend: 'DOWN', status: 'NORMAL' },
    ],
  })

  await prisma.labReport.create({
    data: {
      familyMemberId: john.id,
      title: 'Chest X-Ray (Posterior-Anterior)',
      category: 'RADIOLOGY',
      labName: 'Regional Imaging Center',
      physicianName: 'Dr. Sarah Jenkins',
      reportDate: new Date('2023-10-22'),
      status: 'NORMAL',
      summary: 'Lung fields clear. No active cardiopulmonary disease identified. Heart size normal.',
    },
  })

  await prisma.labReport.createMany({
    data: [
      {
        familyMemberId: john.id,
        title: 'Influenza (Flu) Annual',
        category: 'VACCINATION',
        labName: 'CVS Pharmacy #423',
        reportDate: new Date('2023-10-12'),
        status: 'NORMAL',
        summary: 'Quadrivalent influenza vaccine administered. Lot #FL2023-04.',
      },
      {
        familyMemberId: john.id,
        title: 'Tdap Booster',
        category: 'VACCINATION',
        labName: 'Health Sanctuary Clinic',
        reportDate: new Date('2023-06-20'),
        status: 'NORMAL',
        summary: 'Tetanus, diphtheria, pertussis booster. 10-year immunity.',
      },
    ],
  })
  console.log('✅ Created lab reports and test results')

  console.log('\n🎉 Seed complete!')
  console.log('──────────────────────────────')
  console.log('Demo credentials:')
  console.log('  Email:    demo@healthsanctuary.com')
  console.log('  Password: password123')
  console.log('──────────────────────────────')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
