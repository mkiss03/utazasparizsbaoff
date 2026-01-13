'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Package,
  ArrowRight
} from 'lucide-react'

interface UserPass {
  id: string
  user_id: string
  city: string
  purchased_at: string
  expires_at: string
  is_active: boolean
  bundleCount: number
}

interface MyPassesClientProps {
  passes: UserPass[]
}

export default function MyPassesClient({ passes }: MyPassesClientProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const activePasses = passes.filter(pass => {
    const expiresAt = new Date(pass.expires_at)
    return pass.is_active && expiresAt > currentTime
  })

  const expiredPasses = passes.filter(pass => {
    const expiresAt = new Date(pass.expires_at)
    return !pass.is_active || expiresAt <= currentTime
  })

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500 md:text-5xl">
            Az én város bérlettei
          </h1>
          <p className="text-lg text-slate-600">
            Kezeld a város hozzáférésed és fedezd fel a prémium tartalmat
          </p>
        </div>

        {/* Active Passes */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Aktív bérletek ({activePasses.length})
          </h2>

          {activePasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {activePasses.map((pass) => (
                <PassCard key={pass.id} pass={pass} currentTime={currentTime} isActive />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <h3 className="mb-2 font-semibold text-slate-600">Nincsenek aktív bérletek</h3>
              <p className="mb-6 text-sm text-slate-500">
                Vásárolj város bérletet a prémium tartalom feloldásához
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-french-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-red-600"
              >
                <Sparkles className="h-4 w-4" />
                Város bérletek megtekintése
              </Link>
            </div>
          )}
        </div>

        {/* Expired Passes */}
        {expiredPasses.length > 0 && (
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800">
              <Clock className="h-6 w-6 text-slate-400" />
              Lejárt bérletek ({expiredPasses.length})
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {expiredPasses.map((pass) => (
                <PassCard key={pass.id} pass={pass} currentTime={currentTime} isActive={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PassCard({ pass, currentTime, isActive }: { pass: UserPass; currentTime: Date; isActive: boolean }) {
  const expiresAt = new Date(pass.expires_at)
  const purchasedAt = new Date(pass.purchased_at)
  const timeRemaining = expiresAt.getTime() - currentTime.getTime()

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return (
    <div
      className={`overflow-hidden rounded-xl border-2 ${
        isActive ? 'border-green-200 bg-white' : 'border-slate-200 bg-slate-50'
      } shadow-md transition-all hover:shadow-lg`}
    >
      {/* Header */}
      <div
        className={`p-6 ${
          isActive
            ? 'bg-gradient-to-r from-green-500 to-green-600'
            : 'bg-gradient-to-r from-slate-400 to-slate-500'
        } text-white`}
      >
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">Város Pass</span>
        </div>
        <h3 className="mb-2 font-playfair text-3xl font-bold">{pass.city}</h3>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <Calendar className="h-4 w-4" />
          Vásárolva: {purchasedAt.toLocaleDateString('hu-HU')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Countdown or Expired */}
        {isActive ? (
          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-slate-600">Hátralévő idő</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-lg bg-french-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-french-blue-600">{days}</div>
                <div className="text-xs text-slate-600">Napok</div>
              </div>
              <div className="rounded-lg bg-french-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-french-blue-600">{hours}</div>
                <div className="text-xs text-slate-600">Órák</div>
              </div>
              <div className="rounded-lg bg-french-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-french-blue-600">{minutes}</div>
                <div className="text-xs text-slate-600">Percek</div>
              </div>
              <div className="rounded-lg bg-french-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-french-blue-600">{seconds}</div>
                <div className="text-xs text-slate-600">Másodp.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg bg-slate-100 p-4 text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <div className="text-sm font-semibold text-slate-600">
              Lejárt: {expiresAt.toLocaleDateString('hu-HU')}
            </div>
          </div>
        )}

        {/* Bundle Count */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-french-blue-500" />
            <span className="font-medium text-slate-700">Tartalmaz csomagok</span>
          </div>
          <span className="text-2xl font-bold text-french-blue-600">{pass.bundleCount}</span>
        </div>

        {/* Action Button */}
        {isActive ? (
          <Link
            href={`/city/${pass.city.toLowerCase()}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-french-blue-500 px-6 py-3 font-semibold text-white transition-all hover:bg-french-blue-600"
          >
            Tartalom elérése
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/city/${pass.city.toLowerCase()}`}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-french-blue-500 px-6 py-3 font-semibold text-french-blue-500 transition-all hover:bg-french-blue-50"
          >
            <Sparkles className="h-4 w-4" />
            Bérlet megújítása
          </Link>
        )}

        {/* Expiry Date */}
        <p className="mt-4 text-center text-xs text-slate-500">
          {isActive ? 'Lejár' : 'Lejárt'}: {expiresAt.toLocaleDateString('hu-HU')} {expiresAt.toLocaleTimeString('hu-HU')}
        </p>
      </div>
    </div>
  )
}
