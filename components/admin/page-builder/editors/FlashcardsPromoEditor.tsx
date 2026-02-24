'use client'

import { FlashcardsPromoSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface FlashcardsPromoEditorProps {
  settings: FlashcardsPromoSettings
  onChange: (updates: Partial<FlashcardsPromoSettings>) => void
}

export default function FlashcardsPromoEditor({ settings, onChange }: FlashcardsPromoEditorProps) {
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
          <TextField label="Szekció badge" value={settings.sectionBadge} onChange={(v) => onChange({ sectionBadge: v })} />
          <TextField label="Cím" value={settings.title} onChange={(v) => onChange({ title: v })} />
          <TextAreaField label="Alcím" value={settings.subtitle} onChange={(v) => onChange({ subtitle: v })} rows={2} />
        </div>
      </div>

      {/* Kártya */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kártya</h4>
        <div className="space-y-3">
          <TextField label="Kártya cím" value={settings.cardTitle} onChange={(v) => onChange({ cardTitle: v })} />
          <TextField label="Kártya alcím" value={settings.cardSubtitle} onChange={(v) => onChange({ cardSubtitle: v })} />
          <TextAreaField label="Kártya leírás" value={settings.cardDescription} onChange={(v) => onChange({ cardDescription: v })} rows={2} />
          <TextField label="Feature 1" value={settings.feature1} onChange={(v) => onChange({ feature1: v })} />
          <TextField label="Feature 2" value={settings.feature2} onChange={(v) => onChange({ feature2: v })} />
          <TextField label="Feature 3" value={settings.feature3} onChange={(v) => onChange({ feature3: v })} />
          <TextField label="CTA gomb szöveg" value={settings.ctaText} onChange={(v) => onChange({ ctaText: v })} />
        </div>
      </div>

      {/* Alsó rész */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Alsó rész</h4>
        <div className="space-y-3">
          <TextField label="Alsó cím" value={settings.bottomTitle} onChange={(v) => onChange({ bottomTitle: v })} />
          <TextAreaField label="Alsó leírás" value={settings.bottomDescription} onChange={(v) => onChange({ bottomDescription: v })} rows={2} />
          <TextField label="Alsó CTA gomb" value={settings.bottomCtaText} onChange={(v) => onChange({ bottomCtaText: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Fejléc gradiens (kezdet)" value={settings.headerGradientFrom} onChange={(v) => onChange({ headerGradientFrom: v })} />
          <ColorPicker label="Fejléc gradiens (vég)" value={settings.headerGradientTo} onChange={(v) => onChange({ headerGradientTo: v })} />
        </div>
      </div>
    </div>
  )
}
