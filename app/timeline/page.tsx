'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const filterTypes = ['All Activity', 'Record', 'Report', 'Meds']

const timelineData = [
  {
    month: 'OCTOBER 2023',
    day: 'Sat, 14th',
    entries: [
      {
        id: 1,
        type: 'RECORD',
        typeColor: 'bg-primary text-white',
        time: '10:30 AM',
        timeColor: '',
        title: 'Annual Physical',
        doctor: 'Dr. Sarah Chen, General Practitioner',
        doctorColor: 'text-primary',
        note: 'Overall health is stable. Blood pressure recorded at 120/80. Discussed routine exercise adjustments and updated vaccine records.',
        hasViewNotes: true,
        images: [],
      },
      {
        id: 2,
        type: 'REPORT',
        typeColor: 'bg-secondary-container text-on-secondary-container',
        time: '',
        timeColor: '',
        title: 'Comprehensive Blood Panel',
        doctor: 'LabCorp Facility',
        doctorColor: 'text-on-surface-variant',
        note: 'All values within standard deviation. Vitamin D levels showing significant improvement from previous quarter.',
        hasViewNotes: false,
        images: [],
        icon: 'science',
      },
    ],
  },
  {
    month: 'AUGUST 2023',
    day: 'Sat, 12th',
    entries: [
      {
        id: 3,
        type: 'RECORD',
        typeColor: 'bg-primary text-white',
        time: 'Urgent Care',
        timeColor: 'text-error',
        title: 'Ankle Sprain Treatment',
        doctor: 'City General Hospital',
        doctorColor: 'text-primary',
        note: 'Minor grade 2 sprain treated with compression and ice. Prescribed Ibuprofen for swelling. No fractures detected in X-ray.',
        hasViewNotes: false,
        images: ['xray'],
      },
    ],
  },
  {
    month: 'JUNE 2023',
    day: 'Thu, 8th',
    entries: [
      {
        id: 4,
        type: 'MEDS',
        typeColor: 'bg-amber-100 text-amber-700',
        time: '',
        timeColor: '',
        title: 'Prescription Updated',
        doctor: 'Dr. Mark Thompson',
        doctorColor: 'text-on-surface-variant',
        note: 'Metformin dosage increased from 500mg to 1000mg BID due to rising HbA1c levels. Monitor for GI side effects.',
        hasViewNotes: true,
        images: [],
      },
    ],
  },
]

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('All Activity')
  const [member, setMember] = useState('Elena Richardson')

  return (
    <div className="min-h-screen pb-28">
      <TopBar />

      <main className="px-5 pt-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div>
            <p className="label-caps mb-1">FAMILY HEALTH HISTORY</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{member}</h1>
            <p className="text-sm text-on-surface-variant mt-1">Viewing 32 entries across 5 years</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="btn-secondary text-sm">Switch Member</button>
            <button className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="label-caps mb-3">TYPE FILTER</p>
              <div className="flex flex-wrap gap-2">
                {filterTypes.map(f => (
                  <button key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeFilter === f
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:w-48">
              <p className="label-caps mb-3">DATE RANGE</p>
              <select className="input-field text-sm">
                <option>Jan 2023 - Present</option>
                <option>Jan 2022 - Dec 2022</option>
                <option>All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/40 -translate-x-1/2" />

          {timelineData.map((group) => (
            <div key={group.month} className="mb-12">
              {/* Month marker */}
              <div className="flex items-center justify-center mb-8 relative">
                <div className="sm:hidden w-4 h-4 rounded-full bg-primary border-4 border-surface shrink-0 mr-3" />
                <div className="hidden sm:flex items-center justify-center z-10">
                  <div className="w-5 h-5 rounded-full bg-primary border-4 border-surface" />
                </div>
                <div className="sm:absolute sm:left-1/2 sm:translate-x-4 sm:ml-4 sm:whitespace-nowrap">
                  <p className="text-xl font-extrabold tracking-tight text-on-surface">{group.month}</p>
                  <p className="text-sm text-on-surface-variant">{group.day}</p>
                </div>
              </div>

              {/* Entries */}
              <div className="space-y-4">
                {group.entries.map((entry, i) => (
                  <div key={entry.id}
                    className={`sm:w-[calc(50%-2rem)] card p-5 ${
                      i % 2 === 0 ? 'sm:mr-auto sm:ml-0' : 'sm:ml-auto sm:mr-0'
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${entry.typeColor}`}>
                        {entry.type}
                      </span>
                      {entry.time && (
                        <span className={`text-xs font-bold ${entry.timeColor || 'text-on-surface-variant'}`}>
                          {entry.time}
                        </span>
                      )}
                    </div>

                    {entry.icon && (
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-on-surface-variant">{entry.icon}</span>
                      </div>
                    )}

                    <h3 className="font-bold text-on-surface mb-1">{entry.title}</h3>
                    <p className={`text-xs font-semibold mb-3 ${entry.doctorColor}`}>{entry.doctor}</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{entry.note}</p>

                    {entry.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        <div className="w-20 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">radiology</span>
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
                          +2 PHOTOS
                        </div>
                      </div>
                    )}

                    {entry.hasViewNotes && (
                      <button className="flex items-center gap-1 text-sm font-bold text-on-surface uppercase tracking-wider hover:text-primary transition-colors">
                        VIEW NOTES
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
