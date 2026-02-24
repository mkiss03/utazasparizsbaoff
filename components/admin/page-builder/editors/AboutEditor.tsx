'use client'

import { AboutSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ImageUploadField from '../fields/ImageUploadField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface AboutEditorProps {
  settings: AboutSectionSettings
  onChange: (updates: Partial<AboutSectionSettings>) => void
}

export default function AboutEditor({ settings, onChange }: AboutEditorProps) {
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
          <TextAreaField label="Leírás" value={settings.description} onChange={(v) => onChange({ description: v })} rows={4} />
        </div>
      </div>

      {/* Kép */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kép</h4>
        <ImageUploadField
          label="Rólam kép"
          value={settings.aboutImage}
          onChange={(v) => onChange({ aboutImage: v })}
        />
      </div>

      {/* Ajánlat kártyák */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Ajánlat kártyák</h4>
        <div className="space-y-3">
          <TextField label="Kártyák cím" value={settings.offerCardsTitle} onChange={(v) => onChange({ offerCardsTitle: v })} />
          <TextField label="1. kártya cím" value={settings.offerCard1Title} onChange={(v) => onChange({ offerCard1Title: v })} />
          <TextAreaField label="1. kártya leírás" value={settings.offerCard1Description} onChange={(v) => onChange({ offerCard1Description: v })} rows={2} />
          <TextField label="2. kártya cím" value={settings.offerCard2Title} onChange={(v) => onChange({ offerCard2Title: v })} />
          <TextAreaField label="2. kártya leírás" value={settings.offerCard2Description} onChange={(v) => onChange({ offerCard2Description: v })} rows={2} />
          <TextField label="3. kártya cím" value={settings.offerCard3Title} onChange={(v) => onChange({ offerCard3Title: v })} />
          <TextAreaField label="3. kártya leírás" value={settings.offerCard3Description} onChange={(v) => onChange({ offerCard3Description: v })} rows={2} />
        </div>
      </div>

      {/* Statisztikák */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Statisztikák</h4>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="1. stat érték" value={settings.stat1Value} onChange={(v) => onChange({ stat1Value: v })} />
          <TextField label="1. stat címke" value={settings.stat1Label} onChange={(v) => onChange({ stat1Label: v })} />
          <TextField label="2. stat érték" value={settings.stat2Value} onChange={(v) => onChange({ stat2Value: v })} />
          <TextField label="2. stat címke" value={settings.stat2Label} onChange={(v) => onChange({ stat2Label: v })} />
          <TextField label="3. stat érték" value={settings.stat3Value} onChange={(v) => onChange({ stat3Value: v })} />
          <TextField label="3. stat címke" value={settings.stat3Label} onChange={(v) => onChange({ stat3Label: v })} />
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
          <ColorPicker label="Badge háttér" value={settings.sectionBadgeBgColor} onChange={(v) => onChange({ sectionBadgeBgColor: v })} />
          <ColorPicker label="Badge szöveg" value={settings.sectionBadgeTextColor} onChange={(v) => onChange({ sectionBadgeTextColor: v })} />
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
          <ColorPicker label="Statisztika érték szín" value={settings.statValueColor} onChange={(v) => onChange({ statValueColor: v })} />
        </div>
      </div>
    </div>
  )
}
