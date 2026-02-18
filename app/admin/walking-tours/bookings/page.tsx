'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Euro, Calendar, RotateCcw, Footprints } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { WalkingTourBookingWithTour } from '@/lib/types/database'

const paymentStatusLabels: Record<string, string> = {
  pending: 'Függőben',
  completed: 'Fizetve',
  refunded: 'Visszatérítve',
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  refunded: 'bg-red-100 text-red-700',
}

const bookingStatusLabels: Record<string, string> = {
  confirmed: 'Megerősítve',
  cancelled_by_user: 'Felh. lemondta',
  cancelled_by_admin: 'Admin lemondta',
}

export default function WalkingTourBookingsPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const tourId = searchParams.get('tour_id')

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['walking-tour-bookings', tourId],
    queryFn: async () => {
      let query = supabase
        .from('walking_tour_bookings')
        .select('*, walking_tours(title, tour_date, start_time)')
        .order('created_at', { ascending: false })

      if (tourId) {
        query = query.eq('walking_tour_id', tourId)
      }

      const { data } = await query
      return data as WalkingTourBookingWithTour[]
    },
  })

  const refundMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('walking_tour_bookings')
        .update({
          payment_status: 'refunded',
          booking_status: 'cancelled_by_admin',
        })
        .eq('id', bookingId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walking-tour-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['walking-tours'] })
    },
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTourDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const totalRevenue = bookings?.reduce((sum, b) => {
    if (b.payment_status === 'completed') return sum + Number(b.total_amount)
    return sum
  }, 0) || 0

  const totalParticipants = bookings?.reduce((sum, b) => {
    if (b.booking_status === 'confirmed' && b.payment_status === 'completed')
      return sum + b.num_participants
    return sum
  }, 0) || 0

  if (isLoading) {
    return <div className="p-8"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
            Túrafoglalások
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {tourId ? (
              <>
                Szűrve egy túrára —{' '}
                <Link href="/admin/walking-tours/bookings" className="text-french-blue-500 underline">
                  Összes megjelenítése
                </Link>
              </>
            ) : (
              'Összes sétatúra foglalás'
            )}
          </p>
        </div>
        <Link href="/admin/walking-tours">
          <Button variant="outline">
            <Footprints className="mr-2 h-4 w-4" /> Túrák kezelése
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Összes foglalás</p>
                <p className="mt-2 text-3xl font-bold text-french-blue-500">{bookings?.length || 0}</p>
              </div>
              <Users className="h-12 w-12 text-french-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Aktív résztvevők</p>
                <p className="mt-2 text-3xl font-bold text-french-blue-500">{totalParticipants}</p>
              </div>
              <Users className="h-12 w-12 text-french-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bevétel</p>
                <p className="mt-2 text-3xl font-bold text-french-red-500">€{totalRevenue.toFixed(0)}</p>
              </div>
              <Euro className="h-12 w-12 text-french-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-french-blue-500">
                        #{booking.order_number}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusColors[booking.payment_status]}`}>
                        {paymentStatusLabels[booking.payment_status]}
                      </span>
                      {booking.booking_status !== 'confirmed' && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {bookingStatusLabels[booking.booking_status]}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>
                          {booking.guest_name} — {booking.num_participants} fő
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">@</span>
                        <span>{booking.guest_email}</span>
                        {booking.guest_phone && <span>• {booking.guest_phone}</span>}
                      </div>
                      {booking.walking_tours && (
                        <div className="flex items-center gap-2">
                          <Footprints className="h-4 w-4 text-slate-400" />
                          <span>
                            {booking.walking_tours.title} — {formatTourDate(booking.walking_tours.tour_date)}{' '}
                            {booking.walking_tours.start_time?.slice(0, 5)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Foglalva: {formatDate(booking.created_at)}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="mt-2 text-sm text-slate-500 italic">Megjegyzés: {booking.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-french-blue-500">
                        €{Number(booking.total_amount).toFixed(0)}
                      </p>
                    </div>
                    {booking.payment_status === 'completed' && booking.booking_status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (window.confirm(`Biztosan visszatéríted a(z) ${booking.guest_name} foglalását (€${Number(booking.total_amount).toFixed(0)})?`)) {
                            refundMutation.mutate(booking.id)
                          }
                        }}
                        title="Visszatérítés"
                      >
                        <RotateCcw className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">Még nincs foglalás</h3>
            <p className="mt-2 text-sm text-slate-400">A foglalások itt jelennek majd meg</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
