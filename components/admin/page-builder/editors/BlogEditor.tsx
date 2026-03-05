'use client'

import { BlogSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface BlogEditorProps {
  settings: BlogSectionSettings
  onChange: (updates: Partial<BlogSectionSettings>) => void
}

export default function BlogEditor({ settings, onChange }: BlogEditorProps) {
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
          <TextField label="Tovább olvasom gomb" value={settings.readMoreText} onChange={(v) => onChange({ readMoreText: v })} />
          <TextField label="Összes bejegyzés gomb" value={settings.viewAllButtonText} onChange={(v) => onChange({ viewAllButtonText: v })} />
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
