'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  X,
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
  Footprints,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { WalkingTour } from '@/lib/types/database'

interface WalkingTourDayModalProps {
  tours: WalkingTour[]
  date: string | null
  onClose: () => void
}

export default function WalkingTourDayModal({ tours, date, onClose }: WalkingTourDayModalProps) {
  const router = useRouter()
  const supabase = createClient()
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numParticipants: 1,
    notes: '',
  })

  const isOpen = !!date && tours.length > 0
  const selectedTour = tours.find(t => t.id === selectedTourId) || null

  // Auto-select if only one tour; reset when tours change
  useEffect(() => {
    if (tours.length === 1) {
      setSelectedTourId(tours[0].id)
    } else {
      setSelectedTourId(null)
    }
    setError(null)
    setFormData({ name: '', email: '', phone: '', numParticipants: 1, notes: '' })
    setIsProcessing(false)
  }, [tours])

  const handleClose = () => {
    setSelectedTourId(null)
    setError(null)
    setFormData({ name: '', email: '', phone: '', numParticipants: 1, notes: '' })
    setIsProcessing(false)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTour) return

    if (!formData.name || !formData.email) {
      setError('Kérjük, add meg a neved és email címed!')
      return
    }

    const available = selectedTour.max_participants - (selectedTour.current_bookings || 0)
    if (formData.numParticipants > available) {
      setError(`Csak ${available} szabad hely van!`)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { data: freshTour } = await supabase
        .from('walking_tours')
        .select('current_bookings, max_participants')
        .eq('id', selectedTour.id)
        .single()

      if (freshTour && (freshTour.current_bookings || 0) + formData.numParticipants > freshTour.max_participants) {
        setError('Sajnos nincs elég szabad hely. Kérjük próbáld újra.')
        setIsProcessing(false)
        return
      }

      const totalAmount = formData.numParticipants * selectedTour.price_per_person

      const { data: booking, error: insertError } = await supabase
        .from('walking_tour_bookings')
        .insert({
          walking_tour_id: selectedTour.id,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-2xl"
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
              >
                <X className="h-5 w-5 text-parisian-grey-700" />
              </motion.button>

              {/* Header */}
              <div className="bg-gradient-to-r from-parisian-grey-800 to-parisian-grey-700 px-6 py-5 pr-16">
                <div className="flex items-center gap-2 text-parisian-beige-200">
                  <CalendarDays className="h-5 w-5" />
                  <span className="font-medium">{date && formatDate(date)}</span>
                </div>
                <h3 className="mt-1 font-playfair text-xl font-bold text-white md:text-2xl">
                  {tours.length === 1 ? 'Sétatúra' : `${tours.length} sétatúra`} ezen a napon
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                {!selectedTour ? (
                  /* Tour selection list (when multiple tours) */
                  <div className="space-y-4">
                    {tours.map(tour => {
                      const available = tour.max_participants - (tour.current_bookings || 0)
                      const isFull = available <= 0
                      return (
                        <motion.div
                          key={tour.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-2xl border-2 p-5 transition-all ${
                            isFull
                              ? 'border-red-200 bg-red-50/50'
                              : 'cursor-pointer border-parisian-beige-200 hover:border-parisian-beige-400 hover:shadow-lg'
                          }`}
                          onClick={() => !isFull && setSelectedTourId(tour.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-playfair text-lg font-bold text-parisian-grey-800">
                                {tour.title}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-3 text-sm text-parisian-grey-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-parisian-beige-500" />
                                  {tour.start_time?.slice(0, 5)} &bull; {tour.duration_minutes} perc
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-parisian-beige-500" />
                                  {tour.meeting_point}
                                </span>
                              </div>
                              {tour.short_description && (
                                <p className="mt-2 line-clamp-2 text-sm text-parisian-grey-500">
                                  {tour.short_description}
                                </p>
                              )}
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-xl font-bold text-parisian-grey-800">
                                {tour.price_per_person} &euro;
                                <span className="text-sm font-normal text-parisian-grey-500">/f&#337;</span>
                              </div>
                              {isFull ? (
                                <span className="text-sm font-medium text-red-600">Betelt</span>
                              ) : (
                                <span className="text-sm text-green-600">
                                  {available} szabad hely
                                </span>
                              )}
                            </div>
                          </div>
                          {!isFull && (
                            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-parisian-beige-600">
                              <Footprints className="h-4 w-4" />
                              <span>Foglalás</span>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  /* Selected tour details + booking form */
                  <div>
                    {/* Back button when multiple tours */}
                    {tours.length > 1 && (
                      <button
                        onClick={() => {
                          setSelectedTourId(null)
                          setError(null)
                          setFormData({ name: '', email: '', phone: '', numParticipants: 1, notes: '' })
                        }}
                        className="mb-4 flex items-center gap-1 text-sm text-parisian-grey-500 transition-colors hover:text-parisian-grey-700"
                      >
                        &larr; Vissza a túrákhoz
                      </button>
                    )}

                    {/* Tour details */}
                    <div className="mb-6">
                      <h4 className="font-playfair text-2xl font-bold text-parisian-grey-800">
                        {selectedTour.title}
                      </h4>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-lg bg-parisian-beige-50 px-3 py-2 text-sm">
                          <Clock className="h-4 w-4 text-parisian-beige-500" />
                          <span>{selectedTour.start_time?.slice(0, 5)} &bull; {selectedTour.duration_minutes} perc</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-parisian-beige-50 px-3 py-2 text-sm">
                          <MapPin className="h-4 w-4 text-parisian-beige-500" />
                          <span>{selectedTour.meeting_point}</span>
                          {selectedTour.meeting_point_url && (
                            <a
                              href={selectedTour.meeting_point_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-parisian-beige-600 hover:text-parisian-beige-800" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-parisian-beige-50 px-3 py-2 text-sm">
                          <Euro className="h-4 w-4 text-parisian-beige-500" />
                          <span>{selectedTour.price_per_person} EUR / f&#337;</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-parisian-beige-50 px-3 py-2 text-sm">
                          <Users className="h-4 w-4 text-parisian-beige-500" />
                          <span className="font-medium text-green-600">
                            {selectedTour.max_participants - (selectedTour.current_bookings || 0)} szabad hely
                          </span>
                        </div>
                      </div>

                      {selectedTour.description && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-parisian-grey-600">
                          {selectedTour.description}
                        </p>
                      )}

                      {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {selectedTour.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-parisian-grey-600">
                              <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Booking Form */}
                    <div className="rounded-2xl border-2 border-parisian-beige-200 bg-parisian-cream-50 p-5">
                      <h5 className="mb-4 font-playfair text-lg font-bold text-parisian-grey-800">
                        Foglalás
                      </h5>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="modal-name" className="text-sm">Teljes név *</Label>
                            <Input
                              id="modal-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Kovács Péter"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="modal-email" className="text-sm">Email cím *</Label>
                            <Input
                              id="modal-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="pelda@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="modal-phone" className="text-sm">Telefonszám</Label>
                            <Input
                              id="modal-phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+36 20 123 4567"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm">Résztvevők száma</Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    numParticipants: Math.max(1, formData.numParticipants - 1),
                                  })
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-parisian-beige-200 transition-colors hover:bg-parisian-beige-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-lg font-bold text-parisian-grey-800">
                                {formData.numParticipants}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const avail = selectedTour.max_participants - (selectedTour.current_bookings || 0)
                                  setFormData({
                                    ...formData,
                                    numParticipants: Math.min(avail, formData.numParticipants + 1),
                                  })
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-parisian-beige-200 transition-colors hover:bg-parisian-beige-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="modal-notes" className="text-sm">Megjegyzés (opcionális)</Label>
                          <Textarea
                            id="modal-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                            placeholder="Különleges kérés, allergia stb."
                          />
                        </div>

                        {/* Price summary */}
                        <div className="space-y-1.5 rounded-lg bg-white p-3">
                          <div className="flex justify-between text-sm text-parisian-grey-600">
                            <span>{formData.numParticipants} x {selectedTour.price_per_person} EUR</span>
                            <span className="font-bold text-parisian-grey-800">
                              {formData.numParticipants * selectedTour.price_per_person} EUR
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-parisian-grey-500">
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Helyszínen készpénzzel fizetendő</span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                          Min. {selectedTour.min_participants} fő szükséges a túra indulásához.
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
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
