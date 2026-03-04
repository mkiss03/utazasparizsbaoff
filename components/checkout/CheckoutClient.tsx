'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import type { CityPricing } from '@/lib/types/database'

interface CheckoutClientProps {
  cityPricing: CityPricing
  userId: string
}

export default function CheckoutClient({ cityPricing, userId }: CheckoutClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currencySymbol =
    cityPricing.currency === 'EUR' ? '€'
    : cityPricing.currency === 'USD' ? '$'
    : cityPricing.currency === 'GBP' ? '£'
    : cityPricing.currency === 'HUF' ? 'Ft'
    : cityPricing.currency

  const formattedPrice = cityPricing.currency === 'HUF'
    ? `${cityPricing.price.toLocaleString('hu-HU')} ${currencySymbol}`
    : `${currencySymbol}${cityPricing.price.toFixed(2)}`

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/city-pass/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityPricing.city,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Hiba történt a fizetés indításakor.')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt. Kérlek próbáld újra.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500">
            City Pass vásárlás
          </h1>
          <p className="text-slate-600">
            Biztonságos fizetés Stripe-on keresztül
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {/* City Pass details */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-french-blue-50 to-slate-50 p-6">
            <div className="mb-3 flex items-center gap-2 text-lg font-bold text-french-blue-600">
              <MapPin className="h-5 w-5" />
              {cityPricing.city} City Pass
            </div>
            <div className="mb-4 text-4xl font-bold text-slate-900">
              {formattedPrice}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              {cityPricing.duration_days} nap teljes hozzáférés
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              Azonnali hozzáférés az összes {cityPricing.city} kártyacsomaghoz
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              Összes témakör és kártya feloldva
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              Tanulási mód használata
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              Pénzvisszafizetési garancia
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-french-red-500 py-6 text-lg font-bold hover:bg-french-red-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Átirányítás a fizetéshez...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Fizetés — {formattedPrice}
              </>
            )}
          </Button>

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Biztonságos fizetés a Stripe rendszerén keresztül</span>
            <Lock className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
