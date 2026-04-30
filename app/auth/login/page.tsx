'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, LogIn, AlertCircle, User } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/marketplace'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw new Error('Hibás email vagy jelszó.')
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Hiba történt a bejelentkezés során.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-parisian-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-french-blue-500 text-white shadow-lg">
            <User className="h-7 w-7" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Bejelentkezés</h1>
          <p className="mt-2 text-sm text-slate-500">Lépj be, hogy megvásárolhasd a kártyacsomagokat</p>
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-french-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-french-blue-600 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Bejelentkezés...</>
              ) : (
                <><LogIn className="h-4 w-4" />Bejelentkezés</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Nincs még fiókod?{' '}
          <Link
            href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-french-blue-500 hover:text-french-blue-600"
          >
            Regisztráció
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parisian-cream-50" />}>
      <LoginForm />
    </Suspense>
  )
}
