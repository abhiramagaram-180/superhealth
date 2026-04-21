'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFetch, apiFetch } from '@/lib/hooks'
import type { FamilyMember } from '@/types'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

export default function AddPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: members } = useFetch<FamilyMember[]>('/api/family-members')

  const [form, setForm] = useState({
    familyMemberId: params.get('memberId') ?? '',
    visitDate: new Date().toISOString().split('T')[0],
    facility: '',
    physicianName: '',
    visitType: 'RECORD' as 'RECORD' | 'REPORT' | 'URGENT_CARE',
    summary: '',
  })
  const [medications, setMedications] = useState([{ id: 1, medicationName: '', dosage: '', frequency: '' }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addMedication = () => setMedications(prev => [...prev, { id: Date.now(), medicationName: '', dosage: '', frequency: '' }])
  const removeMedication = (id: number) => setMedications(prev => prev.filter(m => m.id !== id))
  const updateMed = (id: number, field: string, value: string) =>
    setMedications(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))

  const handleSave = async () => {
    if (!form.familyMemberId) { setError('Please select a family member.'); return }
    if (!form.visitDate) { setError('Please enter the visit date.'); return }
    setSaving(true)
    setError('')
    try {
      await apiFetch('/api/records', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          prescriptions: medications.filter(m => m.medicationName.trim()),
        }),
      })
      router.push(`/timeline?memberId=${form.familyMemberId}`)
    } catch (e: any) {
      setError(e.message ?? 'Failed to save.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-28">
      <TopBar title="Health Sanctuary" />
      <main className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-72 px-5 pt-8 pb-6 shrink-0">
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
          <div className="flex-1 px-5 pt-8 lg:pl-8 space-y-10">
            {/* Visit Details */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Visit Details</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-caps mb-2 block">FAMILY MEMBER</label>
                  <select
                    value={form.familyMemberId}
                    onChange={e => setForm(f => ({ ...f, familyMemberId: e.target.value }))}
                    className="input-field w-full">
                    <option value="">Select member...</option>
                    {members?.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-caps mb-2 block">DATE OF VISIT</label>
                  <input type="date" value={form.visitDate}
                    onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="label-caps mb-2 block">VISIT TYPE</label>
                  <select value={form.visitType}
                    onChange={e => setForm(f => ({ ...f, visitType: e.target.value as any }))}
                    className="input-field w-full">
                    <option value="RECORD">Regular Visit</option>
                    <option value="REPORT">Report / Lab</option>
                    <option value="URGENT_CARE">Urgent Care</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps mb-2 block">MEDICAL FACILITY</label>
                  <input type="text" placeholder="e.g., St. Jude Medical Center"
                    value={form.facility}
                    onChange={e => setForm(f => ({ ...f, facility: e.target.value }))}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="label-caps mb-2 block">PHYSICIAN NAME</label>
                  <input type="text" placeholder="Dr. Sarah Mitchell"
                    value={form.physicianName}
                    onChange={e => setForm(f => ({ ...f, physicianName: e.target.value }))}
                    className="input-field w-full" />
                </div>
              </div>
            </section>

            {/* Diagnosis & Notes */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Diagnosis &amp; Notes</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <label className="label-caps mb-2 block">VISIT SUMMARY</label>
              <textarea rows={6} placeholder="Describe symptoms, official diagnosis, and doctor's advice..."
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                className="input-field w-full resize-none" />
            </section>

            {/* Prescriptions */}
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-1">Prescriptions</h2>
              <div className="h-px bg-surface-container-highest mb-6" />
              <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-low">
                <div className="grid grid-cols-3 gap-4 px-5 py-3 bg-surface-container">
                  <p className="label-caps">MEDICATION</p>
                  <p className="label-caps">DOSAGE</p>
                  <p className="label-caps">FREQUENCY</p>
                </div>
                {medications.map((med, i) => (
                  <div key={med.id} className="grid grid-cols-3 gap-3 px-5 py-3 border-t border-outline-variant/30">
                    <input type="text" placeholder="Amoxicillin" value={med.medicationName}
                      onChange={e => updateMed(med.id, 'medicationName', e.target.value)}
                      className="input-field text-sm" />
                    <input type="text" placeholder="10mg" value={med.dosage}
                      onChange={e => updateMed(med.id, 'dosage', e.target.value)}
                      className="input-field text-sm" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Daily" value={med.frequency}
                        onChange={e => updateMed(med.id, 'frequency', e.target.value)}
                        className="input-field text-sm flex-1" />
                      {i > 0 && (
                        <button onClick={() => removeMedication(med.id)}
                          className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3 border-t border-outline-variant/30">
                  <button onClick={addMedication}
                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-container transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Another Medication
                  </button>
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 rounded-xl bg-error-container text-error text-sm font-medium">{error}</div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-4">
              <button onClick={() => router.back()}
                className="px-6 py-3 rounded-full bg-surface-container font-semibold text-on-surface hover:bg-surface-variant transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
                {saving ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Saving...</>
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
