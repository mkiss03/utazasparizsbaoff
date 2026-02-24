'use client'

import { useRef } from 'react'
import { LandingPageSettings } from '@/lib/types/landing-page'
import { DeviceMode } from './PreviewToolbar'
import {
  Image,
  User,
  Briefcase,
  BookOpen,
  Landmark,
  Star,
  FileText,
  Mail,
  Bell,
  LayoutTemplate,
  MapPin,
  CheckCircle,
  ChevronRight,
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
  const containerRef = useRef<HTMLDivElement>(null)
  const targetWidth = deviceWidths[device]

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
      <div
        ref={containerRef}
        className="origin-top overflow-y-auto"
        style={{
          width: targetWidth,
          transform: `scale(${Math.min(1, 480 / targetWidth)})`,
          transformOrigin: 'top left',
          height: `${100 / Math.min(1, 480 / targetWidth)}%`,
        }}
      >
        {/* Hero Section */}
        {settings.hero.visible && (
          <PreviewSection
            sectionKey="hero"
            active={activeSection === 'hero'}
            onClick={onSectionClick}
          >
            <div
              className="relative flex min-h-[320px] flex-col items-center justify-center p-8 text-center text-white"
              style={{
                backgroundImage: settings.hero.backgroundImage ? `url(${settings.hero.backgroundImage})` : undefined,
                backgroundColor: '#1a1a2e',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10">
                <span
                  className="mb-3 inline-block rounded-full px-4 py-1 text-xs font-medium"
                  style={{ backgroundColor: settings.hero.badgeBgColor, color: settings.hero.badgeTextColor }}
                >
                  {settings.hero.badgeText}
                </span>
                <h1 className="mb-2 text-2xl font-bold">{settings.hero.headline}</h1>
                <p className="mb-4 text-sm opacity-90">{settings.hero.subheadline}</p>
                <span
                  className="inline-block rounded-full px-6 py-2 text-xs font-semibold"
                  style={{ backgroundColor: settings.hero.ctaBgColor, color: settings.hero.ctaTextColor }}
                >
                  {settings.hero.ctaText}
                </span>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* About Section */}
        {settings.about.visible && (
          <PreviewSection
            sectionKey="about"
            active={activeSection === 'about'}
            onClick={onSectionClick}
          >
            <div className="bg-white p-6">
              <div className="mb-4 text-center">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: settings.about.sectionBadgeBgColor, color: settings.about.sectionBadgeTextColor }}
                >
                  {settings.about.sectionBadge}
                </span>
                <h2 className="mt-2 text-lg font-bold" style={{ color: settings.about.titleColor }}>
                  {settings.about.title}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-lg font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat1Value}</p>
                  <p className="text-slate-500">{settings.about.stat1Label}</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat2Value}</p>
                  <p className="text-slate-500">{settings.about.stat2Label}</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: settings.about.statValueColor }}>{settings.about.stat3Value}</p>
                  <p className="text-slate-500">{settings.about.stat3Label}</p>
                </div>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Services Section */}
        {settings.services.visible && (
          <PreviewSection
            sectionKey="services"
            active={activeSection === 'services'}
            onClick={onSectionClick}
          >
            <div className="bg-slate-50 p-6">
              <div className="text-center">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: settings.services.sectionBadgeBgColor, color: settings.services.sectionBadgeTextColor }}
                >
                  {settings.services.sectionBadge}
                </span>
                <h2 className="mt-2 text-lg font-bold" style={{ color: settings.services.titleColor }}>
                  {settings.services.title}
                </h2>
                <p className="mt-1 text-xs" style={{ color: settings.services.subtitleColor }}>
                  {settings.services.subtitle}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg bg-white p-3 shadow-sm">
                    <div className="h-2 w-16 rounded bg-slate-200" />
                    <div className="mt-1 h-2 w-10 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Flashcards Promo Section */}
        {settings.flashcardsPromo.visible && (
          <PreviewSection
            sectionKey="flashcardsPromo"
            active={activeSection === 'flashcardsPromo'}
            onClick={onSectionClick}
          >
            <div className="bg-white p-6">
              <div className="text-center">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {settings.flashcardsPromo.sectionBadge}
                </span>
                <h2 className="mt-2 text-lg font-bold text-slate-800">{settings.flashcardsPromo.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{settings.flashcardsPromo.subtitle}</p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border">
                <div
                  className="p-4 text-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${settings.flashcardsPromo.headerGradientFrom}, ${settings.flashcardsPromo.headerGradientTo})`,
                  }}
                >
                  <p className="text-sm font-bold">{settings.flashcardsPromo.cardTitle}</p>
                  <p className="text-xs opacity-80">{settings.flashcardsPromo.cardSubtitle}</p>
                </div>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Museum Guide Promo Section */}
        {settings.museumGuidePromo.visible && (
          <PreviewSection
            sectionKey="museumGuidePromo"
            active={activeSection === 'museumGuidePromo'}
            onClick={onSectionClick}
          >
            <div className="bg-slate-50 p-6">
              <div className="text-center">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {settings.museumGuidePromo.sectionBadge}
                </span>
                <h2 className="mt-2 text-lg font-bold text-slate-800">{settings.museumGuidePromo.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{settings.museumGuidePromo.subtitle}</p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border">
                <div
                  className="p-4 text-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${settings.museumGuidePromo.promoHeaderGradientFrom}, ${settings.museumGuidePromo.promoHeaderGradientTo})`,
                  }}
                >
                  <p className="text-sm font-bold">{settings.museumGuidePromo.promoCardTitle}</p>
                  <p className="text-xs opacity-80">{settings.museumGuidePromo.promoCardSubtitle}</p>
                </div>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Testimonials Section */}
        {settings.testimonials.visible && (
          <PreviewSection
            sectionKey="testimonials"
            active={activeSection === 'testimonials'}
            onClick={onSectionClick}
          >
            <div className="bg-white p-6 text-center">
              <h2 className="text-lg font-bold" style={{ color: settings.testimonials.titleColor }}>
                {settings.testimonials.title}
              </h2>
              <p className="mt-1 text-xs" style={{ color: settings.testimonials.subtitleColor }}>
                {settings.testimonials.subtitle}
              </p>
              <div className="mt-3 flex justify-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Blog Section */}
        {settings.blog.visible && (
          <PreviewSection
            sectionKey="blog"
            active={activeSection === 'blog'}
            onClick={onSectionClick}
          >
            <div className="bg-slate-50 p-6">
              <div className="text-center">
                <h2 className="text-lg font-bold" style={{ color: settings.blog.titleColor }}>
                  {settings.blog.title}
                </h2>
                <p className="mt-1 text-xs" style={{ color: settings.blog.subtitleColor }}>
                  {settings.blog.subtitle}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-white p-2 shadow-sm">
                    <div className="h-12 rounded bg-slate-200" />
                    <div className="mt-1 h-2 w-full rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Contact Section */}
        {settings.contact.visible && (
          <PreviewSection
            sectionKey="contact"
            active={activeSection === 'contact'}
            onClick={onSectionClick}
          >
            <div className="bg-white p-6">
              <div className="text-center">
                <h2 className="text-lg font-bold" style={{ color: settings.contact.titleColor }}>
                  {settings.contact.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{settings.contact.subtitle}</p>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                <span>{settings.contact.locationValue}</span>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Newsletter Section */}
        {settings.newsletter.visible && (
          <PreviewSection
            sectionKey="newsletter"
            active={activeSection === 'newsletter'}
            onClick={onSectionClick}
          >
            <div className="p-6 text-center" style={{ backgroundColor: settings.newsletter.sectionBgColor }}>
              <h2 className="text-lg font-bold" style={{ color: settings.newsletter.titleColor }}>
                {settings.newsletter.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">{settings.newsletter.description}</p>
              <div className="mt-3 flex justify-center gap-2">
                {[settings.newsletter.feature1, settings.newsletter.feature2, settings.newsletter.feature3].map((f, i) => (
                  <span key={i} className="flex items-center gap-1 text-[10px] text-slate-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Footer */}
        {settings.footer.visible && (
          <PreviewSection
            sectionKey="footer"
            active={activeSection === 'footer'}
            onClick={onSectionClick}
          >
            <div className="p-6 text-center text-white" style={{ backgroundColor: settings.footer.bgColor }}>
              <p className="text-sm font-bold">
                {settings.footer.brandTitle}{' '}
                <span style={{ color: settings.footer.accentColor }}>{settings.footer.brandHighlight}</span>
              </p>
              <p className="mt-1 text-xs opacity-60">{settings.footer.tagline}</p>
              <p className="mt-2 text-[10px] opacity-40">{settings.footer.copyrightText}</p>
            </div>
          </PreviewSection>
        )}
      </div>
    </div>
  )
}

// Helper: clickable preview section wrapper
function PreviewSection({
  sectionKey,
  active,
  onClick,
  children,
}: {
  sectionKey: string
  active: boolean
  onClick?: (key: string) => void
  children: React.ReactNode
}) {
  return (
    <div
      className={`relative cursor-pointer transition-all ${
        active ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-1 hover:ring-blue-300'
      }`}
      onClick={() => onClick?.(sectionKey)}
    >
      {children}
      {active && (
        <div className="absolute left-0 top-0 bg-blue-500 px-2 py-0.5 text-[9px] font-bold text-white rounded-br">
          {sectionKey}
        </div>
      )}
    </div>
  )
}
