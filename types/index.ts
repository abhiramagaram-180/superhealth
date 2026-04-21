// types/index.ts

export interface FamilyMember {
  id: string
  name: string
  role?: string | null
  dateOfBirth?: string | null
  bloodType?: string | null
  status: 'STABLE' | 'CRITICAL' | 'MONITORING'
  avatarInitials?: string | null
  avatarColor?: string | null
  createdAt: string
}

export interface ClinicalRecord {
  id: string
  familyMemberId: string
  visitDate: string
  facility?: string | null
  physicianName?: string | null
  visitType: 'RECORD' | 'REPORT' | 'URGENT_CARE'
  summary?: string | null
  prescriptions?: Prescription[]
  attachments?: Attachment[]
  familyMember?: Pick<FamilyMember, 'id' | 'name'>
}

export interface Prescription {
  id: string
  medicationName: string
  dosage?: string | null
  frequency?: string | null
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
  fileSize?: number | null
}

export interface Medication {
  id: string
  familyMemberId: string
  name: string
  dosage?: string | null
  form?: string | null
  frequency?: string | null
  scheduleTimes?: string | null   // JSON string
  instructions?: string | null
  timeOfDay?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'BEDTIME' | null
  color?: string | null
  icon?: string | null
  dosesRemaining?: number | null
  refillThreshold?: number | null
  isActive: boolean
}

export interface MedicationLog {
  id: string
  medicationId: string
  medication: Medication
  scheduledTime: string
  scheduledDate: string
  takenAt?: string | null
  status: 'TAKEN' | 'MISSED' | 'PENDING'
}

export interface Condition {
  id: string
  name: string
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING'
  diagnosedDate?: string | null
  notes?: string | null
}

export interface Allergy {
  id: string
  name: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE'
  reaction?: string | null
}

export interface LabReport {
  id: string
  familyMemberId: string
  title: string
  category: 'BLOOD_WORK' | 'RADIOLOGY' | 'VACCINATION' | 'OTHER'
  labName?: string | null
  physicianName?: string | null
  reportDate: string
  status: 'NORMAL' | 'FOLLOW_UP_NEEDED' | 'CRITICAL' | 'PENDING'
  summary?: string | null
  fileUrl?: string | null
  testResults?: TestResult[]
}

export interface TestResult {
  id: string
  name: string
  value: string
  unit?: string | null
  normalRange?: string | null
  trend?: 'UP' | 'DOWN' | 'STABLE' | null
  status: 'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL'
}

export interface DashboardData {
  member: FamilyMember
  conditions: Condition[]
  allergies: Allergy[]
  medications: Medication[]
  recentRecords: ClinicalRecord[]
  latestReport: LabReport | null
  refillAlerts: Medication[]
  adherence: { taken: number; missed: number; total: number; rate: number }
}

export interface ApiResponse<T> {
  data: T
}
