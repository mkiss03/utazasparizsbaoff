'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { VendorProfile } from '@/lib/types/database'

export default function VendorProfileForm() {
  const { userId } = useUserRole()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    vendor_display_name: '',
    vendor_bio: '',
    vendor_city: '',
    vendor_website: '',
  })

  useEffect(() => {
    if (!userId) return
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('vendor_display_name, vendor_bio, vendor_city, vendor_website, onboarding_step')
        .eq('id', userId)
        .single()

      if (data) {
        setForm({
          vendor_display_name: data.vendor_display_name || '',
          vendor_bio: data.vendor_bio || '',
          vendor_city: data.vendor_city || '',
          vendor_website: data.vendor_website || '',
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const updates: Record<string, any> = { ...form }

      // Advance onboarding step if at step 1
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('onboarding_step')
        .eq('id', userId!)
        .single()

      if (currentProfile?.onboarding_step === 1) {
        updates.onboarding_step = 2
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId!)

      if (updateError) throw new Error(updateError.message)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold text-slate-900">Profil szerkesztése</h1>
      <p className="mt-1 text-sm text-slate-500 mb-6">
        Ezek az adatok jelennek meg a piactéren a csomagjaid mellett.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Profil sikeresen mentve!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Megjelenítési név</label>
          <input
            type="text"
            required
            value={form.vendor_display_name}
            onChange={(e) => setForm({ ...form, vendor_display_name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Város</label>
          <input
            type="text"
            value={form.vendor_city}
            onChange={(e) => setForm({ ...form, vendor_city: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bemutatkozás</label>
          <textarea
            value={form.vendor_bio}
            onChange={(e) => setForm({ ...form, vendor_bio: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weboldal (opcionális)</label>
          <input
            type="url"
            value={form.vendor_website}
            onChange={(e) => setForm({ ...form, vendor_website: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="https://"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Mentés
        </button>
      </form>
    </div>
  )
}
