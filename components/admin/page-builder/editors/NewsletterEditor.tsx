'use client'

import { NewsletterSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface NewsletterEditorProps {
  settings: NewsletterSectionSettings
  onChange: (updates: Partial<NewsletterSectionSettings>) => void
}

export default function NewsletterEditor({ settings, onChange }: NewsletterEditorProps) {
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
          <TextAreaField label="Leírás" value={settings.description} onChange={(v) => onChange({ description: v })} rows={2} />
          <TextField label="CTA gomb szöveg" value={settings.ctaButtonText} onChange={(v) => onChange({ ctaButtonText: v })} />
          <TextField label="Feature 1" value={settings.feature1} onChange={(v) => onChange({ feature1: v })} />
          <TextField label="Feature 2" value={settings.feature2} onChange={(v) => onChange({ feature2: v })} />
          <TextField label="Feature 3" value={settings.feature3} onChange={(v) => onChange({ feature3: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Szekció háttér" value={settings.sectionBgColor} onChange={(v) => onChange({ sectionBgColor: v })} />
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
        </div>
      </div>
    </div>
  )
}
