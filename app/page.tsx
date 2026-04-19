import Link from 'next/link'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const familyMembers = [
  {
    id: 1,
    name: 'John',
    role: 'Primary Account',
    status: 'STABLE',
    statusColor: 'stable',
    lastUpdate: 'LAST CHECK-UP',
    updateText: 'Cardiology review completed 2 weeks ago. All metrics within optimal range.',
    initials: 'JR',
    color: 'from-blue-200 to-blue-300',
  },
  {
    id: 2,
    name: 'Sarah',
    role: '',
    status: null,
    lastUpdate: 'NEXT REMINDER',
    updateText: 'Flu shot scheduled',
    updateSub: 'Monday, 10:00 AM',
    initials: 'SR',
    color: 'from-rose-200 to-rose-300',
  },
  {
    id: 3,
    name: 'Little Timmy',
    role: '',
    status: null,
    lastUpdate: 'RECENT UPDATE',
    updateText: 'Growth chart updated yesterday by Dr. Aris. 95th percentile height.',
    initials: 'TM',
    color: 'from-amber-200 to-amber-300',
  },
]

const recentActivity = [
  { id: 1, icon: 'science', iconBg: 'bg-blue-100 text-blue-700', text: "Sarah's annual screening is ready for review.", time: 'TODAY', timeColor: 'text-primary' },
  { id: 2, icon: 'medication', iconBg: 'bg-secondary-container text-on-secondary-container', text: 'Prescription Refilled — Vitamin D3 supply updated for Timmy.', time: 'YESTERDAY', timeColor: 'text-on-surface-variant' },
  { id: 3, icon: 'event', iconBg: 'bg-surface-container-high text-on-surface-variant', text: 'Appointment Confirmed — Dental cleaning for John on Oct 24th.', time: '2 DAYS AGO', timeColor: 'text-on-surface-variant' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen pb-28">
      <TopBar />

      <main className="px-5 pt-8 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="mb-10">
          <p className="label-caps mb-2">WELCOME BACK</p>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-on-surface">
            Your family&apos;s health,{' '}
            <span className="text-primary">perfectly<br />curated.</span>
          </h1>
        </div>

        {/* Profile Selector */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="label-caps">SELECT PROFILE</p>
            <button className="px-4 py-2 rounded-full bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-variant transition-colors">
              Manage Family
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {familyMembers.map((member) => (
              <Link key={member.id} href="/dashboard"
                className={`card p-5 cursor-pointer hover:shadow-card transition-all duration-200 active:scale-98 ${
                  member.id === 1 ? 'col-span-2 sm:col-span-1' : ''
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-sm text-on-surface`}>
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{member.name}</p>
                      {member.role && <p className="text-xs text-on-surface-variant">{member.role}</p>}
                    </div>
                  </div>
                  {member.status && (
                    <span className="status-badge-stable">{member.status}</span>
                  )}
                </div>
                <div>
                  <p className="label-caps mb-1">{member.lastUpdate}</p>
                  <p className="text-sm text-on-surface leading-relaxed">{member.updateText}</p>
                  {member.updateSub && (
                    <p className="text-sm font-semibold text-primary mt-0.5">{member.updateSub}</p>
                  )}
                </div>
              </Link>
            ))}

            {/* CTA Cards */}
            <Link href="/add"
              className="rounded-3xl p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] cursor-pointer active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #00458f, #005cbb)' }}>
              <span className="material-symbols-outlined material-symbols-filled text-white text-3xl">add_circle</span>
              <span className="text-white font-bold text-lg">Add Record</span>
            </Link>

            <Link href="/reports"
              className="rounded-3xl p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] cursor-pointer active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #006b5f, #00897b)' }}>
              <span className="material-symbols-outlined material-symbols-filled text-white text-3xl">folder_open</span>
              <span className="text-white font-bold text-lg">View Lab Results</span>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-6">
          <p className="label-caps mb-5">RECENT ACTIVITY</p>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{item.text}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${item.timeColor}`}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
