'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Save, Loader2, RotateCcw, CheckCircle, Paintbrush } from 'lucide-react'
import { LandingPageSettings, defaultLandingPageSettings, SECTION_META } from '@/lib/types/landing-page'
import { revalidateLandingPage } from '@/app/actions/revalidate'

import SectionAccordion from '@/components/admin/page-builder/SectionAccordion'
import PreviewToolbar, { DeviceMode } from '@/components/admin/page-builder/preview/PreviewToolbar'
import LandingPagePreview from '@/components/admin/page-builder/preview/LandingPagePreview'

// Section Editors
import HeroEditor from '@/components/admin/page-builder/editors/HeroEditor'
import AboutEditor from '@/components/admin/page-builder/editors/AboutEditor'
import ServicesEditor from '@/components/admin/page-builder/editors/ServicesEditor'
import FlashcardsPromoEditor from '@/components/admin/page-builder/editors/FlashcardsPromoEditor'
import MuseumGuidePromoEditor from '@/components/admin/page-builder/editors/MuseumGuidePromoEditor'
import TestimonialsEditor from '@/components/admin/page-builder/editors/TestimonialsEditor'
import BlogEditor from '@/components/admin/page-builder/editors/BlogEditor'
import ContactEditor from '@/components/admin/page-builder/editors/ContactEditor'
import NewsletterEditor from '@/components/admin/page-builder/editors/NewsletterEditor'
import FooterEditor from '@/components/admin/page-builder/editors/FooterEditor'
import WalkingToursEditor from '@/components/admin/page-builder/editors/WalkingToursEditor'
import LouvreToursEditor from '@/components/admin/page-builder/editors/LouvreToursEditor'
import ParisDistrictGuideEditor from '@/components/admin/page-builder/editors/ParisDistrictGuideEditor'
import BoatTourEditor from '@/components/admin/page-builder/editors/BoatTourEditor'

const editorComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroEditor,
  about: AboutEditor,
  services: ServicesEditor,
  walkingTours: WalkingToursEditor,
  louvreTour: LouvreToursEditor,
  flashcardsPromo: FlashcardsPromoEditor,
  parisDistrictGuide: ParisDistrictGuideEditor,
  museumGuidePromo: MuseumGuidePromoEditor,
  testimonials: TestimonialsEditor,
  blog: BlogEditor,
  contact: ContactEditor,
  newsletter: NewsletterEditor,
  footer: FooterEditor,
  boatTour: BoatTourEditor,
}

export default function PageBuilderPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<LandingPageSettings>(defaultLandingPageSettings)
  const [saved, setSaved] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('hero')
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const hasInitialized = useRef(false)

  // Load landing_page_settings — once only, no auto-refetch
  const { data: dbRow, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['landing-page-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // Load DB-sourced content (profile + site_text_content) — once only
  const { data: dbContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['page-builder-db-content'],
    queryFn: async () => {
      const [profileRes, textsRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('site_text_content').select('*'),
      ])
      const profile = profileRes.data as any
      const textsMap: Record<string, string> = {}
      textsRes.data?.forEach((item: any) => {
        textsMap[item.key] = item.value || ''
      })
      return { profile, textsMap }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // Merge DB data into settings ONCE on initial load
  useEffect(() => {
    if (hasInitialized.current) return
    if (isLoadingSettings || isLoadingContent) return

    hasInitialized.current = true

    const merged = { ...defaultLandingPageSettings } as any

    // Merge saved landing_page_settings (if exists)
    if (dbRow?.settings) {
      const savedSettings = dbRow.settings as any
      for (const key of Object.keys(defaultLandingPageSettings) as (keyof LandingPageSettings)[]) {
        if (savedSettings[key]) {
          merged[key] = { ...(defaultLandingPageSettings as any)[key], ...savedSettings[key] }
        }
      }
    }

    // Fill empty DB-sourced fields from profile + site_text_content
    if (dbContent?.profile) {
      const p = dbContent.profile
      if (!merged.hero.headline) merged.hero.headline = p.hero_title || ''
      if (!merged.hero.subheadline) merged.hero.subheadline = p.hero_subtitle || ''
      if (!merged.hero.ctaText) merged.hero.ctaText = p.hero_cta_text || ''
      if (!merged.hero.backgroundImage) merged.hero.backgroundImage = p.hero_background_image || ''
      if (!merged.about.title) merged.about.title = p.about_title || ''
      if (!merged.about.description) merged.about.description = p.about_description || ''
      if (!merged.about.aboutImage) merged.about.aboutImage = p.about_image || ''
    }

    if (dbContent?.textsMap) {
      const t = dbContent.textsMap
      if (!merged.services.groupBookingTitle) merged.services.groupBookingTitle = t.services_group_booking_title || ''
      if (!merged.services.groupBookingDescription) merged.services.groupBookingDescription = t.services_group_booking_description || ''
      if (!merged.services.groupBookingButtonText) merged.services.groupBookingButtonText = t.services_group_booking_button || ''
      if (!merged.services.customOfferText) merged.services.customOfferText = t.services_custom_offer_text || ''
      if (!merged.services.customOfferButtonText) merged.services.customOfferButtonText = t.services_custom_offer_button || ''
      if (!merged.testimonials.title) merged.testimonials.title = t.testimonials_title || ''
      if (!merged.testimonials.subtitle) merged.testimonials.subtitle = t.testimonials_subtitle || ''
      if (!merged.contact.title) merged.contact.title = t.contact_title || ''
      if (!merged.contact.subtitle) merged.contact.subtitle = t.contact_subtitle || ''
      if (!merged.contact.locationLabel) merged.contact.locationLabel = t.contact_location_label || ''
      if (!merged.contact.locationValue) merged.contact.locationValue = t.contact_location_value || ''
      if (!merged.contact.availabilityTitle) merged.contact.availabilityTitle = t.contact_availability_title || ''
      if (!merged.contact.formTitle) merged.contact.formTitle = t.contact_form_title || ''
      if (!merged.contact.formNameLabel) merged.contact.formNameLabel = t.contact_form_name_label || ''
      if (!merged.contact.formEmailLabel) merged.contact.formEmailLabel = t.contact_form_email_label || ''
      if (!merged.contact.formMessageLabel) merged.contact.formMessageLabel = t.contact_form_message_label || ''
      if (!merged.contact.formButtonText) merged.contact.formButtonText = t.contact_form_button_text || ''
      if (!merged.contact.formButtonSending) merged.contact.formButtonSending = t.contact_form_button_sending || ''
      if (!merged.contact.quoteText) merged.contact.quoteText = t.contact_quote_text || ''
      if (!merged.contact.quoteAuthor) merged.contact.quoteAuthor = t.contact_quote_author || ''
    }

    setSettings(merged)
  }, [dbRow, dbContent, isLoadingSettings, isLoadingContent])

  // Save mutation — fresh row lookup, NO query invalidation afterwards
  const saveMutation = useMutation({
    mutationFn: async (newSettings: LandingPageSettings) => {
      // Fresh lookup at save time — never rely on stale dbRow
      const { data: currentRow } = await supabase
        .from('landing_page_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (currentRow?.id) {
        const { error } = await supabase
          .from('landing_page_settings')
          .update({ settings: newSettings })
          .eq('id', currentRow.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('landing_page_settings')
          .insert({ settings: newSettings })
        if (error) throw error
      }
    },
    onSuccess: async () => {
      // Revalidate the live landing page so changes appear immediately
      try {
        await revalidateLandingPage()
      } catch {
        // Revalidation is best-effort
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const updateSection = <K extends keyof LandingPageSettings>(
    sectionKey: K,
    updates: Partial<LandingPageSettings[K]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], ...updates },
    }))
  }

  const resetToDefaults = () => {
    if (window.confirm('Biztosan vissza akarod állítani az alapértelmezett beállításokat?')) {
      setSettings(defaultLandingPageSettings)
    }
  }

  const handleSectionClick = (sectionKey: string) => {
    setOpenSection(sectionKey)
    const el = document.getElementById(`editor-${sectionKey}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (isLoadingSettings || isLoadingContent) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="-m-8 flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Top toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-french-blue-500 to-french-blue-600 shadow-sm">
            <Paintbrush className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Oldal Szerkesztő</h1>
            <p className="text-[11px] text-slate-400">Szerkeszd a landing oldal minden részletét</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <PreviewToolbar device={device} onDeviceChange={setDevice} />
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Visszaállítás</span>
          </button>
          <button
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all ${
              saved
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-french-blue-500 hover:bg-french-blue-600'
            } disabled:opacity-50`}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saved ? 'Mentve!' : 'Mentés'}
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor panel */}
        <div className="w-[400px] flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="p-3 space-y-1.5">
            {SECTION_META.map((meta) => {
              const sectionKey = meta.key as keyof LandingPageSettings
              const EditorComponent = editorComponents[meta.key]
              if (!EditorComponent) return null

              return (
                <SectionAccordion
                  key={meta.key}
                  sectionKey={meta.key}
                  label={meta.label}
                  icon={meta.icon}
                  isVisible={settings[sectionKey].visible}
                  isOpen={openSection === meta.key}
                  onToggle={() =>
                    setOpenSection(openSection === meta.key ? null : meta.key)
                  }
                >
                  <EditorComponent
                    settings={settings[sectionKey]}
                    onChange={(updates: any) => updateSection(sectionKey, updates)}
                  />
                </SectionAccordion>
              )
            })}
          </div>
        </div>

        {/* Right: Preview panel */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50 p-6">
          <LandingPagePreview
            settings={settings}
            device={device}
            activeSection={openSection || undefined}
            onSectionClick={handleSectionClick}
          />
        </div>
      </div>
    </div>
  )
}
