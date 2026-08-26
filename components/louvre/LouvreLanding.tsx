'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Headphones, MapPin, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { captureLouvreLead } from '@/lib/actions/louvre'

export default function LouvreLanding() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const result = await captureLouvreLead(email)
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setMessage(result.error ?? 'Hiba történt, próbáld újra.')
    }
  }

  return (
    <div className="min-h-screen bg-louvre-navy-700 text-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16 text-center">
        <Headphones className="mx-auto mb-4 h-12 w-12 text-louvre-gold-500" />
        <h1 className="mb-4 font-playfair text-4xl font-bold sm:text-5xl">
          Hét tárgy, amely hazudik neked
        </h1>
        <p className="mb-2 text-lg text-louvre-navy-100">
          Interaktív, magyar nyelvű hangos túra a Louvre-ban -- most egy ingyenes, 3 állomásos
          ízelítővel.
        </p>
        <p className="mb-10 text-sm text-louvre-navy-100">
          A szárnyas bikának 5 lába van. A Mona Lisát egy lopás tette híressé. Napóleon
          koronázásán valaki ott van a képen, aki a valóságban nem volt ott. Fedezd fel, miért.
        </p>

        <div className="mb-10 grid gap-4 text-left sm:grid-cols-3">
          <Feature icon={<MapPin className="h-5 w-5" />} title="Bárhonnan indulhatsz">
            Nincs kötött sorrend -- oda mész, amerre éppen jársz.
          </Feature>
          <Feature icon={<Lock className="h-5 w-5" />} title="Teljesen offline">
            Töltsd le wifin, és a Louvre falai közt sem szakad meg.
          </Feature>
          <Feature icon={<Headphones className="h-5 w-5" />} title="Nem sima audio guide">
            Feladatok, csendek, elágazó kérdések -- és egy titkos bónuszsáv.
          </Feature>
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl bg-white/10 p-8">
            <p className="mb-4 text-lg font-semibold">Elküldtük a linket -- nézd meg az email fiókod!</p>
            <p className="mb-6 text-sm text-louvre-navy-100">
              Vagy folytasd rögtön itt, és most, wifin töltsd le a hanganyagot.
            </p>
            <Link
              href="/louvre/tour"
              className="inline-flex items-center gap-2 rounded-full bg-louvre-gold-500 px-8 py-4 font-semibold text-louvre-navy-700 hover:opacity-90"
            >
              Túra indítása
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-louvre-navy-100" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email cím..."
                  disabled={status === 'loading'}
                  className="w-full rounded-full border-2 border-louvre-gold-500/40 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder:text-louvre-navy-100 focus:border-louvre-gold-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 rounded-full bg-louvre-gold-500 px-6 py-3.5 font-semibold text-louvre-navy-700 hover:opacity-90 disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Kérem a túrát'}
              </button>
            </div>
            {status === 'error' && <p className="text-sm text-red-300">{message}</p>}
            <p className="text-xs text-louvre-navy-100">
              Csak a mini túra linkjét és egy indulás előtti emlékeztetőt küldünk. Bármikor
              leiratkozhatsz.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <div className="mb-2 text-louvre-gold-500">{icon}</div>
      <p className="mb-1 font-semibold">{title}</p>
      <p className="text-sm text-louvre-navy-100">{children}</p>
    </div>
  )
}
