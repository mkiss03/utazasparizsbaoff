import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { DiscoverItem } from '@/lib/types/database'

export const revalidate = 60

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('discover_items')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const discoverItems = (items as DiscoverItem[]) || []

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-french-blue-500 via-french-blue-600 to-french-blue-700 py-20 text-white md:py-32">
          <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-french-red-500 opacity-20 blur-3xl" />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <MapPin className="h-10 w-10" />
            </div>
            <h1 className="mb-6 font-playfair text-5xl font-bold md:text-6xl lg:text-7xl">
              Fedezze Fel Párizst
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-white/90">
              Merüljön el a fények városának varázslatos világában. Gasztronómia,
              művészet, történelem, rejtett kincsek - minden, amit Párizsról
              tudnia kell!
            </p>
          </div>
        </section>

        {/* Discover Items Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {discoverItems.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {discoverItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link_url || '#'}
                    className="group relative overflow-hidden rounded-3xl bg-slate-50 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Image */}
                    <div className="relative h-72 w-full overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-french-blue-100 to-french-blue-200">
                          <span className="text-6xl">📍</span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-french-blue-500/90 via-french-blue-500/50 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {/* Category Badge */}
                      {item.category && (
                        <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="mb-2 font-playfair text-2xl font-bold">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="mb-4 text-sm leading-relaxed text-white/90">
                          {item.description}
                        </p>
                      )}

                      {/* Arrow Icon */}
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <span>Tudj meg többet</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <MapPin className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <h3 className="mb-2 font-playfair text-2xl font-bold text-slate-500">
                  Hamarosan érkeznek a felfedezések!
                </h3>
                <p className="text-slate-400">
                  Dolgozunk azon, hogy a legjobb párizsi élményeket hozzuk el Önnek.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 font-playfair text-4xl font-bold text-french-blue-500 md:text-5xl">
              Készen áll a felfedezésre?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              Csatlakozzon hozzánk egy felejthetetlen párizsi kalandhoz.
              Válasszon túráink közül, vagy kérjen egyedi ajánlatot!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#tours"
                className="inline-flex items-center gap-2 rounded-full bg-french-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-french-blue-600 hover:shadow-xl"
              >
                <span>Túrák megtekintése</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-french-blue-500 px-8 py-4 font-semibold text-french-blue-500 transition-all hover:bg-french-blue-500 hover:text-white"
              >
                <span>Kapcsolatfelvétel</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
