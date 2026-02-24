'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Loader2, RotateCcw, CheckCircle } from 'lucide-react'
import { LandingPageSettings, defaultLandingPageSettings, SECTION_META } from '@/lib/types/landing-page'

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

const editorComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroEditor,
  about: AboutEditor,
  services: ServicesEditor,
  flashcardsPromo: FlashcardsPromoEditor,
  museumGuidePromo: MuseumGuidePromoEditor,
  testimonials: TestimonialsEditor,
  blog: BlogEditor,
  contact: ContactEditor,
  newsletter: NewsletterEditor,
  footer: FooterEditor,
}

export default function PageBuilderPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<LandingPageSettings>(defaultLandingPageSettings)
  const [saved, setSaved] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('hero')
  const [device, setDevice] = useState<DeviceMode>('desktop')

  // Load settings
  const { data: dbRow, isLoading } = useQuery({
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
  })

  useEffect(() => {
    if (dbRow?.settings) {
      // Deep merge: defaults + saved values
      const merged = { ...defaultLandingPageSettings }
      const saved = dbRow.settings as any
      for (const key of Object.keys(defaultLandingPageSettings) as (keyof LandingPageSettings)[]) {
        if (saved[key]) {
          ;(merged as any)[key] = { ...(defaultLandingPageSettings as any)[key], ...saved[key] }
        }
      }
      setSettings(merged)
    }
  }, [dbRow])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: LandingPageSettings) => {
      if (dbRow?.id) {
        const { error } = await supabase
          .from('landing_page_settings')
          .update({ settings: newSettings })
          .eq('id', dbRow.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('landing_page_settings')
          .insert({ settings: newSettings })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page-settings'] })
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
    if (window.confirm('Biztosan vissza akarod allitani az alapertelmezett beallitasokat?')) {
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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Oldal Szerkeszto</h1>
          <p className="text-xs text-slate-500">Szerkeszd a landing oldal minden reszletet</p>
        </div>
        <div className="flex items-center gap-3">
          <PreviewToolbar device={device} onDeviceChange={setDevice} />
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden lg:inline">Reset</span>
          </button>
          <button
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-french-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-french-blue-600 disabled:opacity-50 transition-colors"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? 'Mentve!' : 'Mentes'}
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex h-[calc(100%-60px)]">
        {/* Left: Editor panel */}
        <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4 space-y-2">
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

        {/* Right: Preview panel */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <div className="mx-auto" style={{ maxWidth: 520 }}>
            <LandingPagePreview
              settings={settings}
              device={device}
              activeSection={openSection || undefined}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
