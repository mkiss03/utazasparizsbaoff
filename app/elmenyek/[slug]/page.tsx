import { createClient } from '@/lib/supabase/server'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import BookingWidget from './BookingWidget'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Check, Clock, Users, Zap, UtensilsCrossed } from 'lucide-react'
import type { Experience } from '@/lib/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('experiences')
    .select('title, short_description')
    .eq('slug', params.slug)
    .maybeSingle()
  return {
    title: data ? `${data.title} | Utazás Párizsba` : 'Élmény | Utazás Párizsba',
    description: data?.short_description || '',
  }
}

// ── VR / Notre-Dame decorative visual ──────────────────────────────────────
function VRDeskIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 blur-2xl" />
      {/* Cathedral wireframe SVG */}
      <div className="relative bg-gradient-to-br from-[#0f0f23] to-[#1a1a3e] rounded-3xl p-8 border border-purple-500/30">
        <svg viewBox="0 0 200 160" className="w-full h-auto opacity-90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground */}
          <line x1="20" y1="145" x2="180" y2="145" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="2,2" />
          {/* Main towers - left */}
          <rect x="28" y="60" width="28" height="85" stroke="#A78BFA" strokeWidth="0.8" fill="none" />
          <polygon points="28,60 42,30 56,60" stroke="#C4B5FD" strokeWidth="0.8" fill="none" />
          {/* Main towers - right */}
          <rect x="144" y="60" width="28" height="85" stroke="#A78BFA" strokeWidth="0.8" fill="none" />
          <polygon points="144,60 158,30 172,60" stroke="#C4B5FD" strokeWidth="0.8" fill="none" />
          {/* Central nave */}
          <rect x="56" y="80" width="88" height="65" stroke="#8B5CF6" strokeWidth="0.8" fill="none" />
          {/* Rose window */}
          <circle cx="100" cy="98" r="12" stroke="#DDD6FE" strokeWidth="0.8" fill="none" />
          <circle cx="100" cy="98" r="7" stroke="#DDD6FE" strokeWidth="0.5" fill="none" />
          <line x1="88" y1="98" x2="112" y2="98" stroke="#DDD6FE" strokeWidth="0.5" />
          <line x1="100" y1="86" x2="100" y2="110" stroke="#DDD6FE" strokeWidth="0.5" />
          <line x1="91.5" y1="89.5" x2="108.5" y2="106.5" stroke="#DDD6FE" strokeWidth="0.5" />
          <line x1="108.5" y1="89.5" x2="91.5" y2="106.5" stroke="#DDD6FE" strokeWidth="0.5" />
          {/* Flying buttresses */}
          <path d="M56,110 Q40,100 42,80" stroke="#7C3AED" strokeWidth="0.6" fill="none" />
          <path d="M144,110 Q160,100 158,80" stroke="#7C3AED" strokeWidth="0.6" fill="none" />
          {/* Spire */}
          <line x1="100" y1="80" x2="100" y2="50" stroke="#C4B5FD" strokeWidth="0.8" />
          <polygon points="96,50 100,35 104,50" stroke="#DDD6FE" strokeWidth="0.6" fill="none" />
          {/* Cross on spire */}
          <line x1="97" y1="40" x2="103" y2="40" stroke="#DDD6FE" strokeWidth="0.8" />
          {/* Dots as grid */}
          {[0,1,2,3].map(i => [0,1,2,3].map(j => (
            <circle key={`${i}-${j}`} cx={30 + i * 47} cy={20 + j * 40} r="0.8" fill="#4C1D95" opacity="0.5" />
          )))}
          {/* VR label */}
          <text x="100" y="158" textAnchor="middle" fill="#7C3AED" fontSize="5" fontFamily="monospace">
            VIRTUAL RECONSTRUCTION · 3D
          </text>
        </svg>
        {/* Scan line effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/5 to-transparent animate-pulse" />
        </div>
        {/* Corner labels */}
        <div className="absolute top-3 left-3 text-purple-400 text-xs font-mono opacity-60">REC ●</div>
        <div className="absolute top-3 right-3 text-purple-400 text-xs font-mono opacity-60">4K · VR</div>
      </div>
    </div>
  )
}

// ── Gastronomy decorative visual ──────────────────────────────────────────
function GastronomyIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-2xl" />
      <div className="relative bg-gradient-to-br from-[#1c1208] to-[#2d1f0e] rounded-3xl p-6 border border-amber-600/30 text-center">
        <div className="text-6xl mb-3">🧀</div>
        <p className="text-amber-300 font-playfair text-lg font-semibold mb-1">Fromage Français</p>
        <p className="text-amber-500/70 text-xs font-mono">PARIS · DÉGUSTATION PREMIUM</p>
        <div className="mt-4 flex justify-center gap-3">
          {['Brie', 'Comté', 'Roquefort', 'Camembert'].map((c) => (
            <span key={c} className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full border border-amber-700/50">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function ExperienceDetailPage({ params }: Props) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!data) notFound()

  const experience = data as Experience
  const isVR = experience.design_accent === 'VR_3D'

  // Split full_description into paragraphs
  const paragraphs = experience.full_description
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <NavigationWrapper />
      <main className="min-h-screen bg-[#FAF7F2]">
        {/* Hero banner */}
        <section className={`relative pt-28 pb-0 overflow-hidden ${
          isVR
            ? 'bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#1F2937]'
            : 'bg-gradient-to-br from-[#1c1208] via-[#2d1f0e] to-[#1F2937]'
        }`}>
          {/* Background image overlay */}
          <div className="absolute inset-0">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
          </div>

          <div className="relative container mx-auto px-4 pb-16">
            {/* Back link */}
            <Link
              href="/elmenyek"
              className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-8 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Vissza az élményekhez
            </Link>

            {/* Accent badge */}
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 ${
              isVR
                ? 'bg-purple-600/30 border border-purple-400/40 text-purple-300'
                : 'bg-amber-600/30 border border-amber-400/40 text-amber-300'
            }`}>
              {isVR ? <Zap className="h-4 w-4" /> : <UtensilsCrossed className="h-4 w-4" />}
              {isVR ? 'VR / 3D Virtuális Élmény' : 'Gasztronómiai Élmény'}
            </div>

            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
              {experience.title}
            </h1>
            <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
              {experience.short_description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                isVR ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {experience.price} € / fő
              </div>
              {experience.group_size && (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Users className="h-4 w-4" />
                  {experience.group_size}
                </div>
              )}
              {experience.duration && (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="h-4 w-4" />
                  {experience.duration}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: description + includes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Decorative visual */}
              <div className="py-2">
                {isVR ? <VRDeskIllustration /> : <GastronomyIllustration />}
              </div>

              {/* Full image */}
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-[#1F2937] mb-5">
                  A programról
                </h2>
                <div className="space-y-4">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* What's included */}
              {experience.includes.length > 0 && (
                <div className={`rounded-2xl p-8 ${
                  isVR
                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100'
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'
                }`}>
                  <h2 className="font-playfair text-2xl font-bold text-[#1F2937] mb-5">
                    A programba beletartozik
                  </h2>
                  <ul className="space-y-3">
                    {experience.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          isVR ? 'bg-purple-600' : 'bg-amber-600'
                        }`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: sticky booking widget */}
            <div className="lg:sticky lg:top-28 h-fit">
              <BookingWidget experience={experience} />

              {/* Trust badges */}
              <div className="mt-4 space-y-2 text-xs text-slate-400 text-center">
                <p>✓ Magyar nyelvű idegenvezetés</p>
                <p>✓ Kis létszámú, személyes program</p>
                <p>✓ Licencelt idegenvezető</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
