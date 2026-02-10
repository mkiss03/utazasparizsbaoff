'use client'

import { useState } from 'react'
import {
  Palette,
  Type,
  LayoutGrid,
  CircleDot,
  MousePointer2,
  Waves,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import ColorPicker from './ColorPicker'
import { WizardStyles } from '@/lib/types/database'

interface WizardStyleEditorProps {
  styles: WizardStyles
  onChange: (styles: WizardStyles) => void
}

type SectionKey = 'card' | 'button' | 'typography' | 'timeline' | 'pricing' | 'journey'

export default function WizardStyleEditor({ styles, onChange }: WizardStyleEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set(['card', 'button']))

  const toggleSection = (section: SectionKey) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateCard = (updates: Partial<WizardStyles['card']>) => {
    onChange({ ...styles, card: { ...styles.card, ...updates } })
  }

  const updateButton = (updates: Partial<WizardStyles['button']>) => {
    onChange({ ...styles, button: { ...styles.button, ...updates } })
  }

  const updateTypography = (updates: Partial<WizardStyles['typography']>) => {
    onChange({ ...styles, typography: { ...styles.typography, ...updates } })
  }

  const updateTimeline = (updates: Partial<WizardStyles['timeline']>) => {
    onChange({ ...styles, timeline: { ...styles.timeline, ...updates } })
  }

  const updatePricing = (updates: Partial<WizardStyles['pricing']>) => {
    onChange({ ...styles, pricing: { ...styles.pricing, ...updates } })
  }

  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
  }: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    sectionKey: SectionKey
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-600" />
        <span className="font-medium text-slate-900">{title}</span>
      </div>
      {expandedSections.has(sectionKey) ? (
        <ChevronUp className="w-5 h-5 text-slate-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-400" />
      )}
    </button>
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Stílus beállítások</h3>

      {/* Card Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="Kártya háttér" icon={LayoutGrid} sectionKey="card" />
        {expandedSections.has('card') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Háttérszín"
              value={styles.card.backgroundColor}
              onChange={(val) => updateCard({ backgroundColor: val })}
              description="A kártya alapszíne"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="gradientEnabled"
                checked={styles.card.gradientEnabled}
                onChange={(e) => updateCard({ gradientEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300"
              />
              <label htmlFor="gradientEnabled" className="text-sm font-medium text-slate-700">
                Színátmenet használata
              </label>
            </div>

            {styles.card.gradientEnabled && (
              <div className="pl-6 space-y-4 border-l-2 border-slate-200">
                <ColorPicker
                  label="Színátmenet kezdete"
                  value={styles.card.gradientFrom || '#FAF7F2'}
                  onChange={(val) => updateCard({ gradientFrom: val })}
                />
                <ColorPicker
                  label="Színátmenet vége"
                  value={styles.card.gradientTo || '#f5f5f4'}
                  onChange={(val) => updateCard({ gradientTo: val })}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Irány</label>
                  <select
                    value={styles.card.gradientDirection || 'to-br'}
                    onChange={(e) =>
                      updateCard({ gradientDirection: e.target.value as WizardStyles['card']['gradientDirection'] })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="to-r">Jobbra</option>
                    <option value="to-l">Balra</option>
                    <option value="to-t">Felfelé</option>
                    <option value="to-b">Lefelé</option>
                    <option value="to-br">Jobb alsó sarok</option>
                    <option value="to-bl">Bal alsó sarok</option>
                    <option value="to-tr">Jobb felső sarok</option>
                    <option value="to-tl">Bal felső sarok</option>
                  </select>
                </div>
              </div>
            )}

            <ColorPicker
              label="Keret színe"
              value={styles.card.borderColor}
              onChange={(val) => updateCard({ borderColor: val })}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lekerekítés (px): {styles.card.borderRadius}
              </label>
              <input
                type="range"
                min="0"
                max="48"
                value={styles.card.borderRadius}
                onChange={(e) => updateCard({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Árnyék intenzitás</label>
              <select
                value={styles.card.shadowIntensity}
                onChange={(e) =>
                  updateCard({ shadowIntensity: e.target.value as WizardStyles['card']['shadowIntensity'] })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="none">Nincs</option>
                <option value="sm">Kicsi</option>
                <option value="md">Közepes</option>
                <option value="lg">Nagy</option>
                <option value="xl">Extra nagy</option>
                <option value="2xl">2x Extra nagy</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Button Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="CTA Gombok" icon={MousePointer2} sectionKey="button" />
        {expandedSections.has('button') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Gomb háttérszín"
              value={styles.button.backgroundColor}
              onChange={(val) => updateButton({ backgroundColor: val })}
            />
            <ColorPicker
              label="Gomb háttérszín (hover)"
              value={styles.button.hoverBackgroundColor}
              onChange={(val) => updateButton({ hoverBackgroundColor: val })}
            />
            <ColorPicker
              label="Gomb szöveg színe"
              value={styles.button.textColor}
              onChange={(val) => updateButton({ textColor: val })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gomb lekerekítés (px): {styles.button.borderRadius}
              </label>
              <input
                type="range"
                min="0"
                max="9999"
                step="1"
                value={styles.button.borderRadius}
                onChange={(e) => updateButton({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                9999 = teljesen kerek (pill alakú)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Typography Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="Tipográfia" icon={Type} sectionKey="typography" />
        {expandedSections.has('typography') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Címek színe (H1/H2)"
              value={styles.typography.headingColor}
              onChange={(val) => updateTypography({ headingColor: val })}
            />
            <ColorPicker
              label="Szövegtörzs színe"
              value={styles.typography.bodyTextColor}
              onChange={(val) => updateTypography({ bodyTextColor: val })}
            />
            <ColorPicker
              label="Lépésszámláló színe (pl. 1/4)"
              value={styles.typography.stepCounterColor}
              onChange={(val) => updateTypography({ stepCounterColor: val })}
            />
            <ColorPicker
              label="Címkék színe"
              value={styles.typography.labelColor}
              onChange={(val) => updateTypography({ labelColor: val })}
            />
          </div>
        )}
      </div>

      {/* Timeline Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="Idővonal" icon={CircleDot} sectionKey="timeline" />
        {expandedSections.has('timeline') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Aktív vonal"
                value={styles.timeline.lineColorActive}
                onChange={(val) => updateTimeline({ lineColorActive: val })}
              />
              <ColorPicker
                label="Inaktív vonal"
                value={styles.timeline.lineColorInactive}
                onChange={(val) => updateTimeline({ lineColorInactive: val })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Aktív pont"
                value={styles.timeline.dotColorActive}
                onChange={(val) => updateTimeline({ dotColorActive: val })}
              />
              <ColorPicker
                label="Inaktív pont"
                value={styles.timeline.dotColorInactive}
                onChange={(val) => updateTimeline({ dotColorInactive: val })}
              />
            </div>
            <ColorPicker
              label="Hajó ikon színe"
              value={styles.timeline.boatIconColor}
              onChange={(val) => updateTimeline({ boatIconColor: val })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pont méret (px): {styles.timeline.dotSize}
              </label>
              <input
                type="range"
                min="8"
                max="20"
                value={styles.timeline.dotSize}
                onChange={(e) => updateTimeline({ dotSize: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pricing Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="Árazás" icon={CreditCard} sectionKey="pricing" />
        {expandedSections.has('pricing') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Felnőtt ár színe"
              value={styles.pricing.adultPriceColor}
              onChange={(val) => updatePricing({ adultPriceColor: val })}
            />
            <ColorPicker
              label="Gyermek ár színe"
              value={styles.pricing.childPriceColor}
              onChange={(val) => updatePricing({ childPriceColor: val })}
            />
            <ColorPicker
              label="Pénznem színe"
              value={styles.pricing.currencyColor}
              onChange={(val) => updatePricing({ currencyColor: val })}
            />
            <ColorPicker
              label="Elválasztó vonal színe"
              value={styles.pricing.dividerColor}
              onChange={(val) => updatePricing({ dividerColor: val })}
            />
          </div>
        )}
      </div>

      {/* Journey Visualization Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader title="Bal oldali animáció" icon={Waves} sectionKey="journey" />
        {expandedSections.has('journey') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Útvonal szín (szaggatott vonal)"
              value={styles.journeyPathColor}
              onChange={(val) => onChange({ ...styles, journeyPathColor: val })}
            />
            <ColorPicker
              label="Hullám animáció színe"
              value={styles.journeyWaveColor}
              onChange={(val) => onChange({ ...styles, journeyWaveColor: val })}
            />
            <ColorPicker
              label="Hajó háttér színe"
              value={styles.journeyBoatBackground}
              onChange={(val) => onChange({ ...styles, journeyBoatBackground: val })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
