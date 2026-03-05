'use client'

import { TestimonialsSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface TestimonialsEditorProps {
  settings: TestimonialsSectionSettings
  onChange: (updates: Partial<TestimonialsSectionSettings>) => void
}

export default function TestimonialsEditor({ settings, onChange }: TestimonialsEditorProps) {
  return (
    <div className="space-y-6">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      {/* Szövegek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Szövegek</h4>
        <div className="space-y-3">
          <TextField label="Cím" value={settings.title} onChange={(v) => onChange({ title: v })} />
          <TextField label="Alcím" value={settings.subtitle} onChange={(v) => onChange({ subtitle: v })} />
          <TextField label="CTA szöveg" value={settings.ctaText} onChange={(v) => onChange({ ctaText: v })} />
          <TextField label="CTA gomb szöveg" value={settings.ctaButtonText} onChange={(v) => onChange({ ctaButtonText: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
          <ColorPicker label="Alcím szín" value={settings.subtitleColor} onChange={(v) => onChange({ subtitleColor: v })} />
        </div>
      </div>
    </div>
  )
}
