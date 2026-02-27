'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Landmark,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
  Loader2,
  Lock,
} from 'lucide-react'

export default function LouvreTourPurchasePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Kérlek add meg a neved és email címed.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/louvre-tour/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || '',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Hiba történt.')
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('Hálózati hiba. Kérlek próbáld újra.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top bar */}
      <div className="border-b border-[#E8E2D6] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: Sales pitch */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a2e]">
                <Landmark className="h-6 w-6 text-[#D4C49E]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Louvre Interaktív Túra</h1>
                <p className="text-sm text-slate-500">Mesterművek időutazása</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 rounded-xl bg-white border border-[#E8E2D6] p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">3 990 Ft</span>
                <span className="text-sm text-slate-400">~10 EUR</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Egyszeri vásárlás · Korlátlan hozzáférés</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: '10 megálló a Louvre 3 szárnyában' },
                { icon: Clock, text: '~3 óra, saját tempóban' },
                { icon: Sparkles, text: 'Részletes sztorik és érdekességek minden megállóhoz' },
                { icon: ShieldCheck, text: 'Pontos helyszínek: szárny, szint, terem' },
                { icon: CreditCard, text: 'Azonnali hozzáférés vásárlás után' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <f.icon className="h-4 w-4 shrink-0 text-[#B8A472]" />
                  {f.text}
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div className="mt-8 rounded-xl bg-white border border-[#E8E2D6] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Összehasonlítás</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Élő idegenvezető', price: '50-60€', you: false },
                  { label: 'Louvre belépő', price: '22€', you: false },
                  { label: 'Interaktív túra', price: '~10€', you: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between rounded-lg p-2.5 text-sm ${item.you ? 'bg-[#F5EDE4]' : ''}`}>
                    <span className={item.you ? 'font-semibold text-[#8B7D55]' : 'text-slate-600'}>{item.label}</span>
                    <span className={item.you ? 'font-bold text-[#8B7D55]' : 'text-slate-400'}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Purchase form */}
          <div>
            <div className="sticky top-20 rounded-2xl border border-[#E8E2D6] bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-slate-800">Megrendelés</h2>
              <p className="mt-1 text-xs text-slate-500">Töltsd ki az adatokat, majd a Stripe biztonságos fizetési felületén fizethetsz</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Név *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="flex h-10 w-full rounded-lg border-2 border-[#E8E2D6] bg-white px-3 py-2 text-sm focus:border-[#B8A472] focus:outline-none"
                    placeholder="Teljes neved"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="flex h-10 w-full rounded-lg border-2 border-[#E8E2D6] bg-white px-3 py-2 text-sm focus:border-[#B8A472] focus:outline-none"
                    placeholder="email@pelda.hu"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Telefon (opcionális)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="flex h-10 w-full rounded-lg border-2 border-[#E8E2D6] bg-white px-3 py-2 text-sm focus:border-[#B8A472] focus:outline-none"
                    placeholder="+36 ..."
                  />
                </div>

                {/* Stripe info box */}
                <div className="rounded-lg bg-[#FAF7F2] p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Lock className="h-4 w-4 text-[#B8A472]" />
                    <span className="font-medium">Biztonságos fizetés a Stripe-on keresztül</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    A bankkártya adatokat közvetlenül a Stripe kezeli — az adataid nálunk nem tárolódnak.
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d2d44] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {loading ? 'Átirányítás a fizetéshez...' : 'Tovább a fizetéshez – 3 990 Ft'}
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  A megrendeléssel elfogadod az adatvédelmi tájékoztatómat.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
