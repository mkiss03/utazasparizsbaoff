'use client'

import type { ExperiencesPromoSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'

interface Props {
  settings: ExperiencesPromoSettings
  onChange: (updates: Partial<ExperiencesPromoSettings>) => void
}

export default function ExperiencesPromoEditor({ settings, onChange }: Props) {
  return (
    <div className="space-y-6">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Szövegek</h4>
        <div className="space-y-3">
          <TextField
            label="Badge szöveg"
            value={settings.sectionBadge}
            onChange={(v) => onChange({ sectionBadge: v })}
          />
          <TextField
            label="Cím"
            value={settings.title}
            onChange={(v) => onChange({ title: v })}
          />
          <TextAreaField
            label="Alcím"
            value={settings.subtitle}
            onChange={(v) => onChange({ subtitle: v })}
            rows={3}
          />
          <TextField
            label="CTA gomb szöveg"
            value={settings.ctaText}
            onChange={(v) => onChange({ ctaText: v })}
          />
          <TextField
            label="CTA link"
            value={settings.ctaLink}
            onChange={(v) => onChange({ ctaLink: v })}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
        💡 Az élmények listája automatikusan a <strong>Párizsi Élmények</strong> admin felületről töltődik be. Az itt megjelenő kártyák szerkesztéséhez látogass el az Admin {'>'} Párizsi Élmények menübe.
      </p>
    </div>
  )
}
