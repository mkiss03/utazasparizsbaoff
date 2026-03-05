'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus, AlertCircle } from 'lucide-react'

export default function VendorRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    city: '',
    bio: '',
    applicationText: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      if (!authData.user) {
        throw new Error('Nem sikerült létrehozni a fiókot.')
      }

      // 2. Update profile with vendor fields
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'vendor',
          is_approved: false,
          vendor_display_name: form.displayName,
          vendor_city: form.city,
          vendor_bio: form.bio,
          vendor_application_text: form.applicationText,
          vendor_applied_at: new Date().toISOString(),
          onboarding_step: 0,
        })
        .eq('id', authData.user.id)

      if (profileError) {
        throw new Error(profileError.message)
      }

      // 3. Redirect to dashboard
      router.push('/marketplace/vendor/dashboard')
    } catch (err: any) {
      setError(err.message || 'Hiba történt a regisztráció során.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email cím</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
          placeholder="nev@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Jelszó</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
          placeholder="Min. 6 karakter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Megjelenítési név</label>
        <input
          type="text"
          required
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
          placeholder="A neved, ahogy megjelenik az oldaladon"
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
          placeholder="pl. Párizs, Róma, Budapest"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Rövid bemutatkozás</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
          placeholder="Mesélj magadról néhány mondatban..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Miért szeretnél eladó lenni?
        </label>
        <textarea
          required
          value={form.applicationText}
          onChange={(e) => setForm({ ...form, applicationText: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
          placeholder="Milyen kártyacsomagokat tervezel készíteni? Mi a tapasztalatod?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Regisztráció...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Regisztráció eladóként
          </>
        )}
      </button>
    </form>
  )
}
