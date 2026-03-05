'use client'

import { HeroSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ImageUploadField from '../fields/ImageUploadField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface HeroEditorProps {
  settings: HeroSectionSettings
  onChange: (updates: Partial<HeroSectionSettings>) => void
}

export default function HeroEditor({ settings, onChange }: HeroEditorProps) {
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
          <TextField label="Badge szöveg" value={settings.badgeText} onChange={(v) => onChange({ badgeText: v })} />
          <TextField label="Főcím" value={settings.headline} onChange={(v) => onChange({ headline: v })} />
          <TextAreaField label="Alcím" value={settings.subheadline} onChange={(v) => onChange({ subheadline: v })} rows={2} />
          <TextField label="CTA gomb szöveg" value={settings.ctaText} onChange={(v) => onChange({ ctaText: v })} />
          <TextField label="CTA link" value={settings.ctaLink} onChange={(v) => onChange({ ctaLink: v })} />
          <TextField label="Lebegő badge 1 cím" value={settings.floatingBadge1Title} onChange={(v) => onChange({ floatingBadge1Title: v })} />
          <TextField label="Lebegő badge 1 alcím" value={settings.floatingBadge1Subtitle} onChange={(v) => onChange({ floatingBadge1Subtitle: v })} />
          <TextField label="Lebegő badge 2 cím" value={settings.floatingBadge2Title} onChange={(v) => onChange({ floatingBadge2Title: v })} />
        </div>
      </div>

      {/* Kép */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kép</h4>
        <ImageUploadField
          label="Háttérkép"
          value={settings.backgroundImage}
          onChange={(v) => onChange({ backgroundImage: v })}
        />
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Badge háttér" value={settings.badgeBgColor} onChange={(v) => onChange({ badgeBgColor: v })} />
          <ColorPicker label="Badge szöveg" value={settings.badgeTextColor} onChange={(v) => onChange({ badgeTextColor: v })} />
          <ColorPicker label="CTA háttér" value={settings.ctaBgColor} onChange={(v) => onChange({ ctaBgColor: v })} />
          <ColorPicker label="CTA szöveg" value={settings.ctaTextColor} onChange={(v) => onChange({ ctaTextColor: v })} />
        </div>
      </div>
    </div>
  )
}
