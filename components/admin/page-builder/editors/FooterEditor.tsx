'use client'

import { FooterSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface FooterEditorProps {
  settings: FooterSettings
  onChange: (updates: Partial<FooterSettings>) => void
}

export default function FooterEditor({ settings, onChange }: FooterEditorProps) {
  return (
    <div className="space-y-6">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      {/* Brand */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Brand</h4>
        <div className="space-y-3">
          <TextField label="Brand cím" value={settings.brandTitle} onChange={(v) => onChange({ brandTitle: v })} />
          <TextField label="Brand kiemelés" value={settings.brandHighlight} onChange={(v) => onChange({ brandHighlight: v })} />
          <TextField label="Szlogen" value={settings.tagline} onChange={(v) => onChange({ tagline: v })} />
          <TextAreaField label="Leírás" value={settings.description} onChange={(v) => onChange({ description: v })} rows={2} />
        </div>
      </div>

      {/* Jogi információk */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Jogi információk</h4>
        <div className="space-y-3">
          <TextField label="Nyilvántartási szám" value={settings.registrationNumber} onChange={(v) => onChange({ registrationNumber: v })} />
          <TextField label="SIRET" value={settings.siret} onChange={(v) => onChange({ siret: v })} />
          <TextField label="SIREN" value={settings.siren} onChange={(v) => onChange({ siren: v })} />
          <TextField label="Copyright szöveg" value={settings.copyrightText} onChange={(v) => onChange({ copyrightText: v })} />
        </div>
      </div>

      {/* Kapcsolat */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kapcsolat</h4>
        <div className="space-y-3">
          <TextField label="Email" value={settings.contactEmail} onChange={(v) => onChange({ contactEmail: v })} />
          <TextField label="Telefon" value={settings.contactPhone} onChange={(v) => onChange({ contactPhone: v })} />
          <TextField label="Facebook URL" value={settings.facebookUrl} onChange={(v) => onChange({ facebookUrl: v })} placeholder="https://facebook.com/..." />
        </div>
      </div>

      {/* Szolgáltatások */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Szolgáltatások lista</h4>
        <div className="space-y-3">
          <TextField label="Szolgáltatások cím" value={settings.servicesTitle} onChange={(v) => onChange({ servicesTitle: v })} />
          <TextField label="1. szolgáltatás" value={settings.service1} onChange={(v) => onChange({ service1: v })} />
          <TextField label="2. szolgáltatás" value={settings.service2} onChange={(v) => onChange({ service2: v })} />
          <TextField label="3. szolgáltatás" value={settings.service3} onChange={(v) => onChange({ service3: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Háttérszín" value={settings.bgColor} onChange={(v) => onChange({ bgColor: v })} />
          <ColorPicker label="Akcentszín" value={settings.accentColor} onChange={(v) => onChange({ accentColor: v })} />
        </div>
      </div>
    </div>
  )
}
