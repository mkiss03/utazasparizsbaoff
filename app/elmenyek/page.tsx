import { createClient } from '@/lib/supabase/server'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, Euro, ChevronRight, Sparkles } from 'lucide-react'
import type { Experience } from '@/lib/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Párizsi Élmények | Utazás Párizsba',
  description: 'Különleges párizsi élmények: Notre-Dame élménytúra, sajtkóstoló és egyéb exkluzív programok magyar idegenvezetéssel.',
}

export default async function ElmenyekPage() {
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const list = (experiences || []) as Experience[]

  return (
    <>
      <NavigationWrapper />
      <main className="min-h-screen bg-[#FAF7F2]">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F2937] via-[#2d3748] to-[#1F2937]" />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C4A882 0%, transparent 60%), radial-gradient(circle at 70% 30%, #9F8C6E 0%, transparent 60%)' }}
          />
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#C4A882]/20 border border-[#C4A882]/40 rounded-full px-5 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-[#C4A882]" />
              <span className="text-[#C4A882] text-sm font-semibold tracking-wider uppercase">
                Exkluzív programok
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Párizsi{' '}
              <span className="text-[#C4A882]">Élmények</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Különleges, kis csoportos programok tapasztalt magyar idegenvezetővel.
              Fedezze fel Párizst egy egészen egyedi perspektívából.
            </p>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="container mx-auto px-4 py-16">
          {list.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              Hamarosan érkeznek az élmények...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {list.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/elmenyek/${exp.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => {}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Accent badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      exp.design_accent === 'VR_3D'
                        ? 'bg-purple-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {exp.design_accent === 'VR_3D' ? '✦ VR Élmény' : '✦ Gasztronómia'}
                    </div>
                    {/* Price */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1">
                      <Euro className="h-4 w-4 text-[#C4A882]" />
                      <span className="font-bold text-[#1F2937]">{exp.price}</span>
                      <span className="text-xs text-slate-500">/ fő</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-[#1F2937] mb-2 group-hover:text-[#C4A882] transition-colors leading-tight">
                      {exp.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {exp.short_description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                      {exp.group_size && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />{exp.group_size}
                        </span>
                      )}
                      {exp.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />{exp.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[#C4A882] text-sm font-semibold">
                      Részletek és foglalás
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA strip */}
        <section className="bg-[#1F2937] py-14">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[#C4A882] font-semibold mb-2 text-sm tracking-wider uppercase">Magyar idegenvezetővel</p>
            <h3 className="font-playfair text-2xl md:text-3xl text-white font-bold mb-4">
              Személyre szabott párizsi kalandok
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-6">
              Egyéni igények, különleges alkalmak? Írjon nekünk és összerakjuk az álmai párizsi programját!
            </p>
            <a
              href="/#contact"
              className="inline-block bg-[#C4A882] hover:bg-[#B09672] text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Kapcsolatfelvétel
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
