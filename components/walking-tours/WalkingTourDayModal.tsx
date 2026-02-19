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
import type { WalkingTour, WalkingTourCalendarSettings } from '@/lib/types/database'
import { defaultCalendarSettings } from '@/lib/types/database'

interface WalkingTourDayModalProps {
  tours: WalkingTour[]
  date: string | null
  onClose: () => void
  calendarSettings?: WalkingTourCalendarSettings
}

export default function WalkingTourDayModal({ tours, date, onClose, calendarSettings }: WalkingTourDayModalProps) {
  const s = { ...defaultCalendarSettings, ...calendarSettings }
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 bg-white shadow-2xl"
              style={{ borderColor: s.modalAccentColor + '40' }}
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
                <X className="h-5 w-5" style={{ color: s.modalHeaderBgFrom }} />
              </motion.button>

              {/* Header */}
              <div
                className="px-6 py-5 pr-16"
                style={{ background: `linear-gradient(to right, ${s.modalHeaderBgFrom}, ${s.modalHeaderBgTo})` }}
              >
                <div className="flex items-center gap-2" style={{ color: s.modalHeaderTextColor + 'CC' }}>
                  <CalendarDays className="h-5 w-5" />
                  <span className="font-medium">{date && formatDate(date)}</span>
                </div>
                <h3
                  className="mt-1 font-playfair text-xl font-bold md:text-2xl"
                  style={{ color: s.modalHeaderTextColor }}
                >
                  {tours.length === 1 ? 'Sétatúra' : `${tours.length} sétatúra`} ezen a napon
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                {!selectedTour ? (
                  /* Tour selection list */
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
                            isFull ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'
                          }`}
                          style={{
                            borderColor: isFull ? '#fecaca' : s.modalAccentColor + '60',
                            backgroundColor: isFull ? '#fef2f2' : 'white',
                          }}
                          onClick={() => !isFull && setSelectedTourId(tour.id)}
                          onMouseEnter={(e) => {
                            if (!isFull) e.currentTarget.style.borderColor = s.modalAccentColor
                          }}
                          onMouseLeave={(e) => {
                            if (!isFull) e.currentTarget.style.borderColor = s.modalAccentColor + '60'
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-playfair text-lg font-bold" style={{ color: s.sectionTitleColor }}>
                                {tour.title}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-3 text-sm" style={{ color: s.sectionSubtitleColor }}>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                                  {tour.start_time?.slice(0, 5)} &bull; {tour.duration_minutes} perc
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                                  {tour.meeting_point}
                                </span>
                              </div>
                              {tour.short_description && (
                                <p className="mt-2 line-clamp-2 text-sm" style={{ color: s.sectionSubtitleColor }}>
                                  {tour.short_description}
                                </p>
                              )}
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-xl font-bold" style={{ color: s.sectionTitleColor }}>
                                {tour.price_per_person} &euro;
                                <span className="text-sm font-normal" style={{ color: s.sectionSubtitleColor }}>/f&#337;</span>
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
                            <div className="mt-3 flex items-center gap-2 text-sm font-semibold" style={{ color: s.modalAccentColor }}>
                              <Footprints className="h-4 w-4" />
                              <span>Foglalás</span>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  /* Selected tour + booking form */
                  <div>
                    {tours.length > 1 && (
                      <button
                        onClick={() => {
                          setSelectedTourId(null)
                          setError(null)
                          setFormData({ name: '', email: '', phone: '', numParticipants: 1, notes: '' })
                        }}
                        className="mb-4 flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                        style={{ color: s.sectionSubtitleColor }}
                      >
                        &larr; Vissza a túrákhoz
                      </button>
                    )}

                    {/* Tour details */}
                    <div className="mb-6">
                      <h4 className="font-playfair text-2xl font-bold" style={{ color: s.sectionTitleColor }}>
                        {selectedTour.title}
                      </h4>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: s.tourDayBgColor }}>
                          <Clock className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                          <span>{selectedTour.start_time?.slice(0, 5)} &bull; {selectedTour.duration_minutes} perc</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: s.tourDayBgColor }}>
                          <MapPin className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                          <span className="flex-1">{selectedTour.meeting_point}</span>
                          {selectedTour.meeting_point_url && (
                            <a href={selectedTour.meeting_point_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                              <ExternalLink className="h-3.5 w-3.5" style={{ color: s.modalAccentColor }} />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: s.tourDayBgColor }}>
                          <Euro className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                          <span>{selectedTour.price_per_person} EUR / f&#337;</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: s.tourDayBgColor }}>
                          <Users className="h-4 w-4" style={{ color: s.modalAccentColor }} />
                          <span className="font-medium text-green-600">
                            {selectedTour.max_participants - (selectedTour.current_bookings || 0)} szabad hely
                          </span>
                        </div>
                      </div>

                      {selectedTour.description && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed" style={{ color: s.sectionSubtitleColor }}>
                          {selectedTour.description}
                        </p>
                      )}

                      {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {selectedTour.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm" style={{ color: s.sectionSubtitleColor }}>
                              <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Booking Form */}
                    <div className="rounded-2xl border-2 p-5" style={{ borderColor: s.modalAccentColor + '30', backgroundColor: s.tourDayBgColor }}>
                      <h5 className="mb-4 font-playfair text-lg font-bold" style={{ color: s.sectionTitleColor }}>
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
                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:opacity-80"
                                style={{ borderColor: s.modalAccentColor + '40' }}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-lg font-bold" style={{ color: s.sectionTitleColor }}>
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
                                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:opacity-80"
                                style={{ borderColor: s.modalAccentColor + '40' }}
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
                          <div className="flex justify-between text-sm" style={{ color: s.sectionSubtitleColor }}>
                            <span>{formData.numParticipants} x {selectedTour.price_per_person} EUR</span>
                            <span className="font-bold" style={{ color: s.sectionTitleColor }}>
                              {formData.numParticipants * selectedTour.price_per_person} EUR
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: s.sectionSubtitleColor }}>
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

                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full rounded-lg py-3 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: s.bookButtonBgColor, color: s.bookButtonTextColor }}
                        >
                          {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Foglalás...
                            </span>
                          ) : (
                            'Helyfoglalás megerősítése'
                          )}
                        </button>
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
