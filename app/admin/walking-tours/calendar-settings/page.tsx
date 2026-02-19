'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Save,
  Loader2,
  RotateCcw,
  Palette,
  Type,
  CalendarDays,
  Eye,
  Settings2,
  CheckCircle,
} from 'lucide-react'
import type { WalkingTourCalendarSettings } from '@/lib/types/database'
import { defaultCalendarSettings } from '@/lib/types/database'

// Color picker + label component
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-slate-200 p-0.5"
        />
      </div>
      <div className="flex-1">
        <span className="text-sm text-slate-600">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ml-2 w-20 rounded border border-slate-200 px-2 py-0.5 text-xs font-mono text-slate-500"
        />
      </div>
    </div>
  )
}

// Toggle component
function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? 'bg-french-blue-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

// Section card component
function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-french-blue-500" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

// Mini calendar preview
function CalendarPreview({ settings: s }: { settings: WalkingTourCalendarSettings }) {
  const days = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']
  const tourDays = [3, 5, 12, 15, 20, 22, 28]
  const fullDay = 15
  const todayDay = 10

  return (
    <div className="overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: s.tourDayBorderColor + '40' }}>
      {/* Header */}
      <div
        className="flex items-center justify-center px-4 py-3"
        style={{ background: `linear-gradient(to right, ${s.headerBgFrom}, ${s.headerBgTo})` }}
      >
        <span className="font-playfair text-lg font-bold" style={{ color: s.headerTextColor }}>
          Március 2026
        </span>
      </div>

      {/* Day headers */}
      <div
        className="grid grid-cols-7 border-b text-center"
        style={{ backgroundColor: s.dayHeaderBgColor, borderColor: s.tourDayBorderColor + '30' }}
      >
        {days.map(d => (
          <span key={d} className="py-1.5 text-[10px] font-semibold" style={{ color: s.dayHeaderTextColor }}>
            {d}
          </span>
        ))}
      </div>

      {/* Grid - show days 1-28 (4 rows) */}
      <div className="grid grid-cols-7">
        {/* Empty cells for first row offset (March 2026 starts on Sunday = 6 empty cells) */}
        {[...Array(6)].map((_, i) => (
          <div key={`e-${i}`} className="h-10 border-b border-r" style={{ borderColor: '#f5f5f5', backgroundColor: '#fafafa' }} />
        ))}
        {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
          const hasTour = tourDays.includes(day)
          const isFull = day === fullDay
          const isToday = day === todayDay

          return (
            <div
              key={day}
              className="flex h-10 flex-col items-center justify-start border-b border-r p-0.5"
              style={{
                borderColor: hasTour ? s.tourDayBorderColor : '#f5f5f5',
                borderWidth: hasTour ? `${s.tourDayBorderWidth}px` : '1px',
                backgroundColor: hasTour ? s.tourDayBgColor : 'transparent',
              }}
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium"
                style={{
                  backgroundColor: isToday ? s.todayBgColor : 'transparent',
                  color: isToday ? s.todayTextColor : (day < todayDay ? s.pastDayTextColor : s.dayTextColor),
                  fontWeight: hasTour ? 700 : 400,
                }}
              >
                {day}
              </span>
              {hasTour && (
                <div
                  className="mt-0.5 w-full rounded px-0.5 text-center text-[6px] font-bold leading-tight"
                  style={{
                    backgroundColor: isFull ? s.fullBadgeBgColor : s.tourBadgeBgColor,
                    color: isFull ? s.fullBadgeTextColor : s.tourBadgeTextColor,
                  }}
                >
                  {isFull ? 'Betelt' : 'Séta'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {s.showLegend && (
        <div className="flex items-center justify-center gap-4 border-t p-2 text-[9px]" style={{ color: s.pastDayTextColor, borderColor: '#f0f0f0' }}>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded" style={{ backgroundColor: s.tourBadgeBgColor, border: `1px solid ${s.tourDayBorderColor}` }} />
            <span>{s.legendTourLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded" style={{ backgroundColor: s.fullBadgeBgColor, border: `1px solid ${s.fullBadgeTextColor}40` }} />
            <span>{s.legendFullLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Modal header preview
function ModalPreview({ settings: s }: { settings: WalkingTourCalendarSettings }) {
  return (
    <div className="overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: s.modalAccentColor + '40' }}>
      <div
        className="px-4 py-3"
        style={{ background: `linear-gradient(to right, ${s.modalHeaderBgFrom}, ${s.modalHeaderBgTo})` }}
      >
        <span className="text-[10px]" style={{ color: s.modalHeaderTextColor + 'CC' }}>
          2026. március 5., csütörtök
        </span>
        <p className="font-playfair text-sm font-bold" style={{ color: s.modalHeaderTextColor }}>
          Sétatúra ezen a napon
        </p>
      </div>
      <div className="bg-white p-4">
        <div className="mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ backgroundColor: s.tourDayBgColor }}>
          <CalendarDays className="h-3 w-3" style={{ color: s.modalAccentColor }} />
          <span>10:00 &bull; 120 perc</span>
        </div>
        <button
          className="mt-2 w-full rounded-lg py-2 text-xs font-semibold"
          style={{ backgroundColor: s.bookButtonBgColor, color: s.bookButtonTextColor }}
        >
          Helyfoglalás megerősítése
        </button>
      </div>
    </div>
  )
}

export default function CalendarSettingsPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<WalkingTourCalendarSettings>(defaultCalendarSettings)
  const [saved, setSaved] = useState(false)

  // Load settings
  const { data: dbSettings, isLoading } = useQuery({
    queryKey: ['calendar-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('walking_tour_calendar_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
  })

  useEffect(() => {
    if (dbSettings?.settings) {
      setSettings({ ...defaultCalendarSettings, ...dbSettings.settings })
    }
  }, [dbSettings])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: WalkingTourCalendarSettings) => {
      if (dbSettings?.id) {
        const { error } = await supabase
          .from('walking_tour_calendar_settings')
          .update({ settings: newSettings })
          .eq('id', dbSettings.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('walking_tour_calendar_settings')
          .insert({ settings: newSettings })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-settings'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const updateField = (key: keyof WalkingTourCalendarSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setSettings(defaultCalendarSettings)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Naptár Megjelenés</h1>
          <p className="mt-1 text-sm text-slate-500">
            Személyre szabhatod a sétatúra naptár színeit, szövegeit és stílusát
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Alapértelmezett
          </button>
          <button
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-french-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-french-blue-600 disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? 'Mentve!' : 'Mentés'}
          </button>
        </div>
      </div>

      {saveMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Hiba történt a mentés során: {(saveMutation.error as Error).message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Settings Form */}
        <div className="space-y-5 lg:col-span-2">
          {/* Section Header Texts */}
          <SettingsSection title="Szekció szövegek" icon={Type}>
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Badge szöveg</label>
                <input
                  type="text"
                  value={settings.sectionBadgeText}
                  onChange={(e) => updateField('sectionBadgeText', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Cím</label>
                <input
                  type="text"
                  value={settings.sectionTitle}
                  onChange={(e) => updateField('sectionTitle', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Alcím</label>
                <textarea
                  value={settings.sectionSubtitle}
                  onChange={(e) => updateField('sectionSubtitle', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ColorField label="Badge háttér" value={settings.sectionBadgeBgColor} onChange={(v) => updateField('sectionBadgeBgColor', v)} />
                <ColorField label="Badge szöveg" value={settings.sectionBadgeTextColor} onChange={(v) => updateField('sectionBadgeTextColor', v)} />
                <ColorField label="Cím szín" value={settings.sectionTitleColor} onChange={(v) => updateField('sectionTitleColor', v)} />
                <ColorField label="Alcím szín" value={settings.sectionSubtitleColor} onChange={(v) => updateField('sectionSubtitleColor', v)} />
              </div>
            </div>
          </SettingsSection>

          {/* Calendar Header */}
          <SettingsSection title="Naptár fejléc" icon={CalendarDays}>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Háttér 1 (bal)" value={settings.headerBgFrom} onChange={(v) => updateField('headerBgFrom', v)} />
              <ColorField label="Háttér 2 (jobb)" value={settings.headerBgTo} onChange={(v) => updateField('headerBgTo', v)} />
              <ColorField label="Hónap szöveg" value={settings.headerTextColor} onChange={(v) => updateField('headerTextColor', v)} />
              <ColorField label="Nyilak szín" value={settings.headerNavColor} onChange={(v) => updateField('headerNavColor', v)} />
            </div>
          </SettingsSection>

          {/* Day Headers & Regular Days */}
          <SettingsSection title="Napok megjelenése" icon={Settings2}>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Napfejléc háttér" value={settings.dayHeaderBgColor} onChange={(v) => updateField('dayHeaderBgColor', v)} />
              <ColorField label="Napfejléc szöveg" value={settings.dayHeaderTextColor} onChange={(v) => updateField('dayHeaderTextColor', v)} />
              <ColorField label="Nap szám szín" value={settings.dayTextColor} onChange={(v) => updateField('dayTextColor', v)} />
              <ColorField label="Múltbeli nap szín" value={settings.pastDayTextColor} onChange={(v) => updateField('pastDayTextColor', v)} />
              <ColorField label="Mai nap háttér" value={settings.todayBgColor} onChange={(v) => updateField('todayBgColor', v)} />
              <ColorField label="Mai nap szöveg" value={settings.todayTextColor} onChange={(v) => updateField('todayTextColor', v)} />
            </div>
          </SettingsSection>

          {/* Tour Days */}
          <SettingsSection title="Túrás napok kiemelése" icon={Palette}>
            <p className="text-xs text-slate-400">
              Ezek a beállítások határozzák meg, hogyan jelennek meg a naptárban azok a napok, amelyekre túra van felvéve.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Nap háttérszín" value={settings.tourDayBgColor} onChange={(v) => updateField('tourDayBgColor', v)} />
              <ColorField label="Keret szín" value={settings.tourDayBorderColor} onChange={(v) => updateField('tourDayBorderColor', v)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Keret vastagság: {settings.tourDayBorderWidth}px</label>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={settings.tourDayBorderWidth}
                onChange={(e) => updateField('tourDayBorderWidth', parseInt(e.target.value))}
                className="w-full accent-french-blue-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>0px</span>
                <span>1px</span>
                <span>2px</span>
                <span>3px</span>
                <span>4px</span>
              </div>
            </div>
          </SettingsSection>

          {/* Tour Badges */}
          <SettingsSection title="Túra címkék (badge-ek)" icon={Palette}>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Címke háttér" value={settings.tourBadgeBgColor} onChange={(v) => updateField('tourBadgeBgColor', v)} />
              <ColorField label="Címke szöveg" value={settings.tourBadgeTextColor} onChange={(v) => updateField('tourBadgeTextColor', v)} />
              <ColorField label="Betelt háttér" value={settings.fullBadgeBgColor} onChange={(v) => updateField('fullBadgeBgColor', v)} />
              <ColorField label="Betelt szöveg" value={settings.fullBadgeTextColor} onChange={(v) => updateField('fullBadgeTextColor', v)} />
            </div>
            <ToggleField label="Időpont mutatása a címkén" value={settings.showTimeOnBadge} onChange={(v) => updateField('showTimeOnBadge', v)} />
          </SettingsSection>

          {/* Legend */}
          <SettingsSection title="Jelmagyarázat" icon={Eye}>
            <ToggleField label="Jelmagyarázat mutatása" value={settings.showLegend} onChange={(v) => updateField('showLegend', v)} />
            {settings.showLegend && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Túra szöveg</label>
                  <input
                    type="text"
                    value={settings.legendTourLabel}
                    onChange={(e) => updateField('legendTourLabel', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Betelt szöveg</label>
                  <input
                    type="text"
                    value={settings.legendFullLabel}
                    onChange={(e) => updateField('legendFullLabel', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </SettingsSection>

          {/* Modal */}
          <SettingsSection title="Felugró ablak (modál)" icon={Settings2}>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Fejléc háttér 1" value={settings.modalHeaderBgFrom} onChange={(v) => updateField('modalHeaderBgFrom', v)} />
              <ColorField label="Fejléc háttér 2" value={settings.modalHeaderBgTo} onChange={(v) => updateField('modalHeaderBgTo', v)} />
              <ColorField label="Fejléc szöveg" value={settings.modalHeaderTextColor} onChange={(v) => updateField('modalHeaderTextColor', v)} />
              <ColorField label="Akcentus szín" value={settings.modalAccentColor} onChange={(v) => updateField('modalAccentColor', v)} />
              <ColorField label="Gomb háttér" value={settings.bookButtonBgColor} onChange={(v) => updateField('bookButtonBgColor', v)} />
              <ColorField label="Gomb szöveg" value={settings.bookButtonTextColor} onChange={(v) => updateField('bookButtonTextColor', v)} />
            </div>
          </SettingsSection>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Eye className="h-4 w-4" />
                Élő Előnézet - Naptár
              </h3>
              <CalendarPreview settings={settings} />
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Eye className="h-4 w-4" />
                Élő Előnézet - Modál
              </h3>
              <ModalPreview settings={settings} />
            </div>

            {/* Section preview */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Eye className="h-4 w-4" />
                Szekció fejléc
              </h3>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <span
                  className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: settings.sectionBadgeBgColor, color: settings.sectionBadgeTextColor }}
                >
                  {settings.sectionBadgeText}
                </span>
                <h4
                  className="font-playfair text-lg font-bold"
                  style={{ color: settings.sectionTitleColor }}
                >
                  {settings.sectionTitle}
                </h4>
                <p className="mt-1 text-xs" style={{ color: settings.sectionSubtitleColor }}>
                  {settings.sectionSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
