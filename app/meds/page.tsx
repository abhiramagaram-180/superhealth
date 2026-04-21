'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFetch, apiFetch } from '@/lib/hooks'
import type { MedicationLog, FamilyMember } from '@/types'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN']

function getWeek() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // week starts Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(diff + i)
    return { label: DAYS[i], date: d.getDate(), full: d }
  })
}

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function MedsPage() {
  const params = useSearchParams()
  const memberId = params.get('memberId')
  const { data: members } = useFetch<FamilyMember[]>('/api/family-members')
  const activeMemberId = memberId ?? members?.[0]?.id ?? null

  const week = getWeek()
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const [selectedIdx, setSelectedIdx] = useState(todayIdx)
  const selectedDate = toDateStr(week[selectedIdx].full)

  const { data: logs, loading, refetch } = useFetch<MedicationLog[]>(
    activeMemberId ? `/api/medication-logs?memberId=${activeMemberId}&date=${selectedDate}` : null
  )

  const toggle = async (log: MedicationLog) => {
    if (!activeMemberId) return
    const newStatus = log.status === 'TAKEN' ? 'PENDING' : 'TAKEN'
    try {
      await apiFetch('/api/medication-logs', {
        method: 'POST',
        body: JSON.stringify({
          medicationId: log.medicationId,
          familyMemberId: activeMemberId,
          scheduledDate: selectedDate,
          scheduledTime: log.scheduledTime,
          status: newStatus,
        }),
      })
      refetch()
    } catch (e) { console.error(e) }
  }

  const sections = [
    { label: 'MORNING SCHEDULE', key: 'MORNING', color: 'bg-amber-400' },
    { label: 'AFTERNOON SCHEDULE', key: 'AFTERNOON', color: 'bg-primary' },
    { label: 'EVENING SCHEDULE', key: 'EVENING', color: 'bg-indigo-400' },
    { label: 'BEDTIME', key: 'BEDTIME', color: 'bg-slate-500' },
  ]

  const grouped = sections.map(s => ({
    ...s,
    logs: (logs ?? []).filter(l => l.medication.timeOfDay === s.key),
  })).filter(s => s.logs.length > 0)

  const taken = (logs ?? []).filter(l => l.status === 'TAKEN').length
  const total = (logs ?? []).length
  const rate = total === 0 ? 100 : Math.round((taken / total) * 100)

  const refillAlerts = (logs ?? [])
    .filter(l => (l.medication.dosesRemaining ?? 99) <= (l.medication.refillThreshold ?? 7))
    .map(l => l.medication)
    .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)

  return (
    <div className="min-h-screen pb-28">
      <TopBar />
      <main className="px-5 pt-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="label-caps mb-2">CURRENT REGIMEN</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
              Medication<br />Sanctuary.
            </h1>
          </div>
          <button className="btn-primary shrink-0 text-sm">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Add Medication
          </button>
        </div>

        {/* Calendar */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-on-surface text-lg">
              {week[selectedIdx].full.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {week.map(({ label, date }, i) => (
              <button key={i} onClick={() => setSelectedIdx(i)}
                className={`flex flex-col items-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                  selectedIdx === i ? 'text-white shadow-card' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
                style={selectedIdx === i ? { background: 'linear-gradient(135deg, #00458f, #005cbb)' } : {}}>
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{label}</span>
                <span className="text-lg font-extrabold">{date}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-surface-container" />)}
              </div>
            ) : grouped.length === 0 ? (
              <div className="card p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">medication</span>
                <p className="font-semibold text-on-surface">No medications scheduled for this day.</p>
              </div>
            ) : (
              grouped.map(section => (
                <div key={section.key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-1.5 h-6 rounded-full ${section.color}`} />
                    <p className="label-caps">{section.label}</p>
                  </div>
                  <div className="space-y-3">
                    {section.logs.map(log => {
                      const isPast = selectedDate < toDateStr(new Date())
                      return (
                        <div key={log.id} className={`card p-5 flex items-center gap-4 ${isPast && log.status !== 'TAKEN' ? 'opacity-60' : ''}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${log.medication.color ?? 'bg-surface-container text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined material-symbols-filled">{log.medication.icon ?? 'medication'}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-on-surface">{log.medication.name}</p>
                            <p className="text-sm text-on-surface-variant">
                              {[log.medication.dosage, log.medication.form].filter(Boolean).join(' • ')}
                            </p>
                            {log.medication.instructions && (
                              <p className="text-xs text-on-surface-variant mt-0.5">
                                <span className="material-symbols-outlined text-xs mr-0.5">info</span>
                                {log.medication.instructions}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-bold ${log.status === 'TAKEN' ? 'text-secondary' : 'text-primary'}`}>
                              {log.scheduledTime.replace(':','').replace(/^(\d{2})(\d{2})$/, (_, h, m) => {
                                const hr = parseInt(h)
                                return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
                              })}
                            </span>
                            <button onClick={() => toggle(log)}
                              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                                log.status === 'TAKEN'
                                  ? 'bg-secondary text-white shadow-sm'
                                  : 'border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-white'
                              }`}>
                              <span className="material-symbols-outlined text-sm material-symbols-filled">
                                {log.status === 'TAKEN' ? 'check_circle' : 'check'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Refill alerts */}
            {refillAlerts.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-error material-symbols-filled">notification_important</span>
                  <h3 className="font-bold text-on-surface">Refill Alerts</h3>
                </div>
                <div className="space-y-5">
                  {refillAlerts.map(med => (
                    <div key={med.id} className="flex items-start gap-3">
                      <div className={`w-1.5 h-12 rounded-full mt-1 shrink-0 ${(med.dosesRemaining ?? 0) <= 3 ? 'bg-error' : 'bg-amber-500'}`} />
                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{med.name}</p>
                        <p className="text-sm text-on-surface-variant mb-3">{med.dosesRemaining} doses left</p>
                        <button className={`w-full px-4 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-colors ${(med.dosesRemaining ?? 0) <= 3 ? 'bg-error hover:bg-red-700' : 'bg-primary hover:bg-primary-container'}`}>
                          {(med.dosesRemaining ?? 0) <= 3 ? 'Order Now' : 'Schedule Pickup'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adherence */}
            <div className="card p-6">
              <p className="label-caps text-center mb-5">TODAY&apos;S ADHERENCE</p>
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#eceef0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#006b5f"
                      strokeWidth="8" strokeDasharray="264"
                      strokeDashoffset={264 - (264 * (rate / 100))}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-on-surface">{rate}%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant text-center leading-relaxed">
                {total === 0 ? 'No doses scheduled.' : `${taken} of ${total} doses taken today.`}
              </p>
            </div>

            {/* Primary Pharmacy */}
            <div className="card overflow-hidden relative" style={{ minHeight: 180 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
              }} />
              <div className="relative p-5 flex flex-col justify-end" style={{ minHeight: 180 }}>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">PRIMARY PHARMACY</p>
                <h4 className="text-white text-lg font-bold mb-4">Sanctuary Health Center</h4>
                <div className="flex gap-2">
                  {(['phone', 'directions'] as const).map(icon => (
                    <button key={icon} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg">
                      <span className="material-symbols-outlined text-primary material-symbols-filled text-sm">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
