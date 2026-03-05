import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CheckCircle, CalendarDays, Clock, MapPin, Users, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams
  const supabase = await createClient()

  let booking = null
  let tour = null

  if (order) {
    const { data } = await supabase
      .from('walking_tour_bookings')
      .select('*, walking_tours(*)')
      .eq('order_number', order)
      .single()

    if (data) {
      booking = data
      tour = data.walking_tours
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
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />

      <div className="py-24">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-2xl md:p-12">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="mb-4 font-playfair text-3xl font-bold text-parisian-grey-800 md:text-4xl">
              Foglalás sikeres!
            </h1>

            {booking && tour ? (
              <>
                <p className="mb-8 text-lg text-parisian-grey-600">
                  Köszönjük a foglalásod! Találkozunk a sétatúrán!
                </p>

                {/* Booking Details */}
                <div className="mb-8 rounded-xl bg-gradient-to-br from-parisian-beige-50 to-parisian-cream-50 border border-parisian-beige-200 p-6 text-left">
                  <div className="mb-4 text-center">
                    <span className="text-sm text-parisian-grey-500">Rendelésszám</span>
                    <p className="text-xl font-bold text-parisian-grey-800">#{booking.order_number}</p>
                  </div>

                  <h3 className="mb-3 font-playfair text-xl font-bold text-parisian-grey-800 text-center">
                    {tour.title}
                  </h3>

                  <div className="space-y-3 text-sm text-parisian-grey-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-parisian-beige-500" />
                      <span>{formatDate(tour.tour_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-parisian-beige-500" />
                      <span>{tour.start_time?.slice(0, 5)} • {tour.duration_minutes} perc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-parisian-beige-500" />
                      <span>{tour.meeting_point}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-parisian-beige-500" />
                      <span>
                        {booking.num_participants} fő •{' '}
                        <strong>{Number(booking.total_amount).toFixed(0)} EUR</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Min participants notice */}
                <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                  <strong>Fontos:</strong> A túra min. {tour.min_participants} főtől indul.
                  Ha nem éri el a létszám a minimumot, értesítünk emailben.
                </div>

                {/* Payment info */}
                <div className="mb-8 rounded-lg bg-parisian-beige-50 border border-parisian-beige-200 p-4 text-sm text-parisian-grey-600">
                  Az összeg (<strong>{Number(booking.total_amount).toFixed(0)} EUR</strong>) a helyszínen készpénzzel fizetendő.
                </div>
              </>
            ) : (
              <p className="mb-8 text-lg text-parisian-grey-600">
                A foglalásod sikeresen rögzítettük!
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/walking-tours"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-parisian-grey-800 px-8 py-4 font-semibold text-white transition-all hover:bg-parisian-grey-700"
              >
                Összes sétatúra
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-parisian-grey-800 px-8 py-4 font-semibold text-parisian-grey-800 transition-all hover:bg-parisian-beige-50"
              >
                Vissza a főoldalra
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
