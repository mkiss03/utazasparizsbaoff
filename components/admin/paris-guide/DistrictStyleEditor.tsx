'use client'

import { useState } from 'react'
import {
  Map,
  CreditCard,
  GitBranch,
  Paintbrush,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import ColorPicker from '@/components/admin/wizard/ColorPicker'
import { ParisGuideStyles } from '@/lib/types/database'

interface DistrictStyleEditorProps {
  styles: ParisGuideStyles
  onChange: (styles: ParisGuideStyles) => void
}

type SectionKey = 'map' | 'card' | 'timeline' | 'global'

export default function DistrictStyleEditor({ styles, onChange }: DistrictStyleEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(['map', 'card'])
  )

  const toggleSection = (section: SectionKey) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateMap = (updates: Partial<ParisGuideStyles['map']>) => {
    onChange({ ...styles, map: { ...styles.map, ...updates } })
  }

  const updateCard = (updates: Partial<ParisGuideStyles['card']>) => {
    onChange({ ...styles, card: { ...styles.card, ...updates } })
  }

  const updateTimeline = (updates: Partial<ParisGuideStyles['timeline']>) => {
    onChange({ ...styles, timeline: { ...styles.timeline, ...updates } })
  }

  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
    description,
  }: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    sectionKey: SectionKey
    description?: string
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <span className="font-medium text-slate-900">{title}</span>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
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

      {/* Global Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader
          title="Általános"
          icon={Paintbrush}
          sectionKey="global"
          description="Szekció háttér, címek"
        />
        {expandedSections.has('global') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Szekció háttérszín"
              value={styles.sectionBackground}
              onChange={(val) => onChange({ ...styles, sectionBackground: val })}
              description="A teljes District Guide szekció háttere"
            />
            <ColorPicker
              label="Főcím színe"
              value={styles.headingColor}
              onChange={(val) => onChange({ ...styles, headingColor: val })}
            />
            <ColorPicker
              label="Alcím színe"
              value={styles.subheadingColor}
              onChange={(val) => onChange({ ...styles, subheadingColor: val })}
            />
          </div>
        )}
      </div>

      {/* Map Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader
          title="Térkép színek"
          icon={Map}
          sectionKey="map"
          description="SVG térkép megjelenése"
        />
        {expandedSections.has('map') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Alapszín (inaktív kerületek)"
              value={styles.map.baseColor}
              onChange={(val) => updateMap({ baseColor: val })}
              description="A nem kiválasztott kerületek kitöltése"
            />
            <ColorPicker
              label="Hover szín"
              value={styles.map.hoverColor}
              onChange={(val) => updateMap({ hoverColor: val })}
              description="Egérmutató alatti kerület színe"
            />
            <ColorPicker
              label="Aktív szín (kiválasztott)"
              value={styles.map.activeColor}
              onChange={(val) => updateMap({ activeColor: val })}
              description="A jelenleg aktív kerület kitöltése"
            />
            <ColorPicker
              label="Körvonal színe"
              value={styles.map.strokeColor}
              onChange={(val) => updateMap({ strokeColor: val })}
              description="A kerületek közötti határvonalak"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Körvonal vastagság: {styles.map.strokeWidth}px
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={styles.map.strokeWidth}
                onChange={(e) => updateMap({ strokeWidth: parseFloat(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
            <ColorPicker
              label="Kerület számok színe"
              value={styles.map.labelColor}
              onChange={(val) => updateMap({ labelColor: val })}
            />
          </div>
        )}
      </div>

      {/* Card Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader
          title="Tartalom kártya"
          icon={CreditCard}
          sectionKey="card"
          description="Jobb oldali információs panel"
        />
        {expandedSections.has('card') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <ColorPicker
              label="Kártya háttérszín"
              value={styles.card.backgroundColor}
              onChange={(val) => updateCard({ backgroundColor: val })}
            />
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Fejléc gradiens (kezdet)"
                value={styles.card.headerGradientFrom}
                onChange={(val) => updateCard({ headerGradientFrom: val })}
              />
              <ColorPicker
                label="Fejléc gradiens (vég)"
                value={styles.card.headerGradientTo}
                onChange={(val) => updateCard({ headerGradientTo: val })}
              />
            </div>
            <ColorPicker
              label="Cím színe (fejlécben)"
              value={styles.card.titleColor}
              onChange={(val) => updateCard({ titleColor: val })}
            />
            <ColorPicker
              label="Alcím színe (fejlécben)"
              value={styles.card.subtitleColor}
              onChange={(val) => updateCard({ subtitleColor: val })}
            />
            <ColorPicker
              label="Törzs szöveg színe"
              value={styles.card.bodyTextColor}
              onChange={(val) => updateCard({ bodyTextColor: val })}
            />
            <ColorPicker
              label="Kiemelő szín (ikonok, gombok)"
              value={styles.card.accentColor}
              onChange={(val) => updateCard({ accentColor: val })}
            />
            <ColorPicker
              label="Keret színe"
              value={styles.card.borderColor}
              onChange={(val) => updateCard({ borderColor: val })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lekerekítés: {styles.card.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="32"
                value={styles.card.borderRadius}
                onChange={(e) => updateCard({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Árnyék intenzitás
              </label>
              <select
                value={styles.card.shadowIntensity}
                onChange={(e) =>
                  updateCard({
                    shadowIntensity: e.target.value as ParisGuideStyles['card']['shadowIntensity'],
                  })
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

      {/* Timeline Styles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <SectionHeader
          title="Idővonal"
          icon={GitBranch}
          sectionKey="timeline"
          description="Alsó navigációs sáv"
        />
        {expandedSections.has('timeline') && (
          <div className="p-4 space-y-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Vonal (inaktív)"
                value={styles.timeline.lineColor}
                onChange={(val) => updateTimeline({ lineColor: val })}
              />
              <ColorPicker
                label="Vonal (aktív/látogatott)"
                value={styles.timeline.lineColorActive}
                onChange={(val) => updateTimeline({ lineColorActive: val })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Pont (aktív)"
                value={styles.timeline.dotColorActive}
                onChange={(val) => updateTimeline({ dotColorActive: val })}
              />
              <ColorPicker
                label="Pont (inaktív)"
                value={styles.timeline.dotColorInactive}
                onChange={(val) => updateTimeline({ dotColorInactive: val })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pont méret: {styles.timeline.dotSize}px
              </label>
              <input
                type="range"
                min="8"
                max="24"
                value={styles.timeline.dotSize}
                onChange={(e) => updateTimeline({ dotSize: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Címke (aktív)"
                value={styles.timeline.labelColorActive}
                onChange={(val) => updateTimeline({ labelColorActive: val })}
              />
              <ColorPicker
                label="Címke (inaktív)"
                value={styles.timeline.labelColorInactive}
                onChange={(val) => updateTimeline({ labelColorInactive: val })}
              />
            </div>
            <ColorPicker
              label="Pozíció jelző (pin) színe"
              value={styles.timeline.pinColor}
              onChange={(val) => updateTimeline({ pinColor: val })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
