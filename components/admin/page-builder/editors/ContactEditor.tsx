'use client'

import { ContactSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface ContactEditorProps {
  settings: ContactSectionSettings
  onChange: (updates: Partial<ContactSectionSettings>) => void
}

export default function ContactEditor({ settings, onChange }: ContactEditorProps) {
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
          <TextField label="Helyszín címke" value={settings.locationLabel} onChange={(v) => onChange({ locationLabel: v })} />
          <TextField label="Helyszín érték" value={settings.locationValue} onChange={(v) => onChange({ locationValue: v })} />
          <TextField label="Elérhetőség cím" value={settings.availabilityTitle} onChange={(v) => onChange({ availabilityTitle: v })} />
        </div>
      </div>

      {/* Űrlap */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Űrlap szövegek</h4>
        <div className="space-y-3">
          <TextField label="Űrlap cím" value={settings.formTitle} onChange={(v) => onChange({ formTitle: v })} />
          <TextField label="Név mező címke" value={settings.formNameLabel} onChange={(v) => onChange({ formNameLabel: v })} />
          <TextField label="Email mező címke" value={settings.formEmailLabel} onChange={(v) => onChange({ formEmailLabel: v })} />
          <TextField label="Üzenet mező címke" value={settings.formMessageLabel} onChange={(v) => onChange({ formMessageLabel: v })} />
          <TextField label="Küldés gomb" value={settings.formButtonText} onChange={(v) => onChange({ formButtonText: v })} />
          <TextField label="Küldés folyamatban" value={settings.formButtonSending} onChange={(v) => onChange({ formButtonSending: v })} />
        </div>
      </div>

      {/* Idézet */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Idézet</h4>
        <div className="space-y-3">
          <TextAreaField label="Idézet szöveg" value={settings.quoteText} onChange={(v) => onChange({ quoteText: v })} rows={2} />
          <TextField label="Idézet szerző" value={settings.quoteAuthor} onChange={(v) => onChange({ quoteAuthor: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
        </div>
      </div>
    </div>
  )
}
