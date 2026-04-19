'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const bloodWork = [
  {
    id: 1,
    title: 'CBC & Metabolic Panel',
    date: 'October 24, 2023',
    lab: 'LabCorp',
    status: 'NORMAL',
    statusColor: 'bg-secondary-container text-on-secondary-container',
    summary: 'Glucose levels and white blood cell counts within standard range.',
    icon: 'description',
    iconBg: 'bg-surface-container text-on-surface-variant',
  },
  {
    id: 2,
    title: 'Lipid Profile',
    date: 'August 12, 2023',
    lab: 'General Medical',
    status: 'FOLLOW-UP NEEDED',
    statusColor: 'bg-error text-white',
    summary: 'LDL Cholesterol slightly elevated. Consultation recommended.',
    icon: 'warning',
    iconBg: 'bg-error-container text-error',
  },
]

const radiology = [
  {
    id: 3,
    title: 'Chest X-Ray (Posterior-Anterior)',
    date: 'Regional Imaging Center',
    lab: 'Dr. Sarah Jenkins',
    hasImage: true,
  },
]

const vaccinations = [
  { id: 4, name: 'Influenza (Flu) Annual', date: 'Administered: Oct 12, 2023', provider: 'CVS Pharmacy #423', verified: true },
  { id: 5, name: 'Tdap Booster', date: 'Administered: Jun 20, 2023', provider: 'Health Sanctuary Clinic', verified: true },
  { id: 6, name: 'COVID-19 Bivalent Booster', date: 'Administered: Sep 5, 2022', provider: 'Walgreens Pharmacy', verified: false },
]

export default function ReportsPage() {
  const [search, setSearch] = useState('')

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

        {/* Search */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container focus-within:bg-white focus-within:shadow-ambient transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/50 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container font-semibold text-sm text-on-surface hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
            Filter
          </button>
        </div>

        {/* Blood Work */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary material-symbols-filled text-sm">water_drop</span>
            </div>
            <p className="label-caps">BLOOD WORK</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bloodWork.map(report => (
              <div key={report.id} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${report.iconBg} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-sm">{report.icon}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.statusColor}`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="font-bold text-on-surface mb-1">{report.title}</h3>
                <p className="text-xs text-on-surface-variant mb-4">{report.date} · {report.lab}</p>
                <div className="p-3 rounded-xl bg-surface-container mb-4">
                  <p className="label-caps mb-1">SUMMARY</p>
                  <p className="text-sm text-on-surface">{report.summary}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container transition-colors">
                    View PDF
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Radiology */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-sm">radiology</span>
            </div>
            <p className="label-caps">RADIOLOGY</p>
          </div>
          {radiology.map(item => (
            <div key={item.id} className="card overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-40 sm:h-auto bg-slate-900 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-400 text-5xl">radiology</span>
                </div>
                <div className="p-6 flex flex-col justify-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">{item.title}</h3>
                    <p className="text-sm text-on-surface-variant">{item.date} · {item.lab}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary text-sm">Download Results</button>
                    <button className="btn-secondary text-sm">Share Report</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Vaccinations */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-sm">vaccines</span>
            </div>
            <p className="label-caps">VACCINATIONS</p>
          </div>
          <div className="card overflow-hidden">
            {vaccinations.map((vax, i) => (
              <div key={vax.id}
                className={`flex items-center gap-4 px-5 py-4 ${i < vaccinations.length - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${vax.verified ? 'bg-secondary-container' : 'bg-surface-container'}`}>
                  <span className={`material-symbols-outlined text-sm material-symbols-filled ${vax.verified ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {vax.verified ? 'check_circle' : 'schedule'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface text-sm">{vax.name}</p>
                  <p className="text-xs text-on-surface-variant">{vax.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">{vax.provider}</p>
                  {vax.verified && (
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">VERIFIED</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
