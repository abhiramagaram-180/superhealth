'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const weekDays = [
  { day: 'MON', date: 11 },
  { day: 'TUE', date: 12 },
  { day: 'WED', date: 13 },
  { day: 'THU', date: 14 },
  { day: 'FRI', date: 15 },
  { day: 'SAT', date: 16 },
  { day: 'SUN', date: 17 },
]

type CheckedState = { [key: number]: boolean }

const morningMeds = [
  { id: 1, name: 'Lisinopril', dose: '10mg', qty: '1 Tablet', time: '08:00 AM', note: 'Take with food', noteIcon: 'restaurant', iconBg: 'bg-amber-100 text-amber-700', icon: 'medication' },
  { id: 2, name: 'Multi-Vitamin', dose: 'Adult Daily', qty: '1 Capsule', time: '08:30 AM', note: null, iconBg: 'bg-orange-100 text-orange-700', icon: 'local_pharmacy' },
]

const afternoonMeds = [
  { id: 3, name: 'Systane Drops', dose: 'Both eyes', qty: '2 Drops', time: '02:00 PM', note: null, iconBg: 'bg-blue-100 text-blue-700', icon: 'water_drop' },
]

const eveningMeds = [
  { id: 4, name: 'Atorvastatin', dose: '20mg', qty: '1 Tablet', time: '09:00 PM', note: null, iconBg: 'bg-indigo-100 text-indigo-700', icon: 'bedtime', locked: true },
]

export default function MedsPage() {
  const [activeDay, setActiveDay] = useState(12)
  const [checked, setChecked] = useState<CheckedState>({ 2: true })

  const toggle = (id: number) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
            <h2 className="font-bold text-on-surface text-lg">November 2024</h2>
            <div className="flex gap-2">
              {(['chevron_left', 'chevron_right'] as const).map(icon => (
                <button key={icon} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container border border-outline-variant hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-sm">{icon}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(({ day, date }) => (
              <button key={date}
                onClick={() => setActiveDay(date)}
                className={`flex flex-col items-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                  activeDay === date
                    ? 'text-white shadow-card'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
                style={activeDay === date ? { background: 'linear-gradient(135deg, #00458f, #005cbb)' } : {}}>
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{day}</span>
                <span className="text-lg font-extrabold">{date}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule */}
          <div className="lg:col-span-2 space-y-8">
            {/* Morning */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 rounded-full bg-amber-400" />
                <p className="label-caps">MORNING SCHEDULE</p>
              </div>
              <div className="space-y-3">
                {morningMeds.map(med => (
                  <div key={med.id} className="card p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${med.iconBg}`}>
                      <span className="material-symbols-outlined material-symbols-filled">{med.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{med.name}</p>
                      <p className="text-sm text-on-surface-variant">{med.dose} • {med.qty}</p>
                      {med.note && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-xs text-on-surface-variant">{med.noteIcon}</span>
                          <span className="text-xs text-on-surface-variant">{med.note}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-primary">{med.time}</span>
                      <button onClick={() => toggle(med.id)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                          checked[med.id]
                            ? 'bg-secondary text-white shadow-sm'
                            : 'border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-white'
                        }`}>
                        <span className="material-symbols-outlined text-sm material-symbols-filled">
                          {checked[med.id] ? 'check_circle' : 'check'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 rounded-full bg-primary" />
                <p className="label-caps">AFTERNOON SCHEDULE</p>
              </div>
              <div className="space-y-3">
                {afternoonMeds.map(med => (
                  <div key={med.id} className="card p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${med.iconBg}`}>
                      <span className="material-symbols-outlined material-symbols-filled">{med.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{med.name}</p>
                      <p className="text-sm text-on-surface-variant">{med.dose} • {med.qty}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-primary">{med.time}</span>
                      <button onClick={() => toggle(med.id)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                          checked[med.id]
                            ? 'bg-secondary text-white'
                            : 'border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-white'
                        }`}>
                        <span className="material-symbols-outlined text-sm material-symbols-filled">
                          {checked[med.id] ? 'check_circle' : 'check'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening */}
            <div className="opacity-75">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 rounded-full bg-indigo-400" />
                <p className="label-caps">EVENING SCHEDULE</p>
              </div>
              <div className="space-y-3">
                {eveningMeds.map(med => (
                  <div key={med.id} className="card p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${med.iconBg}`}>
                      <span className="material-symbols-outlined material-symbols-filled">{med.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{med.name}</p>
                      <p className="text-sm text-on-surface-variant">{med.dose} • {med.qty}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-on-surface-variant">{med.time}</span>
                      <button className="w-11 h-11 rounded-full border-2 border-outline flex items-center justify-center text-outline cursor-not-allowed bg-surface-container">
                        <span className="material-symbols-outlined text-sm">lock</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Refill Alerts */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-error material-symbols-filled">notification_important</span>
                <h3 className="font-bold text-on-surface">Refill Alerts</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-error rounded-full mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Lisinopril</p>
                    <p className="text-sm text-on-surface-variant mb-3">3 doses left</p>
                    <button className="w-full px-4 py-2 rounded-xl bg-error text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                      Order Now
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-amber-500 rounded-full mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Atorvastatin</p>
                    <p className="text-sm text-on-surface-variant mb-3">7 doses left</p>
                    <button className="w-full px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors">
                      Schedule Pickup
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Adherence Ring */}
            <div className="card p-6">
              <p className="label-caps text-center mb-5">WEEKLY ADHERENCE</p>
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#eceef0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#006b5f"
                      strokeWidth="8" strokeDasharray="264" strokeDashoffset="26.4"
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-on-surface">90%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant text-center leading-relaxed">
                You&apos;ve missed only 1 dose in the last 7 days. Great job!
              </p>
            </div>

            {/* Primary Pharmacy */}
            <div className="card overflow-hidden relative aspect-video sm:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 0, transparent 50%)',
                  backgroundSize: '20px 20px'
                }} />
              </div>
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
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
