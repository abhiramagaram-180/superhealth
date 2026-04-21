'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useFetch } from '@/lib/hooks'
import type { FamilyMember } from '@/types'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'

function age(dob?: string | null) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

export default function HomePage() {
  const { data: session } = useSession()
  const { data: members, loading, refetch } = useFetch<FamilyMember[]>('/api/family-members')

  const recentActivity = [
    { id: 1, icon: 'science', iconBg: 'bg-blue-100 text-blue-700', text: "Annual screening ready for review.", time: 'TODAY', timeColor: 'text-primary' },
    { id: 2, icon: 'medication', iconBg: 'bg-secondary-container text-on-secondary-container', text: 'Prescription Refilled — Vitamin D3 supply updated.', time: 'YESTERDAY', timeColor: 'text-on-surface-variant' },
    { id: 3, icon: 'event', iconBg: 'bg-surface-container-high text-on-surface-variant', text: 'Appointment Confirmed — Dental cleaning on Oct 24th.', time: '2 DAYS AGO', timeColor: 'text-on-surface-variant' },
  ]

  return (
    <div className="min-h-screen pb-28">
      <TopBar
        rightContent={
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-on-surface text-xl">notifications</span>
            </button>
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </button>
          </div>
        }
      />

      <main className="px-5 pt-8 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="mb-10">
          <p className="label-caps mb-2">WELCOME BACK{session?.user?.name ? `, ${session.user.name.split(' ')[0].toUpperCase()}` : ''}</p>
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

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-5 h-36 animate-pulse bg-surface-container" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {members?.map((member, idx) => (
                <Link key={member.id} href={`/dashboard?memberId=${member.id}`}
                  className={`card p-5 cursor-pointer hover:shadow-card transition-all duration-200 active:scale-98 ${idx === 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.avatarColor ?? 'from-blue-200 to-blue-300'} flex items-center justify-center font-bold text-sm text-on-surface`}>
                        {member.avatarInitials ?? member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{member.name}</p>
                        {member.role && <p className="text-xs text-on-surface-variant">{member.role}</p>}
                      </div>
                    </div>
                    {member.status === 'STABLE' && (
                      <span className="status-badge-stable">STABLE</span>
                    )}
                    {member.status === 'CRITICAL' && (
                      <span className="status-badge-critical">CRITICAL</span>
                    )}
                  </div>
                  <div>
                    <p className="label-caps mb-1">PROFILE</p>
                    <p className="text-sm text-on-surface">
                      {member.dateOfBirth ? `Age ${age(member.dateOfBirth)}` : 'No DOB set'}
                      {member.bloodType ? ` · Blood type ${member.bloodType}` : ''}
                    </p>
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
          )}
        </section>

        {/* Recent Activity */}
        <section className="mb-6">
          <p className="label-caps mb-5">RECENT ACTIVITY</p>
          <div className="space-y-3">
            {recentActivity.map(item => (
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
