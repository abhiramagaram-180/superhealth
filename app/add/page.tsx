'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

export default function AddPage() {
  const router = useRouter()
  const [medications, setMedications] = useState([{ id: 1, name: '', dosage: '' }])
  const [saving, setSaving] = useState(false)

  const addMedication = () => {
    setMedications(prev => [...prev, { id: Date.now(), name: '', dosage: '' }])
  }

  const removeMedication = (id: number) => {
    setMedications(prev => prev.filter(m => m.id !== id))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      router.push('/timeline')
    }, 1200)
  }

  return (
    <div className="min-h-screen pb-28">
      <TopBar title="Health Sanctuary" />

      <main className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar */}
          <aside className="lg:w-72 px-5 pt-8 pb-6 lg:pb-0 shrink-0">
            <p className="label-caps mb-2">NEW ENTRY</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
              Add Clinical<br />Record.
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Maintain the integrity of your health sanctuary. Every detail captured here helps build a clearer picture of your wellness journey.
            </p>
            <div className="p-4 rounded-2xl bg-primary/8 border border-primary/15 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-sm material-symbols-filled">lock</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Private & Encrypted</p>
                <p className="text-xs text-on-surface-variant">Only you and authorized providers see this.</p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="flex-1 px-5 pt-8 lg:pt-8 lg:pl-8 lg:pr-5 space-y-10">

            {/* Visit Details */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Visit Details</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-caps mb-2 block">DATE OF VISIT</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="label-caps mb-2 block">MEDICAL FACILITY</label>
                  <input type="text" placeholder="e.g., St. Jude Medical Center" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-caps mb-2 block">PHYSICIAN NAME</label>
                  <input type="text" placeholder="Dr. Sarah Mitchell" className="input-field" />
                </div>
              </div>
            </section>

            {/* Diagnosis & Notes */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Diagnosis &amp; Notes</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div>
                <label className="label-caps mb-2 block">VISIT SUMMARY</label>
                <div className="rounded-xl overflow-hidden" style={{ background: '#eceef0' }}>
                  <div className="flex items-center gap-1 px-4 py-3 border-b border-outline-variant/40">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-colors font-bold text-on-surface">B</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-colors italic text-on-surface">I</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Describe symptoms, official diagnosis, and doctor's advice..."
                    className="w-full px-4 py-4 bg-transparent text-on-surface placeholder-on-surface-variant/40 outline-none resize-none text-sm leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* Prescriptions */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Prescriptions</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-low">
                {/* Header */}
                <div className="grid grid-cols-2 gap-4 px-5 py-3 bg-surface-container">
                  <p className="label-caps">MEDICATION</p>
                  <p className="label-caps">DOSAGE &amp; FREQUENCY</p>
                </div>
                {/* Rows */}
                {medications.map((med, i) => (
                  <div key={med.id} className="grid grid-cols-2 gap-4 px-5 py-3 border-t border-outline-variant/30">
                    <input
                      type="text"
                      placeholder="Amoxicillin"
                      defaultValue={med.name}
                      className="input-field text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="10mg • Once daily"
                        defaultValue={med.dosage}
                        className="input-field text-sm flex-1"
                      />
                      {i > 0 && (
                        <button onClick={() => removeMedication(med.id)}
                          className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors shrink-0">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Add Row */}
                <div className="px-5 py-3 border-t border-outline-variant/30">
                  <button onClick={addMedication}
                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-container transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Another Medication
                  </button>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Attachments</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div className="rounded-2xl border-2 border-dashed border-outline-variant p-10 flex flex-col items-center justify-center gap-4 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant material-symbols-filled">cloud_upload</span>
                <div className="text-center">
                  <p className="font-bold text-on-surface">Upload Lab Reports or Images</p>
                  <p className="text-sm text-on-surface-variant">PDF, JPG, or PNG up to 10MB each</p>
                </div>
                <button className="btn-primary text-sm">Select Files</button>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-4">
              <button onClick={() => router.back()}
                className="px-6 py-3 rounded-full bg-surface-container font-semibold text-on-surface hover:bg-surface-variant transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary disabled:opacity-70">
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    Saving...
                  </>
                ) : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
