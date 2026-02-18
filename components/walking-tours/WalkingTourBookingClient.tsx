'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Euro,
  Loader2,
  AlertCircle,
  Minus,
  Plus,
  CheckCircle,
  ExternalLink,
  Banknote,
} from 'lucide-react'
import type { WalkingTour } from '@/lib/types/database'

interface WalkingTourBookingClientProps {
  tour: WalkingTour
}

export default function WalkingTourBookingClient({ tour }: WalkingTourBookingClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = tour.max_participants - (tour.current_bookings || 0)
  const isFull = available <= 0

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numParticipants: 1,
    notes: '',
  })

  const totalAmount = formData.numParticipants * tour.price_per_person

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setError('Kérjük, add meg a neved és email címed!')
      return
    }
    if (formData.numParticipants > available) {
      setError(`Csak ${available} szabad hely van!`)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Check availability once more
      const { data: freshTour } = await supabase
        .from('walking_tours')
        .select('current_bookings, max_participants')
        .eq('id', tour.id)
        .single()

      if (freshTour && (freshTour.current_bookings || 0) + formData.numParticipants > freshTour.max_participants) {
        setError('Sajnos nincs elég szabad hely. Kérjük próbáld újra.')
        setIsProcessing(false)
        return
      }

      // Create booking
      const { data: booking, error: insertError } = await supabase
        .from('walking_tour_bookings')
        .insert({
          walking_tour_id: tour.id,
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone || null,
          num_participants: formData.numParticipants,
          total_amount: totalAmount,
          payment_status: 'completed',
          payment_method: 'cash',
          booking_status: 'confirmed',
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/walking-tours/booking-success?order=${booking.order_number}`)
    } catch (err: any) {
      setError(err.message || 'Hiba történt a foglalás során.')
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Left: Tour Details */}
        <div>
          {/* Tour Header */}
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-parisian-beige-100 px-3 py-1 text-sm font-medium text-parisian-beige-700">
              Sétatúra
            </span>
            <h1 className="mb-3 font-playfair text-3xl font-bold text-parisian-grey-800 md:text-4xl">
              {tour.title}
            </h1>
          </div>

          {/* Tour Info Cards */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-parisian-beige-100">
              <CalendarDays className="h-5 w-5 text-parisian-beige-500" />
              <div>
                <p className="text-xs text-parisian-grey-500">Dátum</p>
                <p className="font-semibold text-parisian-grey-800">{formatDate(tour.tour_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-parisian-beige-100">
              <Clock className="h-5 w-5 text-parisian-beige-500" />
              <div>
                <p className="text-xs text-parisian-grey-500">Időpont & időtartam</p>
                <p className="font-semibold text-parisian-grey-800">
                  {tour.start_time?.slice(0, 5)} • {tour.duration_minutes} perc
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-parisian-beige-100">
              <MapPin className="h-5 w-5 text-parisian-beige-500" />
              <div>
                <p className="text-xs text-parisian-grey-500">Találkozópont</p>
                <p className="font-semibold text-parisian-grey-800">{tour.meeting_point}</p>
                {tour.meeting_point_url && (
                  <a
                    href={tour.meeting_point_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-parisian-beige-600 hover:underline"
                  >
                    Térkép <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-parisian-beige-100">
              <Euro className="h-5 w-5 text-parisian-beige-500" />
              <div>
                <p className="text-xs text-parisian-grey-500">Ár</p>
                <p className="font-semibold text-parisian-grey-800">{tour.price_per_person} EUR / fő</p>
                <p className="text-xs text-parisian-grey-400">Helyszínen készpénzzel fizetendő</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {tour.description && (
            <div className="mb-8">
              <h2 className="mb-3 font-playfair text-xl font-bold text-parisian-grey-800">
                A túráról
              </h2>
              <p className="text-parisian-grey-600 whitespace-pre-line leading-relaxed">
                {tour.description}
              </p>
            </div>
          )}

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 font-playfair text-xl font-bold text-parisian-grey-800">
                Mit fogunk látni
              </h2>
              <ul className="space-y-2">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-parisian-grey-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Box */}
          <div className="rounded-xl bg-parisian-beige-50 border border-parisian-beige-200 p-4 text-sm text-parisian-grey-600">
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-parisian-beige-500" />
              <strong>Min. {tour.min_participants} fő</strong> szükséges a túra indulásához.
              Amennyiben nem éri el a létszám a minimumot, értesítünk emailben.
            </p>
          </div>
        </div>

        {/* Right: Booking Form (Sticky) */}
        <div>
          <div className="sticky top-28">
            <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-6 shadow-xl">
              {isFull ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-red-300" />
                  <h3 className="mt-4 font-playfair text-xl font-bold text-red-600">Betelt</h3>
                  <p className="mt-2 text-sm text-parisian-grey-500">Ez a túra már betelt. Nézd meg a többi időpontot!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-playfair text-xl font-bold text-parisian-grey-800">
                    Foglalás
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Teljes név *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Kovács Péter"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email cím *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="pelda@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonszám</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+36 20 123 4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Résztvevők száma</Label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            numParticipants: Math.max(1, formData.numParticipants - 1),
                          })
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-parisian-beige-200 hover:bg-parisian-beige-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-xl font-bold text-parisian-grey-800">
                        {formData.numParticipants}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            numParticipants: Math.min(available, formData.numParticipants + 1),
                          })
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-parisian-beige-200 hover:bg-parisian-beige-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-parisian-grey-500">
                        (max. {available})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Megjegyzés (opcionális)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      placeholder="Különleges kérés, allergia stb."
                    />
                  </div>

                  {/* Price summary */}
                  <div className="rounded-lg bg-parisian-beige-50 p-4 space-y-2">
                    <div className="flex justify-between text-sm text-parisian-grey-600">
                      <span>{formData.numParticipants} x {tour.price_per_person} EUR</span>
                      <span className="font-bold text-parisian-grey-800">{totalAmount} EUR</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-parisian-grey-500">
                      <Banknote className="h-3.5 w-3.5" />
                      <span>Helyszínen készpénzzel fizetendő</span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    variant="secondary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Foglalás...
                      </>
                    ) : (
                      'Helyfoglalás megerősítése'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
