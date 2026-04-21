'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFetch } from '@/lib/hooks'
import type { ClinicalRecord, FamilyMember } from '@/types'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'

const FILTERS = ['All Activity', 'Record', 'Report', 'Meds']

function groupByMonth(records: ClinicalRecord[]) {
  const map = new Map<string, ClinicalRecord[]>()
  for (const r of records) {
    const d = new Date(r.visitDate)
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  }
  return Array.from(map.entries())
}

function typeColor(t: string) {
  if (t === 'RECORD') return 'bg-primary text-white'
  if (t === 'REPORT') return 'bg-secondary-container text-on-secondary-container'
  if (t === 'URGENT_CARE') return 'bg-error-container text-error'
  return 'bg-surface-container text-on-surface'
}
function typeLabel(t: string) {
  if (t === 'URGENT_CARE') return 'URGENT CARE'
  return t
}

export default function TimelinePage() {
  const params = useSearchParams()
  const memberId = params.get('memberId')

  const { data: members } = useFetch<FamilyMember[]>('/api/family-members')
  const activeMemberId = memberId ?? members?.[0]?.id ?? null
  const activeMember = members?.find(m => m.id === activeMemberId)

  const [activeFilter, setActiveFilter] = useState('All Activity')
  const typeFilter = activeFilter === 'All Activity' ? undefined :
    activeFilter === 'Record' ? 'RECORD' :
    activeFilter === 'Report' ? 'REPORT' : undefined

  const { data: records, loading } = useFetch<ClinicalRecord[]>(
    activeMemberId
      ? `/api/records?memberId=${activeMemberId}${typeFilter ? `&type=${typeFilter}` : ''}&limit=50`
      : null
  )

  const grouped = groupByMonth(records ?? [])

  return (
    <div className="min-h-screen pb-28">
      <TopBar />
      <main className="px-5 pt-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div>
            <p className="label-caps mb-1">FAMILY HEALTH HISTORY</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              {activeMember?.name ?? 'Loading...'}
            </h1>
            {records && (
              <p className="text-sm text-on-surface-variant mt-1">Viewing {records.length} entries</p>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            {members && members.length > 1 && (
              <select className="input-field text-sm" value={activeMemberId ?? ''}
                onChange={e => window.location.href = `/timeline?memberId=${e.target.value}`}>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            )}
            <Link href={`/add?memberId=${activeMemberId ?? ''}`} className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Record
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <p className="label-caps mb-3">TYPE FILTER</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeFilter === f ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="card h-32 animate-pulse bg-surface-container" />)}
          </div>
        ) : grouped.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant block mb-4">history_edu</span>
            <p className="font-semibold text-on-surface mb-2">No records yet</p>
            <p className="text-sm text-on-surface-variant mb-6">Add your first clinical record to start building your health history.</p>
            <Link href={`/add?memberId=${activeMemberId ?? ''}`} className="btn-primary inline-flex">
              <span className="material-symbols-outlined text-sm">add</span>
              Add First Record
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/40 -translate-x-1/2" />
            {grouped.map(([month, monthRecords]) => (
              <div key={month} className="mb-12">
                {/* Month label */}
                <div className="flex items-center justify-center mb-8">
                  <div className="hidden sm:block w-4 h-4 rounded-full bg-primary border-4 border-surface z-10" />
                  <div className="sm:ml-4 text-center sm:text-left">
                    <p className="text-xl font-extrabold tracking-tight text-on-surface">{month}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {monthRecords.map((record, i) => (
                    <div key={record.id}
                      className={`sm:w-[calc(50%-2rem)] card p-5 ${i % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${typeColor(record.visitType)}`}>
                          {typeLabel(record.visitType)}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(record.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="font-bold text-on-surface mb-1">{record.facility ?? 'Medical Visit'}</h3>
                      {record.physicianName && (
                        <p className="text-xs font-semibold text-primary mb-3">{record.physicianName}</p>
                      )}
                      {record.summary && (
                        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-3">{record.summary}</p>
                      )}

                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div className="mb-4">
                          <p className="label-caps mb-2">PRESCRIPTIONS</p>
                          <div className="space-y-1">
                            {record.prescriptions.map(p => (
                              <p key={p.id} className="text-xs text-on-surface bg-surface-container px-2 py-1 rounded-lg">
                                {p.medicationName}{p.dosage ? ` · ${p.dosage}` : ''}{p.frequency ? ` · ${p.frequency}` : ''}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
