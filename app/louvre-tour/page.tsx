'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Landmark,
  Lock,
  Lightbulb,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import type { LouvreTour, LouvreTourStop } from '@/lib/types/database'

const wingColors: Record<string, { bg: string; text: string }> = {
  'Sully-szárny': { bg: '#7B6F52', text: '#FFFFFF' },
  'Denon-szárny': { bg: '#6B4F52', text: '#FFFFFF' },
  'Richelieu-szárny': { bg: '#5E6B7B', text: '#FFFFFF' },
}

export default function LouvreTourPage() {
  const supabase = createClient()
  const [tour, setTour] = useState<LouvreTour | null>(null)
  const [stops, setStops] = useState<LouvreTourStop[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [seen, setSeen] = useState<Set<number>>(new Set())

  useEffect(() => {
    const load = async () => {
      // Check for access token
      const token = localStorage.getItem('louvre-tour-token')
      if (token) {
        const { data } = await supabase
          .from('louvre_tour_purchases')
          .select('id')
          .eq('access_token', token)
          .eq('payment_status', 'completed')
          .single()
        if (data) setHasAccess(true)
      }

      // Load tour + stops
      const { data: tours } = await supabase
        .from('louvre_tours')
        .select('*')
        .eq('status', 'published')
        .order('display_order')
        .limit(1)

      if (tours && tours.length > 0) {
        setTour(tours[0] as LouvreTour)
        const { data: stopsData } = await supabase
          .from('louvre_tour_stops')
          .select('*')
          .eq('tour_id', tours[0].id)
          .order('display_order')
        setStops((stopsData || []) as LouvreTourStop[])
      }
      setLoading(false)
    }
    load()
  }, [])

  const currentStop = stops[currentIndex]
  const canView = currentStop?.is_demo || hasAccess
  const totalStops = stops.length

  const goTo = (index: number) => {
    if (index < 0 || index >= totalStops) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const markSeen = () => {
    if (currentStop) {
      setSeen((prev) => new Set(prev).add(currentStop.stop_number))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8A472] border-t-transparent" />
      </div>
    )
  }

  if (!tour || stops.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] px-4 text-center">
        <Landmark className="mb-4 h-12 w-12 text-slate-300" />
        <p className="text-slate-500">Jelenleg nincs elérhető Louvre túra.</p>
        <Link href="/" className="mt-4 text-sm text-[#B8A472] hover:underline">Vissza a főoldalra</Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8E2D6] bg-white/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" />
          Vissza
        </Link>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-800">{tour.title}</p>
          <p className="text-[10px] text-slate-400">{tour.duration_text}</p>
        </div>
        {!hasAccess && (
          <Link
            href="/louvre-tour/purchase"
            className="flex items-center gap-1.5 rounded-full bg-[#1a1a2e] px-3 py-1.5 text-[10px] font-semibold text-white"
          >
            <ShoppingCart className="h-3 w-3" />
            Megvásárlás
          </Link>
        )}
        {hasAccess && <div className="w-20" />}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 border-b border-[#E8E2D6] bg-white/50 px-4 py-2">
        {stops.map((stop, i) => {
          const isActive = i === currentIndex
          const isSeen = seen.has(stop.stop_number)
          const isLocked = !stop.is_demo && !hasAccess
          return (
            <button
              key={stop.id}
              onClick={() => goTo(i)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold transition-all ${
                isActive
                  ? 'scale-110 bg-[#1a1a2e] text-white shadow-md'
                  : isSeen
                    ? 'bg-emerald-100 text-emerald-600'
                    : isLocked
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-[#F5EDE4] text-[#8B7D55]'
              }`}
            >
              {isSeen ? <CheckCircle className="h-3 w-3" /> : isLocked ? <Lock className="h-2.5 w-2.5" /> : stop.stop_number}
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full overflow-y-auto px-4 py-6"
          >
            {currentStop && canView ? (
              <div className="mx-auto max-w-lg space-y-5">
                {/* Stop header */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-sm font-bold text-white">
                      {currentStop.stop_number}
                    </span>
                    <span
                      className="rounded-md px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: wingColors[currentStop.location_wing]?.bg || '#6B7280',
                        color: '#FFFFFF',
                      }}
                    >
                      {currentStop.location_wing}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {currentStop.duration_minutes} perc
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{currentStop.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {currentStop.location_floor} · {currentStop.location_rooms}
                  </p>
                </div>

                {/* Main artwork highlight */}
                {currentStop.main_artwork && (
                  <div className="rounded-xl bg-[#F5EDE4] p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#B8A472]" />
                      <p className="text-sm font-bold text-[#8B7D55]">{currentStop.main_artwork}</p>
                    </div>
                    <p className="mt-1 text-xs text-[#A09070]">{currentStop.description}</p>
                  </div>
                )}

                {/* Image */}
                {currentStop.image_url && (
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={currentStop.image_url}
                      alt={currentStop.title}
                      className="h-48 w-full object-cover sm:h-64"
                    />
                  </div>
                )}

                {/* Story */}
                {currentStop.story && (
                  <div className="rounded-xl border border-[#E8E2D6] bg-white p-5">
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{currentStop.story}</p>
                  </div>
                )}

                {/* Fun fact */}
                {currentStop.fun_fact && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-xs font-bold text-amber-700">Érdekesség</p>
                        <p className="mt-1 text-xs leading-relaxed text-amber-600">{currentStop.fun_fact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mark as seen */}
                <button
                  onClick={markSeen}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    seen.has(currentStop.stop_number)
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-[#1a1a2e] text-white shadow-sm hover:bg-[#2d2d44]'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {seen.has(currentStop.stop_number) ? 'Megnéztem!' : 'Megnéztem – tovább'}
                </button>
              </div>
            ) : currentStop && !canView ? (
              /* Locked state */
              <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <Lock className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                  {currentStop.stop_number}. {currentStop.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Ez a megálló a teljes túra része. Vásárold meg a túrát a teljes interaktív élményhez!
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {currentStop.location_wing} · {currentStop.location_floor}
                </div>
                <Link
                  href="/louvre-tour/purchase"
                  className="mt-8 flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d2d44]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Teljes túra megvásárlása
                </Link>
                <p className="mt-3 text-xs text-slate-400">Egyszeri vásárlás, korlátlan hozzáférés</p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-[#E8E2D6] bg-white px-4 py-3">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Előző
        </button>
        <span className="text-xs font-medium text-slate-400">
          {currentIndex + 1} / {totalStops}
        </span>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === totalStops - 1}
          className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2d44] disabled:opacity-30"
        >
          Következő
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
