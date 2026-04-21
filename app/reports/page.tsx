'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFetch } from '@/lib/hooks'
import type { LabReport, FamilyMember } from '@/types'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const CATEGORIES = ['ALL', 'BLOOD_WORK', 'RADIOLOGY', 'VACCINATION', 'OTHER']
const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'All', BLOOD_WORK: 'Blood Work', RADIOLOGY: 'Radiology', VACCINATION: 'Vaccinations', OTHER: 'Other'
}
const CATEGORY_ICONS: Record<string, string> = {
  BLOOD_WORK: 'water_drop', RADIOLOGY: 'radiology', VACCINATION: 'vaccines', OTHER: 'description'
}

function statusBadge(s: string) {
  if (s === 'NORMAL') return 'bg-secondary-container text-on-secondary-container'
  if (s === 'FOLLOW_UP_NEEDED') return 'bg-error text-white'
  if (s === 'CRITICAL') return 'bg-error text-white'
  return 'bg-surface-container text-on-surface-variant'
}
function statusLabel(s: string) {
  if (s === 'FOLLOW_UP_NEEDED') return 'FOLLOW-UP NEEDED'
  return s
}

export default function ReportsPage() {
  const params = useSearchParams()
  const memberId = params.get('memberId')

  const { data: members } = useFetch<FamilyMember[]>('/api/family-members')
  const activeMemberId = memberId ?? members?.[0]?.id ?? null

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')

  const url = activeMemberId
    ? `/api/reports?memberId=${activeMemberId}${category !== 'ALL' ? `&category=${category}` : ''}`
    : null
  const { data: reports, loading } = useFetch<LabReport[]>(url)

  const filtered = (reports ?? []).filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.labName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.summary ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const grouped = CATEGORIES.slice(1).reduce<Record<string, LabReport[]>>((acc, cat) => {
    const items = filtered.filter(r => r.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="min-h-screen pb-28">
      <TopBar />
      <main className="px-5 pt-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Medical Repository</h1>
            <p className="text-sm text-on-surface-variant mt-1">Manage and access your historical lab results and diagnostic reports.</p>
          </div>
          <button className="btn-primary shrink-0 text-sm">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Upload New Report
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container focus-within:bg-white focus-within:shadow-ambient transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input type="text" placeholder="Search documents..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/50 text-sm" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                category === cat ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
              }`}>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2].map(i => <div key={i} className="card h-32 animate-pulse bg-surface-container" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="card p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant block mb-4">folder_open</span>
            <p className="font-semibold text-on-surface mb-2">No reports found</p>
            <p className="text-sm text-on-surface-variant">Upload your first medical report to get started.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <section key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary material-symbols-filled text-sm">
                    {CATEGORY_ICONS[cat] ?? 'description'}
                  </span>
                </div>
                <p className="label-caps">{CATEGORY_LABELS[cat]?.toUpperCase()}</p>
              </div>

              {cat === 'RADIOLOGY' ? (
                <div className="space-y-4">
                  {items.map(report => (
                    <div key={report.id} className="card overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-44 h-36 sm:h-auto bg-slate-900 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-slate-400 text-5xl">radiology</span>
                        </div>
                        <div className="p-5 flex flex-col justify-center gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-on-surface">{report.title}</h3>
                            <p className="text-sm text-on-surface-variant">
                              {report.labName}{report.physicianName ? ` · ${report.physicianName}` : ''}
                            </p>
                          </div>
                          {report.summary && <p className="text-sm text-on-surface-variant">{report.summary}</p>}
                          <div className="flex gap-3">
                            <button className="btn-primary text-sm">Download Results</button>
                            <button className="btn-secondary text-sm">Share Report</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cat === 'VACCINATION' ? (
                <div className="card overflow-hidden">
                  {items.map((report, i) => (
                    <div key={report.id}
                      className={`flex items-center gap-4 px-5 py-4 ${i < items.length - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary material-symbols-filled text-sm">check_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface text-sm">{report.title}</p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-on-surface-variant">{report.labName}</p>
                        <p className="text-xs font-bold text-secondary uppercase tracking-wider">VERIFIED</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map(report => (
                    <div key={report.id} className="card p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">{report.status === 'NORMAL' ? 'description' : 'warning'}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadge(report.status)}`}>
                          {statusLabel(report.status)}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface mb-1">{report.title}</h3>
                      <p className="text-xs text-on-surface-variant mb-4">
                        {new Date(report.reportDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {report.labName ? ` · ${report.labName}` : ''}
                      </p>
                      {report.summary && (
                        <div className="p-3 rounded-xl bg-surface-container mb-4">
                          <p className="label-caps mb-1">SUMMARY</p>
                          <p className="text-sm text-on-surface">{report.summary}</p>
                        </div>
                      )}
                      {report.testResults && report.testResults.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {report.testResults.map(r => (
                            <div key={r.id} className="flex items-center justify-between text-sm">
                              <span className="text-on-surface-variant">{r.name}</span>
                              <span className={`font-bold ${r.status === 'NORMAL' ? 'text-secondary' : 'text-error'}`}>
                                {r.value}{r.unit ? ` ${r.unit}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container transition-colors">
                        View PDF <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  )
}
