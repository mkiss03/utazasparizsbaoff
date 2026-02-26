'use client'

import { LouvreTourSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface LouvreToursEditorProps {
  settings: LouvreTourSectionSettings
  onChange: (updates: Partial<LouvreTourSectionSettings>) => void
}

export default function LouvreToursEditor({ settings, onChange }: LouvreToursEditorProps) {
  return (
    <div className="space-y-6">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      {/* Info box */}
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
        <p className="text-xs text-violet-700">
          A túra megállók (útvonal, műalkotások) az admin felületen szerkeszthetők.
        </p>
        <Link
          href="/admin/louvre-tours"
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Louvre Túrák kezelése
        </Link>
      </div>

      {/* Section header */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Szekció fejléc</h4>
        <div className="space-y-3">
          <TextField label="Badge szöveg" value={settings.sectionBadge} onChange={(v) => onChange({ sectionBadge: v })} />
          <TextField label="Cím" value={settings.title} onChange={(v) => onChange({ title: v })} />
          <TextField label="Alcím" value={settings.subtitle} onChange={(v) => onChange({ subtitle: v })} />
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Badge háttér" value={settings.sectionBadgeBgColor} onChange={(v) => onChange({ sectionBadgeBgColor: v })} />
          <ColorPicker label="Badge szöveg" value={settings.sectionBadgeTextColor} onChange={(v) => onChange({ sectionBadgeTextColor: v })} />
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
          <ColorPicker label="Alcím szín" value={settings.subtitleColor} onChange={(v) => onChange({ subtitleColor: v })} />
          <ColorPicker label="Akcentus szín" value={settings.accentColor} onChange={(v) => onChange({ accentColor: v })} />
          <ColorPicker label="Idővonal szín" value={settings.timelineColor} onChange={(v) => onChange({ timelineColor: v })} />
          <ColorPicker label="Kártya háttér" value={settings.cardBgColor} onChange={(v) => onChange({ cardBgColor: v })} />
          <ColorPicker label="Szárny badge háttér" value={settings.wingBadgeBgColor} onChange={(v) => onChange({ wingBadgeBgColor: v })} />
          <ColorPicker label="Szárny badge szöveg" value={settings.wingBadgeTextColor} onChange={(v) => onChange({ wingBadgeTextColor: v })} />
        </div>
      </div>
    </div>
  )
}
