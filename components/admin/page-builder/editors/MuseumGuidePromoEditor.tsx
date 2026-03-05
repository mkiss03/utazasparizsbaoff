'use client'

import { MuseumGuidePromoSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'

interface MuseumGuidePromoEditorProps {
  settings: MuseumGuidePromoSettings
  onChange: (updates: Partial<MuseumGuidePromoSettings>) => void
}

export default function MuseumGuidePromoEditor({ settings, onChange }: MuseumGuidePromoEditorProps) {
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

      {/* Érték propozíciók */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Érték ajánlatok</h4>
        <div className="space-y-3">
          <TextField label="1. ajánlat cím" value={settings.valueProp1Title} onChange={(v) => onChange({ valueProp1Title: v })} />
          <TextField label="1. ajánlat leírás" value={settings.valueProp1Description} onChange={(v) => onChange({ valueProp1Description: v })} />
          <TextField label="2. ajánlat cím" value={settings.valueProp2Title} onChange={(v) => onChange({ valueProp2Title: v })} />
          <TextField label="2. ajánlat leírás" value={settings.valueProp2Description} onChange={(v) => onChange({ valueProp2Description: v })} />
          <TextField label="3. ajánlat cím" value={settings.valueProp3Title} onChange={(v) => onChange({ valueProp3Title: v })} />
          <TextField label="3. ajánlat leírás" value={settings.valueProp3Description} onChange={(v) => onChange({ valueProp3Description: v })} />
          <TextField label="4. ajánlat cím" value={settings.valueProp4Title} onChange={(v) => onChange({ valueProp4Title: v })} />
          <TextField label="4. ajánlat leírás" value={settings.valueProp4Description} onChange={(v) => onChange({ valueProp4Description: v })} />
        </div>
      </div>

      {/* Promo kártya */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Promo kártya</h4>
        <div className="space-y-3">
          <TextField label="Kártya cím" value={settings.promoCardTitle} onChange={(v) => onChange({ promoCardTitle: v })} />
          <TextField label="Kártya alcím" value={settings.promoCardSubtitle} onChange={(v) => onChange({ promoCardSubtitle: v })} />
          <TextAreaField label="Kártya leírás" value={settings.promoCardDescription} onChange={(v) => onChange({ promoCardDescription: v })} rows={2} />
          <TextField label="Feature 1" value={settings.promoFeature1} onChange={(v) => onChange({ promoFeature1: v })} />
          <TextField label="Feature 2" value={settings.promoFeature2} onChange={(v) => onChange({ promoFeature2: v })} />
          <TextField label="Feature 3" value={settings.promoFeature3} onChange={(v) => onChange({ promoFeature3: v })} />
          <TextField label="Kipróbálás CTA" value={settings.promoCtaText} onChange={(v) => onChange({ promoCtaText: v })} />
          <TextField label="Vásárlás CTA" value={settings.purchaseCtaText} onChange={(v) => onChange({ purchaseCtaText: v })} />
          <TextField label="Vásárlási megjegyzés" value={settings.purchaseNote} onChange={(v) => onChange({ purchaseNote: v })} />
        </div>
      </div>

      {/* Színek */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Fejléc gradiens (kezdet)" value={settings.promoHeaderGradientFrom} onChange={(v) => onChange({ promoHeaderGradientFrom: v })} />
          <ColorPicker label="Fejléc gradiens (vég)" value={settings.promoHeaderGradientTo} onChange={(v) => onChange({ promoHeaderGradientTo: v })} />
        </div>
      </div>
    </div>
  )
}
