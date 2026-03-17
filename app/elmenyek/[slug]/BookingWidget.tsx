'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Loader2, User, Mail, Phone } from 'lucide-react'
import type { Experience } from '@/lib/types/database'

interface Props {
  experience: Experience
}

export default function BookingWidget({ experience }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = experience.price * quantity

  async function handleCheckout() {
    if (!name.trim() || !email.trim()) {
      setError('Kérjük, adja meg nevét és email-címét.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/experiences/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experience.id,
          quantity,
          name,
          email,
          phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hiba történt.')
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-5">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">Ár fejenként</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#1F2937]">{experience.price} €</span>
          <span className="text-slate-400 text-sm">/ fő</span>
        </div>
      </div>

      {/* Quantity selector */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Csoportlétszám</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-[#C4A882] hover:text-[#C4A882] transition-colors disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-2xl font-bold text-[#1F2937] w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(25, q + 1))}
            className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-[#C4A882] hover:text-[#C4A882] transition-colors disabled:opacity-40"
            disabled={quantity >= 25}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="text-slate-500 text-sm">fő</span>
        </div>
        {experience.group_size && (
          <p className="text-xs text-slate-400 mt-1">Csoport: {experience.group_size}</p>
        )}
      </div>

      {/* Total */}
      <div className="bg-[#FAF7F2] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-slate-600 font-medium">Összesen ({quantity} fő)</span>
        <span className="text-xl font-bold text-[#1F2937]">{total} €</span>
      </div>

      {/* Contact details */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Elérhetőség</p>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Teljes neve *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="email"
            placeholder="Email-cím *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="tel"
            placeholder="Telefonszám (opcionális)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]/30 focus:border-[#C4A882]"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-[#374151] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        {loading ? 'Átirányítás...' : `Foglalás – ${total} €`}
      </button>

      <p className="text-xs text-center text-slate-400">
        Biztonságos fizetés Stripe-on keresztül · SSL titkosítás
      </p>
    </div>
  )
}
