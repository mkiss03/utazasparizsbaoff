'use client'

import { ServicesSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface ServicesEditorProps {
  settings: ServicesSectionSettings
  onChange: (updates: Partial<ServicesSectionSettings>) => void
}

export default function ServicesEditor({ settings, onChange }: ServicesEditorProps) {
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
          <TextField label="Alcím" value={settings.subtitle} onChange={(v) => onChange({ subtitle: v })} />
        </div>
      </div>

      {/* Csoportos foglalás */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Csoportos foglalás</h4>
        <div className="space-y-3">
          <TextField label="Cím" value={settings.groupBookingTitle} onChange={(v) => onChange({ groupBookingTitle: v })} />
          <TextAreaField label="Leírás" value={settings.groupBookingDescription} onChange={(v) => onChange({ groupBookingDescription: v })} rows={3} />
          <TextField label="Gomb szöveg" value={settings.groupBookingButtonText} onChange={(v) => onChange({ groupBookingButtonText: v })} />
        </div>
      </div>

      {/* Egyedi ajánlat */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Egyedi ajánlat</h4>
        <div className="space-y-3">
          <TextField label="Szöveg" value={settings.customOfferText} onChange={(v) => onChange({ customOfferText: v })} />
          <TextField label="Gomb szöveg" value={settings.customOfferButtonText} onChange={(v) => onChange({ customOfferButtonText: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Badge háttér" value={settings.sectionBadgeBgColor} onChange={(v) => onChange({ sectionBadgeBgColor: v })} />
          <ColorPicker label="Badge szöveg" value={settings.sectionBadgeTextColor} onChange={(v) => onChange({ sectionBadgeTextColor: v })} />
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
          <ColorPicker label="Alcím szín" value={settings.subtitleColor} onChange={(v) => onChange({ subtitleColor: v })} />
        </div>
      </div>
    </div>
  )
}
