'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/marketplace'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })
      if (signUpError) throw new Error(signUpError.message)

      // Try to sign in immediately (works if email confirm is off)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (!signInError) {
        router.push(redirectTo)
        router.refresh()
      } else {
        // Email confirmation required
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt a regisztráció során.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-parisian-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-slate-800">Sikeres regisztráció!</h2>
          <p className="mt-3 text-slate-600">
            Küldtünk egy megerősítő emailt a <strong>{email}</strong> címre.
            Kattints a linkre az emailben, majd jelentkezz be.
          </p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="mt-6 inline-block rounded-full bg-french-blue-500 px-8 py-3 font-semibold text-white hover:bg-french-blue-600 transition-colors"
          >
            Bejelentkezés
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parisian-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-french-blue-500 text-white shadow-lg">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Regisztráció</h1>
          <p className="mt-2 text-sm text-slate-500">Hozz létre fiókot a kártyacsomagok megvásárlásához</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teljes név</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-french-blue-400 focus:ring-1 focus:ring-french-blue-400 outline-none"
                placeholder="Kovács Anna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email cím</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-french-blue-400 focus:ring-1 focus:ring-french-blue-400 outline-none"
                placeholder="nev@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jelszó</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-french-blue-400 focus:ring-1 focus:ring-french-blue-400 outline-none"
                placeholder="Legalább 6 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-french-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-french-blue-600 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Regisztráció...</>
              ) : (
                <><UserPlus className="h-4 w-4" />Regisztráció</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Már van fiókod?{' '}
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-french-blue-500 hover:text-french-blue-600"
          >
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parisian-cream-50" />}>
      <RegisterForm />
    </Suspense>
  )
}
