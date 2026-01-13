'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Loader2
} from 'lucide-react'
import type { CityPricing } from '@/lib/types/database'

interface CheckoutClientProps {
  cityPricing: CityPricing
  userId: string
}

export default function CheckoutClient({ cityPricing, userId }: CheckoutClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  const currencySymbol =
    cityPricing.currency === 'EUR' ? '€'
    : cityPricing.currency === 'USD' ? '$'
    : cityPricing.currency === 'GBP' ? '£'
    : cityPricing.currency === 'HUF' ? 'Ft'
    : cityPricing.currency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number (add spaces every 4 digits)
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }

    // Format expiry date (MM/YY)
    if (name === 'expiryDate') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5)
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4)
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      // Basic validation
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        throw new Error('Please fill in all fields')
      }

      if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        throw new Error('Invalid card number')
      }

      if (formData.cvv.length < 3) {
        throw new Error('Invalid CVV')
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Calculate expiration date
      const purchaseDate = new Date()
      const expirationDate = new Date(purchaseDate)
      expirationDate.setDate(expirationDate.getDate() + cityPricing.duration_days)

      // Create mock order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          city: cityPricing.city,
          amount: cityPricing.price,
          status: 'completed',
          payment_method: 'card',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create user purchase record
      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: userId,
          city: cityPricing.city,
          order_id: order.id,
          purchased_at: purchaseDate.toISOString(),
          expires_at: expirationDate.toISOString(),
          is_active: true,
        })

      if (purchaseError) throw purchaseError

      // Redirect to success page
      router.push(`/checkout/success?city=${cityPricing.city}`)
    } catch (err: unknown) {
      console.error('Checkout error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Payment failed. Please try again.')
      }
      setIsProcessing(false)
    }
  }

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-playfair text-4xl font-bold text-french-blue-500">
            Complete Your Purchase
          </h1>
          <p className="text-slate-600">
            Secure checkout powered by Stripe (Demo Mode)
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold text-slate-800">Order Summary</h2>

              <div className="mb-6 rounded-lg bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-french-blue-600">
                  <MapPin className="h-4 w-4" />
                  {cityPricing.city} City Pass
                </div>
                <div className="mb-3 text-2xl font-bold text-slate-900">
                  {currencySymbol}{cityPricing.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  {cityPricing.duration_days} days full access
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Instant access
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  All bundles included
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Money-back guarantee
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{currencySymbol}{cityPricing.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Lock className="h-4 w-4 text-green-600" />
                Secure Payment (Demo Mode - No Real Charges)
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Card Number *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Demo: Use any 16-digit number (e.g., 4242 4242 4242 4242)
                  </p>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cardholder Name *
                  </label>
                  <Input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expiry Date *
                    </label>
                    <Input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-french-red-500 py-6 text-lg font-bold hover:bg-french-red-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Pay {currencySymbol}{cityPricing.price.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  🔒 This is a demo checkout. No real payment will be processed.
                  Your card information is not stored.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
