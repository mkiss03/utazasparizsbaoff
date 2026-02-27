'use client'

import { LouvreTourSectionSettings } from '@/lib/types/landing-page'
import TextField from '../fields/TextField'
import TextAreaField from '../fields/TextAreaField'
import ToggleField from '../fields/ToggleField'
import ColorPicker from '@/components/admin/wizard/ColorPicker'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface LouvreToursEditorProps {
  settings: LouvreTourSectionSettings
  onChange: (updates: Partial<LouvreTourSectionSettings>) => void
}

export default function LouvreToursEditor({ settings, onChange }: LouvreToursEditorProps) {
  return (
    <div className="space-y-6">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      {/* Info box */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs text-amber-700">
          A túra megállók (útvonal, sztorik, képek) az admin felületen szerkeszthetők.
        </p>
        <Link
          href="/admin/louvre-tours"
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2d2d44] transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Louvre Túrák kezelése
        </Link>
      </div>

      {/* Section header */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Szekció fejléc</h4>
        <div className="space-y-3">
          <TextField label="Badge szöveg" value={settings.sectionBadge} onChange={(v) => onChange({ sectionBadge: v })} />
          <TextField label="Cím" value={settings.title} onChange={(v) => onChange({ title: v })} />
          <TextAreaField label="Alcím" value={settings.subtitle} onChange={(v) => onChange({ subtitle: v })} />
        </div>
      </div>

      {/* Value propositions */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Értékajánlatok (4 db)</h4>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">#{n}</p>
              <TextField
                label="Cím"
                value={(settings as any)[`valueProp${n}Title`]}
                onChange={(v) => onChange({ [`valueProp${n}Title`]: v } as any)}
              />
              <TextField
                label="Leírás"
                value={(settings as any)[`valueProp${n}Description`]}
                onChange={(v) => onChange({ [`valueProp${n}Description`]: v } as any)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Promo card */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Promo kártya</h4>
        <div className="space-y-3">
          <TextField label="Kártya cím" value={settings.promoCardTitle} onChange={(v) => onChange({ promoCardTitle: v })} />
          <TextField label="Kártya alcím" value={settings.promoCardSubtitle} onChange={(v) => onChange({ promoCardSubtitle: v })} />
          <TextAreaField label="Kártya leírás" value={settings.promoCardDescription} onChange={(v) => onChange({ promoCardDescription: v })} />
          <TextField label="Feature #1" value={settings.promoFeature1} onChange={(v) => onChange({ promoFeature1: v })} />
          <TextField label="Feature #2" value={settings.promoFeature2} onChange={(v) => onChange({ promoFeature2: v })} />
          <TextField label="Feature #3" value={settings.promoFeature3} onChange={(v) => onChange({ promoFeature3: v })} />
        </div>
      </div>

      {/* CTAs */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Gombok</h4>
        <div className="space-y-3">
          <TextField label="Demó gomb szöveg" value={settings.promoCtaText} onChange={(v) => onChange({ promoCtaText: v })} />
          <TextField label="Vásárlás gomb szöveg" value={settings.purchaseCtaText} onChange={(v) => onChange({ purchaseCtaText: v })} />
          <TextField label="Megjegyzés (ár alatt)" value={settings.purchaseNote} onChange={(v) => onChange({ purchaseNote: v })} />
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Színek</h4>
        <div className="space-y-3">
          <ColorPicker label="Badge háttér" value={settings.sectionBadgeBgColor} onChange={(v) => onChange({ sectionBadgeBgColor: v })} />
          <ColorPicker label="Badge szöveg" value={settings.sectionBadgeTextColor} onChange={(v) => onChange({ sectionBadgeTextColor: v })} />
          <ColorPicker label="Cím szín" value={settings.titleColor} onChange={(v) => onChange({ titleColor: v })} />
          <ColorPicker label="Alcím szín" value={settings.subtitleColor} onChange={(v) => onChange({ subtitleColor: v })} />
          <ColorPicker label="Kártya fejléc gradiens (kezdő)" value={settings.promoHeaderGradientFrom} onChange={(v) => onChange({ promoHeaderGradientFrom: v })} />
          <ColorPicker label="Kártya fejléc gradiens (záró)" value={settings.promoHeaderGradientTo} onChange={(v) => onChange({ promoHeaderGradientTo: v })} />
        </div>
      </div>
    </div>
  )
}
