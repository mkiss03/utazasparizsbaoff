'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { useRouter } from 'next/navigation'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Bundle } from '@/lib/types/database'

interface VendorBundleFormProps {
  bundleId?: string // If editing
}

export default function VendorBundleForm({ bundleId }: VendorBundleFormProps) {
  const { userId } = useUserRole()
  const router = useRouter()
  const [loading, setLoading] = useState(!!bundleId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '',
    city: '',
    description: '',
    short_description: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimated_time_minutes: 30,
  })

  useEffect(() => {
    if (!bundleId || !userId) return
    const fetchBundle = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .eq('author_id', userId)
        .single()

      if (data) {
        setForm({
          title: data.title || '',
          city: data.city || '',
          description: data.description || '',
          short_description: data.short_description || '',
          difficulty_level: data.difficulty_level || 'beginner',
          estimated_time_minutes: data.estimated_time_minutes || 30,
        })
      }
      setLoading(false)
    }
    fetchBundle()
  }, [bundleId, userId])

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[áàâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      if (bundleId) {
        // Update
        const { error: updateError } = await supabase
          .from('bundles')
          .update({
            title: form.title,
            city: form.city,
            description: form.description,
            short_description: form.short_description,
            difficulty_level: form.difficulty_level,
            estimated_time_minutes: form.estimated_time_minutes,
            slug: generateSlug(form.title),
          })
          .eq('id', bundleId)

        if (updateError) throw new Error(updateError.message)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        // Create
        const { data, error: insertError } = await supabase
          .from('bundles')
          .insert({
            title: form.title,
            slug: generateSlug(form.title) + '-' + Date.now().toString(36),
            city: form.city,
            description: form.description,
            short_description: form.short_description,
            difficulty_level: form.difficulty_level,
            estimated_time_minutes: form.estimated_time_minutes,
            author_id: userId,
            status: 'draft',
            is_published: false,
          })
          .select()
          .single()

        if (insertError) throw new Error(insertError.message)

        // Advance onboarding step if at step 2
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('onboarding_step')
          .eq('id', userId!)
          .single()

        if (currentProfile?.onboarding_step === 2) {
          await supabase
            .from('profiles')
            .update({ onboarding_step: 3 })
            .eq('id', userId!)
        }

        if (data) {
          router.push(`/marketplace/vendor/bundles/${data.id}/cards`)
        }
      }
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
      <h1 className="text-xl font-bold text-slate-900">
        {bundleId ? 'Csomag szerkesztése' : 'Új csomag létrehozása'}
      </h1>
      <p className="mt-1 text-sm text-slate-500 mb-6">
        Adj meg egy címet, válassz várost, és írd le a csomagot.
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
            Csomag sikeresen mentve!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cím</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="pl. Párizs Metró Mester"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Város</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="pl. Paris, Rome, Budapest"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rövid leírás</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="Egy mondat, ami megjelenik a listában"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Részletes leírás</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
            placeholder="Mit tanulhat meg a vásárló ebből a csomagból?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nehézség</label>
            <select
              value={form.difficulty_level}
              onChange={(e) =>
                setForm({ ...form, difficulty_level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            >
              <option value="beginner">Kezdő</option>
              <option value="intermediate">Közepes</option>
              <option value="advanced">Haladó</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Idő (perc)</label>
            <input
              type="number"
              min={5}
              value={form.estimated_time_minutes}
              onChange={(e) => setForm({ ...form, estimated_time_minutes: parseInt(e.target.value) || 30 })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {bundleId ? 'Mentés' : 'Létrehozás'}
        </button>
      </form>
    </div>
  )
}
