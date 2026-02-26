'use client'

import { useRef, useState, useEffect } from 'react'
import { LandingPageSettings } from '@/lib/types/landing-page'
import { DeviceMode } from './PreviewToolbar'
import {
  Star,
  MapPin,
  CheckCircle,
  Lock,
  Send,
  ArrowRight,
  Calendar,
  Map,
  Ship,
  Footprints,
} from 'lucide-react'

interface LandingPagePreviewProps {
  settings: LandingPageSettings
  device: DeviceMode
  activeSection?: string
  onSectionClick?: (sectionKey: string) => void
}

const deviceWidths: Record<DeviceMode, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
}

export default function LandingPagePreview({
  settings,
  device,
  activeSection,
  onSectionClick,
}: LandingPagePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const targetWidth = deviceWidths[device]

  // Dynamically measure wrapper width
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWrapperWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Dynamically measure content height at full target width
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContentHeight(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Scale: shrink content to fit wrapper, never enlarge beyond 1:1
  const scale = wrapperWidth > 0 ? Math.min(1, wrapperWidth / targetWidth) : 0.5
  const visualHeight = contentHeight * scale
  const visualWidth = targetWidth * scale
  // Center horizontally for mobile/tablet when scaled content is narrower
  const offsetX = Math.max(0, (wrapperWidth - visualWidth) / 2)

  return (
    <div ref={wrapperRef} className="w-full select-none">
      {/* Browser Chrome Bar */}
      <div className="flex items-center gap-3 rounded-t-2xl border border-b-0 border-slate-200/80 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200/60 bg-white/80 px-3 py-1.5 text-xs text-slate-500 shadow-inner">
          <Lock className="h-3 w-3 text-green-600" />
          <span>utazasparizsba.com</span>
        </div>
      </div>

      {/* Preview Viewport — pixel-precise height via ResizeObserver */}
      <div
        className="relative overflow-hidden rounded-b-2xl border border-slate-200/80 bg-white shadow-lg"
        style={{ height: visualHeight > 0 ? visualHeight : 400 }}
      >
        <div
          ref={contentRef}
          style={{
            width: targetWidth,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: offsetX,
          }}
        >
          {/* ========== HERO ========== */}
          {settings.hero.visible && (
            <PreviewSection sectionKey="hero" active={activeSection === 'hero'} onClick={onSectionClick} label="Hero">
              <div
                className="relative flex min-h-[420px] flex-col items-center justify-center p-12 text-center text-white"
                style={{
                  backgroundImage: settings.hero.backgroundImage ? `url(${settings.hero.backgroundImage})` : undefined,
                  backgroundColor: '#1a1a2e',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
                <div className="relative z-10 max-w-2xl">
                  <span
                    className="mb-4 inline-block rounded-full px-5 py-1.5 text-xs font-medium tracking-wide"
                    style={{ backgroundColor: settings.hero.badgeBgColor, color: settings.hero.badgeTextColor }}
                  >
                    {settings.hero.badgeText}
                  </span>
                  <h1 className="mb-3 text-4xl font-bold leading-tight">{settings.hero.headline}</h1>
                  <p className="mb-6 text-base leading-relaxed opacity-90">{settings.hero.subheadline}</p>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg"
                    style={{ backgroundColor: settings.hero.ctaBgColor, color: settings.hero.ctaTextColor }}
                  >
                    {settings.hero.ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                {/* Floating badges */}
                <div className="absolute bottom-8 left-8 z-10 rounded-xl bg-white/95 px-4 py-2.5 text-left shadow-lg backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-800">{settings.hero.floatingBadge1Title}</p>
                  <p className="text-[10px] text-slate-500">{settings.hero.floatingBadge1Subtitle}</p>
                </div>
                <div className="absolute bottom-8 right-8 z-10 rounded-xl bg-white/95 px-4 py-2.5 text-left shadow-lg backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-800">{settings.hero.floatingBadge2Title}</p>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== ABOUT ========== */}
          {settings.about.visible && (
            <PreviewSection sectionKey="about" active={activeSection === 'about'} onClick={onSectionClick} label="Rólam">
              <div className="bg-white px-12 py-16">
                <div className="mb-8 text-center">
                  <span
                    className="inline-block rounded-full px-4 py-1 text-xs font-medium"
                    style={{ backgroundColor: settings.about.sectionBadgeBgColor, color: settings.about.sectionBadgeTextColor }}
                  >
                    {settings.about.sectionBadge}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold" style={{ color: settings.about.titleColor }}>
                    {settings.about.title}
                  </h2>
                </div>
                <div className="mx-auto flex max-w-4xl items-start gap-10">
                  <div className="h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                    {settings.about.aboutImage && (
                      <img src={settings.about.aboutImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xl font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat1Value}</p>
                        <p className="mt-1 text-xs text-slate-500">{settings.about.stat1Label}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xl font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat2Value}</p>
                        <p className="mt-1 text-xs text-slate-500">{settings.about.stat2Label}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xl font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat3Value}</p>
                        <p className="mt-1 text-xs text-slate-500">{settings.about.stat3Label}</p>
                      </div>
                    </div>
                    {settings.about.quoteText && (
                      <>
                        <p className="mt-4 text-sm italic text-slate-600">&ldquo;{settings.about.quoteText}&rdquo;</p>
                        <p className="mt-1 text-xs text-slate-400">{settings.about.quoteAuthor}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== SERVICES ========== */}
          {settings.services.visible && (
            <PreviewSection sectionKey="services" active={activeSection === 'services'} onClick={onSectionClick} label="Szolgáltatások">
              <div className="bg-[#FAF7F2] px-12 py-16">
                <div className="text-center">
                  <span
                    className="inline-block rounded-full px-4 py-1 text-xs font-medium"
                    style={{ backgroundColor: settings.services.sectionBadgeBgColor, color: settings.services.sectionBadgeTextColor }}
                  >
                    {settings.services.sectionBadge}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold" style={{ color: settings.services.titleColor }}>
                    {settings.services.title}
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: settings.services.subtitleColor }}>
                    {settings.services.subtitle}
                  </p>
                </div>
                <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
                      <div className="mb-3 h-24 rounded-lg bg-slate-100" />
                      <div className="h-3 w-3/4 rounded bg-slate-200" />
                      <div className="mt-2 h-2 w-full rounded bg-slate-100" />
                      <div className="mt-1 h-2 w-2/3 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== WALKING TOURS ========== */}
          {settings.walkingTours.visible && (
            <PreviewSection sectionKey="walkingTours" active={activeSection === 'walkingTours'} onClick={onSectionClick} label="Sétatúrák">
              <div className="bg-white px-12 py-16">
                <div className="text-center">
                  <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-medium text-emerald-700">
                    Sétatúrák
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-800">Foglalj Sétatúrát</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">Válassz a közelgő túráink közül és fedezd fel Párizst gyalog</p>
                </div>
                <div className="mx-auto mt-8 max-w-xl">
                  {/* Calendar mockup */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-6 py-3">
                      <span className="text-sm font-bold text-slate-700">Február 2026</span>
                      <div className="flex gap-1">
                        <div className="h-7 w-7 rounded-lg bg-slate-100" />
                        <div className="h-7 w-7 rounded-lg bg-slate-100" />
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 p-4 text-center text-[10px] text-slate-400">
                      {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map((d) => (
                        <div key={d} className="py-1 font-medium">{d}</div>
                      ))}
                      {Array.from({ length: 28 }, (_, i) => (
                        <div
                          key={i}
                          className={`rounded-lg py-2 text-xs ${
                            [4, 11, 18, 25].includes(i)
                              ? 'bg-emerald-500 font-bold text-white'
                              : 'text-slate-600'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== LOUVRE TOUR ========== */}
          {settings.louvreTour.visible && (
            <PreviewSection sectionKey="louvreTour" active={activeSection === 'louvreTour'} onClick={onSectionClick} label="Louvre Túra">
              <div className="bg-white px-12 py-16">
                <div className="text-center">
                  <span
                    className="inline-block rounded-full px-4 py-1 text-xs font-medium"
                    style={{ backgroundColor: settings.louvreTour.sectionBadgeBgColor, color: settings.louvreTour.sectionBadgeTextColor }}
                  >
                    {settings.louvreTour.sectionBadge}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold" style={{ color: settings.louvreTour.titleColor }}>
                    {settings.louvreTour.title}
                  </h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: settings.louvreTour.subtitleColor }}>
                    {settings.louvreTour.subtitle}
                  </p>
                </div>
                {/* Timeline mockup */}
                <div className="mx-auto mt-8 max-w-md">
                  <div className="relative pl-8">
                    <div className="absolute left-3 top-0 h-full w-0.5 rounded-full" style={{ backgroundColor: `${settings.louvreTour.timelineColor}30` }} />
                    {[
                      { n: 1, title: 'Középkori erőd', wing: 'Sully', dur: '10p' },
                      { n: 2, title: 'Ókori Egyiptom', wing: 'Sully', dur: '20p' },
                      { n: 3, title: 'Milói Vénusz', wing: 'Sully', dur: '20p' },
                      { n: 4, title: 'Szamothrakéi Niké', wing: 'Denon', dur: '15p' },
                      { n: 5, title: 'Mona Lisa', wing: 'Denon', dur: '20p' },
                    ].map((s) => (
                      <div key={s.n} className="relative mb-4 flex items-start gap-3">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                          style={{ backgroundColor: settings.louvreTour.timelineColor }}
                        >
                          {s.n}
                        </div>
                        <div className="flex-1 rounded-lg border border-slate-100 p-2.5" style={{ backgroundColor: settings.louvreTour.cardBgColor }}>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-bold text-slate-700">{s.title}</p>
                            <span className="text-[9px] text-slate-400">{s.dur}</span>
                          </div>
                          <span
                            className="mt-1 inline-block rounded px-1.5 py-0.5 text-[8px] font-medium"
                            style={{ backgroundColor: settings.louvreTour.wingBadgeBgColor, color: settings.louvreTour.wingBadgeTextColor }}
                          >
                            {s.wing}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="text-center text-[9px] text-slate-400">... +5 további megálló</div>
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== FLASHCARDS PROMO ========== */}
          {settings.flashcardsPromo.visible && (
            <PreviewSection sectionKey="flashcardsPromo" active={activeSection === 'flashcardsPromo'} onClick={onSectionClick} label="Flashcards">
              <div className="bg-white px-12 py-16">
                <div className="text-center">
                  <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-medium text-amber-700">
                    {settings.flashcardsPromo.sectionBadge}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-800">{settings.flashcardsPromo.title}</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{settings.flashcardsPromo.subtitle}</p>
                </div>
                <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border shadow-lg">
                  <div
                    className="p-6 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${settings.flashcardsPromo.headerGradientFrom}, ${settings.flashcardsPromo.headerGradientTo})` }}
                  >
                    <p className="text-lg font-bold">{settings.flashcardsPromo.cardTitle}</p>
                    <p className="mt-1 text-sm opacity-80">{settings.flashcardsPromo.cardSubtitle}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-600">{settings.flashcardsPromo.cardDescription}</p>
                    <div className="mt-3 space-y-1.5">
                      {[settings.flashcardsPromo.feature1, settings.flashcardsPromo.feature2, settings.flashcardsPromo.feature3].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== PARIS DISTRICT GUIDE ========== */}
          {settings.parisDistrictGuide.visible && (
            <PreviewSection sectionKey="parisDistrictGuide" active={activeSection === 'parisDistrictGuide'} onClick={onSectionClick} label="Kerületek">
              <div className="bg-white px-12 py-16">
                <div className="text-center">
                  <span className="inline-block rounded-full bg-violet-100 px-4 py-1 text-xs font-medium text-violet-700">
                    Párizsi Kerületek
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-800">Fedezd fel a kerületeket</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">Ismerd meg Párizs egyedi negyedeit az interaktív térképünkkel</p>
                </div>
                <div className="mx-auto mt-8 flex max-w-4xl items-start gap-6">
                  {/* Map mockup */}
                  <div className="flex-1">
                    <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 p-8">
                      <Map className="mx-auto h-full w-full text-violet-200" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-violet-700 shadow-lg">
                          Interaktív Térkép
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* District card mockup */}
                  <div className="flex-1 space-y-3">
                    {['7. kerület – Eiffel-torony', '18. kerület – Montmartre', '4. kerület – Notre-Dame'].map((d, i) => (
                      <div key={i} className={`rounded-xl border p-4 ${i === 0 ? 'border-violet-300 bg-violet-50' : 'bg-white'}`}>
                        <p className="text-xs font-bold text-slate-700">{d}</p>
                        <div className="mt-1.5 h-2 w-3/4 rounded bg-slate-100" />
                        <div className="mt-1 h-2 w-1/2 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== MUSEUM GUIDE PROMO ========== */}
          {settings.museumGuidePromo.visible && (
            <PreviewSection sectionKey="museumGuidePromo" active={activeSection === 'museumGuidePromo'} onClick={onSectionClick} label="Múzeum Guide">
              <div className="bg-[#FAF7F2] px-12 py-16">
                <div className="text-center">
                  <span className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium text-indigo-700">
                    {settings.museumGuidePromo.sectionBadge}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-800">{settings.museumGuidePromo.title}</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{settings.museumGuidePromo.subtitle}</p>
                </div>
                <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border shadow-lg">
                  <div
                    className="p-6 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${settings.museumGuidePromo.promoHeaderGradientFrom}, ${settings.museumGuidePromo.promoHeaderGradientTo})` }}
                  >
                    <p className="text-lg font-bold">{settings.museumGuidePromo.promoCardTitle}</p>
                    <p className="mt-1 text-sm opacity-80">{settings.museumGuidePromo.promoCardSubtitle}</p>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-xs text-slate-600">{settings.museumGuidePromo.promoCardDescription}</p>
                    <div className="mt-3 space-y-1.5">
                      {[settings.museumGuidePromo.promoFeature1, settings.museumGuidePromo.promoFeature2, settings.museumGuidePromo.promoFeature3].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== TESTIMONIALS ========== */}
          {settings.testimonials.visible && (
            <PreviewSection sectionKey="testimonials" active={activeSection === 'testimonials'} onClick={onSectionClick} label="Vélemények">
              <div className="bg-white px-12 py-16 text-center">
                <h2 className="text-2xl font-bold" style={{ color: settings.testimonials.titleColor }}>
                  {settings.testimonials.title}
                </h2>
                <p className="mt-2 text-sm" style={{ color: settings.testimonials.subtitleColor }}>
                  {settings.testimonials.subtitle}
                </p>
                <div className="mx-auto mt-6 flex max-w-2xl gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 rounded-xl bg-slate-50 p-4">
                      <div className="flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="mt-2 h-2 w-full rounded bg-slate-200" />
                      <div className="mx-auto mt-1 h-2 w-3/4 rounded bg-slate-200" />
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-300" />
                        <div className="h-2 w-16 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm italic text-slate-500">{settings.testimonials.ctaText}</p>
              </div>
            </PreviewSection>
          )}

          {/* ========== BLOG ========== */}
          {settings.blog.visible && (
            <PreviewSection sectionKey="blog" active={activeSection === 'blog'} onClick={onSectionClick} label="Blog">
              <div className="bg-[#FAF7F2] px-12 py-16">
                <div className="text-center">
                  <h2 className="text-2xl font-bold" style={{ color: settings.blog.titleColor }}>
                    {settings.blog.title}
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: settings.blog.subtitleColor }}>
                    {settings.blog.subtitle}
                  </p>
                </div>
                <div className="mx-auto mt-6 grid max-w-4xl grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                      <div className="h-28 bg-slate-200" />
                      <div className="p-4">
                        <div className="h-2.5 w-3/4 rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-full rounded bg-slate-100" />
                        <div className="mt-1 h-2 w-2/3 rounded bg-slate-100" />
                        <p className="mt-3 text-xs font-medium text-amber-700">{settings.blog.readMoreText} &rarr;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== CONTACT ========== */}
          {settings.contact.visible && (
            <PreviewSection sectionKey="contact" active={activeSection === 'contact'} onClick={onSectionClick} label="Kapcsolat">
              <div className="bg-white px-12 py-16">
                <div className="text-center">
                  <h2 className="text-2xl font-bold" style={{ color: settings.contact.titleColor }}>
                    {settings.contact.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{settings.contact.subtitle}</p>
                </div>
                <div className="mx-auto mt-8 flex max-w-3xl gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      <span>{settings.contact.locationValue}</span>
                    </div>
                    <div className="mt-3 rounded-xl bg-slate-50 p-4">
                      <div className="h-2 w-20 rounded bg-slate-200" />
                      <div className="mt-2 h-2 w-32 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-9 rounded-lg border border-slate-200 bg-slate-50" />
                    <div className="h-9 rounded-lg border border-slate-200 bg-slate-50" />
                    <div className="h-20 rounded-lg border border-slate-200 bg-slate-50" />
                    <div className="flex w-fit items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-medium text-white">
                      <Send className="h-3 w-3" />
                      {settings.contact.formButtonText}
                    </div>
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== NEWSLETTER ========== */}
          {settings.newsletter.visible && (
            <PreviewSection sectionKey="newsletter" active={activeSection === 'newsletter'} onClick={onSectionClick} label="Hírlevél">
              <div className="px-12 py-16 text-center" style={{ backgroundColor: settings.newsletter.sectionBgColor }}>
                <h2 className="text-2xl font-bold" style={{ color: settings.newsletter.titleColor }}>
                  {settings.newsletter.title}
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{settings.newsletter.description}</p>
                <div className="mx-auto mt-4 flex max-w-md items-center gap-2">
                  <div className="h-10 flex-1 rounded-lg border border-slate-200 bg-white" />
                  <div className="rounded-lg bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white">
                    {settings.newsletter.ctaButtonText}
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  {[settings.newsletter.feature1, settings.newsletter.feature2, settings.newsletter.feature3].map((f, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== FOOTER ========== */}
          {settings.footer.visible && (
            <PreviewSection sectionKey="footer" active={activeSection === 'footer'} onClick={onSectionClick} label="Lábléc">
              <div className="px-12 py-12 text-white" style={{ backgroundColor: settings.footer.bgColor }}>
                <div className="mx-auto flex max-w-4xl items-start justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      {settings.footer.brandTitle}{' '}
                      <span style={{ color: settings.footer.accentColor }}>{settings.footer.brandHighlight}</span>
                    </p>
                    <p className="mt-1 text-xs opacity-60">{settings.footer.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: settings.footer.accentColor }}>
                      {settings.footer.servicesTitle}
                    </p>
                    <p className="mt-1 text-xs opacity-60">{settings.footer.service1}</p>
                    <p className="text-xs opacity-60">{settings.footer.service2}</p>
                    <p className="text-xs opacity-60">{settings.footer.service3}</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-center">
                  <p className="text-[10px] opacity-40">&copy; {new Date().getFullYear()} {settings.footer.copyrightText}</p>
                </div>
              </div>
            </PreviewSection>
          )}

          {/* ========== BOAT TOUR (floating element) ========== */}
          {settings.boatTour.visible && (
            <PreviewSection sectionKey="boatTour" active={activeSection === 'boatTour'} onClick={onSectionClick} label="Hajózás">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-12 py-8">
                <div className="mx-auto flex max-w-3xl items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
                    <Ship className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Hajózás Párizsban</p>
                    <p className="mt-0.5 text-xs text-slate-500">Szajna-parti sétahajózás — A lebegő gomb a képernyő alján jelenik meg</p>
                  </div>
                  <div className="rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm">
                    Hajózás
                  </div>
                </div>
              </div>
            </PreviewSection>
          )}
        </div>
      </div>
    </div>
  )
}

/** Clickable preview section wrapper with hover/active highlight */
function PreviewSection({
  sectionKey,
  active,
  onClick,
  label,
  children,
}: {
  sectionKey: string
  active: boolean
  onClick?: (key: string) => void
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`group relative cursor-pointer transition-all duration-200 ${
        active
          ? 'ring-2 ring-inset ring-blue-500'
          : 'hover:ring-2 hover:ring-inset hover:ring-blue-300/50'
      }`}
      onClick={() => onClick?.(sectionKey)}
    >
      {children}
      <div
        className={`absolute left-0 top-0 z-20 rounded-br-lg px-2.5 py-1 text-[10px] font-bold text-white transition-opacity ${
          active ? 'bg-blue-500 opacity-100' : 'bg-blue-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        {label}
      </div>
    </div>
  )
}
