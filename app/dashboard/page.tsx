'use client'

import { useSearchParams } from 'next/navigation'
import { useFetch } from '@/lib/hooks'
import type { DashboardData } from '@/types'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'

function trendIcon(t?: string | null) {
  if (t === 'UP') return 'trending_up'
  if (t === 'DOWN') return 'trending_down'
  return 'remove'
}
function trendColor(status: string) {
  if (status === 'ELEVATED' || status === 'CRITICAL') return 'text-error'
  if (status === 'LOW') return 'text-amber-600'
  return 'text-secondary'
}
function borderColor(status: string) {
  if (status === 'ELEVATED' || status === 'CRITICAL') return 'border-l-error'
  if (status === 'LOW') return 'border-l-amber-500'
  return 'border-l-secondary'
}

export default function DashboardPage() {
  const params = useSearchParams()
  const memberId = params.get('memberId')
  const { data, loading } = useFetch<DashboardData>(memberId ? `/api/dashboard/${memberId}` : null)

  const d = data

  if (!memberId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">No member selected.</p>
          <Link href="/" className="btn-primary inline-flex">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28">
      <TopBar />
      <main className="px-5 pt-8 max-w-5xl mx-auto">

        {loading || !d ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="card h-32 animate-pulse bg-surface-container" />)}
          </div>
        ) : (
          <>
            {/* Patient Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-10 gap-6">
              <div>
                <p className="label-caps mb-2">PATIENT PROFILE</p>
                <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">{d.member.name}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  {d.member.dateOfBirth && (
                    <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface">
                      DOB: {new Date(d.member.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  {d.member.bloodType && (
                    <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface">
                      Blood Type: {d.member.bloodType}
                    </span>
                  )}
                  {d.member.status === 'STABLE' && <span className="status-badge-stable">Stable Status</span>}
                  {d.member.status === 'CRITICAL' && <span className="status-badge-critical">Critical</span>}
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="btn-secondary text-sm">
                  <span className="material-symbols-outlined text-sm">share</span>Export
                </button>
                <button className="btn-primary text-sm">
                  <span className="material-symbols-outlined text-sm">print</span>Print Summary
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">

                {/* Test Results */}
                {d.latestReport?.testResults && d.latestReport.testResults.length > 0 && (
                  <section>
                    <p className="label-caps mb-4">RECENT TEST RESULTS</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {d.latestReport.testResults.map(r => (
                        <div key={r.id} className={`card p-5 border-l-4 ${borderColor(r.status)}`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-on-surface">{r.name}</span>
                            <span className={`material-symbols-outlined text-xl ${trendColor(r.status)}`}>
                              {trendIcon(r.trend)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-extrabold tracking-tight text-on-surface">{r.value}</span>
                            {r.unit && <span className="text-sm text-on-surface-variant">{r.unit}</span>}
                          </div>
                          {r.normalRange && (
                            <p className={`text-xs font-semibold ${trendColor(r.status)}`}>
                              {r.status === 'NORMAL' ? `Normal range: ${r.normalRange}` : r.status === 'ELEVATED' ? `Elevated (Alert)` : r.normalRange}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Medications */}
                {d.medications.length > 0 && (
                  <section className="card p-6">
                    <p className="label-caps mb-4">CURRENT MEDICATIONS</p>
                    <div className="space-y-3">
                      {d.medications.map(med => (
                        <div key={med.id} className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors">
                          <div>
                            <p className="font-bold text-on-surface">{med.name}</p>
                            <p className="text-sm text-on-surface-variant">{[med.dosage, med.form, med.frequency].filter(Boolean).join(' • ')}</p>
                          </div>
                          <span className="material-symbols-outlined text-on-surface-variant">medication</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Conditions */}
                {d.conditions.length > 0 && (
                  <section>
                    <p className="label-caps mb-4">ACTIVE CONDITIONS</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {d.conditions.map(c => (
                        <span key={c.id} className="px-4 py-2 rounded-full bg-surface-container text-sm font-semibold text-on-surface border border-outline-variant/50">
                          {c.name}
                        </span>
                      ))}
                    </div>

                    {/* Allergies */}
                    {d.allergies.length > 0 && (
                      <div className="rounded-2xl p-5 border border-error/20 bg-error-container/30">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined material-symbols-filled text-error">warning</span>
                          <p className="label-caps text-error">CRITICAL ALLERGIES</p>
                        </div>
                        <div className="space-y-3">
                          {d.allergies.map(a => (
                            <div key={a.id} className="flex items-center justify-between">
                              <span className="font-bold text-error">{a.name}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.severity === 'SEVERE' ? 'bg-error text-white' : 'bg-amber-500 text-white'}`}>
                                {a.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                {/* Recent visits */}
                {d.recentRecords.length > 0 && (
                  <section className="card p-5">
                    <p className="label-caps mb-5">LAST {d.recentRecords.length} VISITS</p>
                    <div className="space-y-5">
                      {d.recentRecords.map((rec, i) => (
                        <div key={rec.id} className="relative">
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${i === 0 ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-on-surface-variant mb-0.5">
                                {new Date(rec.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              <p className="font-bold text-on-surface mb-2">{rec.facility ?? 'Visit'}</p>
                              {rec.summary && (
                                <p className="text-sm text-on-surface-variant leading-relaxed mb-3 line-clamp-3">{rec.summary}</p>
                              )}
                              <Link href={`/timeline?memberId=${memberId}`}
                                className="px-4 py-2 rounded-xl bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-variant transition-colors inline-block">
                                View Notes
                              </Link>
                            </div>
                          </div>
                          {i < d.recentRecords.length - 1 && (
                            <div className="absolute left-1.5 top-4 w-px bg-outline-variant/50" style={{ height: 'calc(100% + 8px)' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Adherence */}
                <div className="card p-5">
                  <p className="label-caps text-center mb-4">WEEKLY ADHERENCE</p>
                  <div className="flex justify-center mb-3">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="#eceef0" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="#006b5f"
                          strokeWidth="8"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * (d.adherence.rate / 100))}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-on-surface">{d.adherence.rate}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant text-center leading-relaxed">
                    {d.adherence.total === 0
                      ? 'No doses tracked yet this week.'
                      : `${d.adherence.taken} of ${d.adherence.total} doses taken in the last 7 days.`}
                  </p>
                </div>

                {/* Refill alerts */}
                {d.refillAlerts.length > 0 && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-error material-symbols-filled">notification_important</span>
                      <h3 className="font-bold text-on-surface">Refill Alerts</h3>
                    </div>
                    <div className="space-y-4">
                      {d.refillAlerts.map(med => (
                        <div key={med.id} className="flex items-start gap-3">
                          <div className={`w-1.5 h-10 rounded-full mt-1 shrink-0 ${(med.dosesRemaining ?? 0) <= 3 ? 'bg-error' : 'bg-amber-500'}`} />
                          <div className="flex-1">
                            <p className="font-bold text-on-surface text-sm">{med.name}</p>
                            <p className="text-xs text-on-surface-variant">{med.dosesRemaining} doses left</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
