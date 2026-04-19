import Link from 'next/link'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const testResults = [
  {
    id: 1,
    label: 'HbA1c',
    value: '5.6',
    unit: '%',
    sub: 'Normal range: < 5.7%',
    subColor: 'text-secondary',
    trend: 'trending_down',
    trendColor: 'text-secondary',
    borderColor: 'border-l-secondary',
    status: 'normal',
  },
  {
    id: 2,
    label: 'Blood Pressure',
    value: '128/82',
    unit: 'mmHg',
    sub: 'Target: < 130/80',
    subColor: 'text-on-surface-variant',
    trend: 'remove',
    trendColor: 'text-primary',
    borderColor: 'border-l-primary',
    status: 'normal',
  },
  {
    id: 3,
    label: 'LDL Cholesterol',
    value: '142',
    unit: 'mg/dL',
    sub: 'Elevated (Alert)',
    subColor: 'text-error',
    trend: 'trending_up',
    trendColor: 'text-error',
    borderColor: 'border-l-error',
    status: 'alert',
  },
  {
    id: 4,
    label: 'Resting HR',
    value: '64',
    unit: 'bpm',
    sub: 'Improved',
    subColor: 'text-secondary',
    trend: 'trending_down',
    trendColor: 'text-secondary',
    borderColor: 'border-l-secondary',
    status: 'normal',
  },
]

const medications = [
  { name: 'Lisinopril', dose: '10mg Oral Tablet • Daily' },
  { name: 'Metformin', dose: '500mg Oral Tablet • BID' },
  { name: 'Atorvastatin', dose: '20mg Oral Tablet • Bedtime' },
]

const conditions = ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia']

const allergies = [
  { name: 'Penicillin', severity: 'SEVERE', color: 'bg-error text-white' },
  { name: 'Latex', severity: 'MODERATE', color: 'bg-amber-500 text-white' },
]

const visits = [
  {
    date: 'MAR 14, 2024',
    title: 'Routine Follow-up',
    note: 'HbA1c review. Recommended slight increase in daily aerobic activity. Patient reporting fatigue.',
  },
  {
    date: 'JAN 08, 2024',
    title: 'Lab Review',
    note: 'Lipid panel analyzed. Initiated Atorvastatin 20mg. Patient educated on low-sodium diet.',
  },
  {
    date: 'OCT 22, 2023',
    title: 'Annual Physical',
    note: 'Overall stable. Vision screening normal. Cardiac stress test scheduled and completed.',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-28">
      <TopBar />

      <main className="px-5 pt-8 max-w-5xl mx-auto">
        {/* Patient Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-10 gap-6">
          <div>
            <p className="label-caps mb-2">PATIENT PROFILE</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">
              Alexander J. Richardson
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface">
                DOB: Oct 12, 1978 (45y)
              </span>
              <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface">
                ID: #HS-9921-X
              </span>
              <span className="status-badge-stable">Stable Status</span>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="btn-secondary text-sm">
              <span className="material-symbols-outlined text-sm">share</span>
              Export
            </button>
            <button className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">print</span>
              Print Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Test Results */}
            <section>
              <p className="label-caps mb-4">RECENT TEST RESULTS</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testResults.map((result) => (
                  <div key={result.id} className={`card p-5 border-l-4 ${result.borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-on-surface">{result.label}</span>
                      <span className={`material-symbols-outlined text-xl ${result.trendColor}`}>
                        {result.trend}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-extrabold tracking-tight text-on-surface">{result.value}</span>
                      <span className="text-sm font-medium text-on-surface-variant">{result.unit}</span>
                    </div>
                    <p className={`text-xs font-semibold ${result.subColor}`}>{result.sub}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Current Medications */}
            <section className="card p-6">
              <p className="label-caps mb-4">CURRENT MEDICATIONS</p>
              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.name} className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors">
                    <div>
                      <p className="font-bold text-on-surface">{med.name}</p>
                      <p className="text-sm text-on-surface-variant">{med.dose}</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">medication</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Active Conditions */}
            <section>
              <p className="label-caps mb-4">ACTIVE CONDITIONS</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {conditions.map((c) => (
                  <span key={c} className="px-4 py-2 rounded-full bg-surface-container text-sm font-semibold text-on-surface border border-outline-variant/50">
                    {c}
                  </span>
                ))}
              </div>

              {/* Critical Allergies */}
              <div className="rounded-2xl p-5 border border-error/20 bg-error-container/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined material-symbols-filled text-error">warning</span>
                  <p className="label-caps text-error">CRITICAL ALLERGIES</p>
                </div>
                <div className="space-y-3">
                  {allergies.map((a) => (
                    <div key={a.name} className="flex items-center justify-between">
                      <span className="font-bold text-error">{a.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.color}`}>{a.severity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            <section className="card p-5">
              <p className="label-caps mb-5">LAST 3 VISITS</p>
              <div className="space-y-5">
                {visits.map((visit, i) => (
                  <div key={visit.date} className="relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${i === 0 ? 'bg-primary' : 'bg-outline-variant'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">{visit.date}</p>
                        <p className="font-bold text-on-surface mb-2">{visit.title}</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{visit.note}</p>
                        <button className="px-4 py-2 rounded-xl bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-variant transition-colors">
                          View Notes
                        </button>
                      </div>
                    </div>
                    {i < visits.length - 1 && (
                      <div className="absolute left-1.5 top-4 bottom-0 w-px bg-outline-variant/50" style={{ height: 'calc(100% + 8px)' }} />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Attending Physician */}
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tertiary/20 to-tertiary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">stethoscope</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">ATTENDING PHYSICIAN</p>
                <p className="font-bold text-on-surface">Dr. Sarah Vance</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
