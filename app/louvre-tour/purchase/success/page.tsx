'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { CheckCircle, Landmark, ChevronRight, Home, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') || ''
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(!!sessionId)

  useEffect(() => {
    if (!sessionId) return

    // Poll for the purchase created by the Stripe webhook
    const supabase = createClient()
    let attempts = 0
    const maxAttempts = 10

    const checkPurchase = async () => {
      const { data } = await supabase
        .from('louvre_tour_purchases')
        .select('order_number, access_token')
        .eq('notes', `stripe:${sessionId}`)
        .eq('payment_status', 'completed')
        .single()

      if (data) {
        setOrderNumber(data.order_number || '')
        if (data.access_token) {
          localStorage.setItem('louvre-tour-token', data.access_token)
        }
        setLoading(false)
        return true
      }
      return false
    }

    const poll = async () => {
      const found = await checkPurchase()
      if (!found && attempts < maxAttempts) {
        attempts++
        setTimeout(poll, 2000)
      } else if (!found) {
        // After max attempts, still show success (webhook may be delayed)
        setLoading(false)
      }
    }

    poll()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#B8A472]" />
          <p className="mt-4 text-sm text-slate-500">Fizetés feldolgozása...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800">Sikeres vásárlás!</h1>
        <p className="mt-2 text-sm text-slate-500">
          A Louvre interaktív túra hozzáférésed aktiválva van.
        </p>

        {orderNumber && (
          <div className="mt-6 rounded-xl bg-white border border-[#E8E2D6] p-4">
            <p className="text-xs text-slate-400">Rendelésszám</p>
            <p className="mt-1 text-lg font-mono font-bold text-slate-800">{orderNumber}</p>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-xs text-emerald-600">
            A hozzáférésed el lett mentve ezen a böngészőn. Bármikor visszatérhetsz a túrához.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/louvre-tour"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d2d44]"
          >
            <Landmark className="h-4 w-4" />
            Túra megnyitása
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8E2D6] px-6 py-3 text-sm font-medium text-slate-600 hover:bg-white"
          >
            <Home className="h-4 w-4" />
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LouvreTourPurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8A472] border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
