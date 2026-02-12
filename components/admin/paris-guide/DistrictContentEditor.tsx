'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  MapPin,
  Star,
  Ticket,
  Sparkles,
  Coffee,
  Camera,
  BookOpen,
  Crown,
  Music,
  Home,
  Palette,
  Trees,
  TreePine,
  Landmark,
  Building,
  Building2,
  Waves,
  Moon,
  Utensils,
} from 'lucide-react'
import { DistrictContent, DistrictLayoutType, ParisGuideGlobalContent } from '@/lib/types/database'

interface DistrictContentEditorProps {
  globalContent: ParisGuideGlobalContent
  districts: DistrictContent[]
  onGlobalContentChange: (content: ParisGuideGlobalContent) => void
  onDistrictsChange: (districts: DistrictContent[]) => void
}

// Icon mapping for districts
const iconOptions = [
  { name: 'MapPin', icon: MapPin },
  { name: 'Star', icon: Star },
  { name: 'Ticket', icon: Ticket },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'Camera', icon: Camera },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Crown', icon: Crown },
  { name: 'Music', icon: Music },
  { name: 'Home', icon: Home },
  { name: 'Palette', icon: Palette },
  { name: 'Trees', icon: Trees },
  { name: 'TreePine', icon: TreePine },
  { name: 'Landmark', icon: Landmark },
  { name: 'Building', icon: Building },
  { name: 'Building2', icon: Building2 },
  { name: 'Waves', icon: Waves },
  { name: 'Moon', icon: Moon },
  { name: 'Utensils', icon: Utensils },
]

const layoutOptions: { value: DistrictLayoutType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'rich_ticket', label: 'Rich Ticket (kiemelt)' },
  { value: 'rich_list', label: 'Rich List' },
]

export default function DistrictContentEditor({
  globalContent,
  districts,
  onGlobalContentChange,
  onDistrictsChange,
}: DistrictContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'districts'>('global')
  const [selectedDistrict, setSelectedDistrict] = useState<number>(1)
  const [expandedDistricts, setExpandedDistricts] = useState<Set<number>>(new Set([1]))

  const toggleDistrictExpanded = (num: number) => {
    const newExpanded = new Set(expandedDistricts)
    if (newExpanded.has(num)) {
      newExpanded.delete(num)
    } else {
      newExpanded.add(num)
    }
    setExpandedDistricts(newExpanded)
  }

  const updateDistrict = (districtNumber: number, updates: Partial<DistrictContent>) => {
    onDistrictsChange(
      districts.map((d) =>
        d.districtNumber === districtNumber ? { ...d, ...updates } : d
      )
    )
  }

  const toggleDistrictActive = (districtNumber: number) => {
    const district = districts.find((d) => d.districtNumber === districtNumber)
    if (district) {
      updateDistrict(districtNumber, { isActive: !district.isActive })
    }
  }

  const updateHighlights = (districtNumber: number, highlightsText: string) => {
    const highlights = highlightsText.split(',').map((h) => h.trim()).filter(Boolean)
    updateDistrict(districtNumber, { highlights })
  }

  const updateBestFor = (districtNumber: number, bestForText: string) => {
    const bestFor = bestForText.split(',').map((b) => b.trim()).filter(Boolean)
    updateDistrict(districtNumber, { bestFor })
  }

  const getIconComponent = (iconName?: string) => {
    const iconObj = iconOptions.find((i) => i.name === iconName)
    return iconObj?.icon || MapPin
  }

  // Sort districts by sortOrder for display
  const sortedDistricts = [...districts].sort((a, b) => a.sortOrder - b.sortOrder)
  const activeDistricts = sortedDistricts.filter((d) => d.isActive)

  // Calculate position (rank) for each active district
  const getDistrictPosition = (districtNumber: number): number | null => {
    const index = activeDistricts.findIndex((d) => d.districtNumber === districtNumber)
    return index !== -1 ? index + 1 : null
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'global'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Általános beállítások
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('districts')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'districts'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kerületek ({activeDistricts.length}/20 aktív)
        </button>
      </div>

      {/* Global Content Tab */}
      {activeTab === 'global' && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">Általános tartalom</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Főcím
            </label>
            <input
              type="text"
              value={globalContent.mainTitle}
              onChange={(e) =>
                onGlobalContentChange({ ...globalContent, mainTitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alcím / Leírás
            </label>
            <textarea
              value={globalContent.subtitle}
              onChange={(e) =>
                onGlobalContentChange({ ...globalContent, subtitle: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Idővonal címe
            </label>
            <input
              type="text"
              value={globalContent.timelineTitle}
              onChange={(e) =>
                onGlobalContentChange({ ...globalContent, timelineTitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Térkép címe
            </label>
            <input
              type="text"
              value={globalContent.mapTitle || 'Párizs Kerületei'}
              onChange={(e) =>
                onGlobalContentChange({ ...globalContent, mapTitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Legenda: Aktív
              </label>
              <input
                type="text"
                value={globalContent.legendActiveText}
                onChange={(e) =>
                  onGlobalContentChange({ ...globalContent, legendActiveText: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Legenda: Megtekintett
              </label>
              <input
                type="text"
                value={globalContent.legendVisitedText}
                onChange={(e) =>
                  onGlobalContentChange({ ...globalContent, legendVisitedText: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Legenda: Inaktív
              </label>
              <input
                type="text"
                value={globalContent.legendInactiveText}
                onChange={(e) =>
                  onGlobalContentChange({ ...globalContent, legendInactiveText: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Districts Tab */}
      {activeTab === 'districts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Kerületek kezelése</h3>
            <span className="text-sm text-slate-500">
              Csak az aktív kerületek jelennek meg a térképen
            </span>
          </div>

          {/* District List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const district = districts.find((d) => d.districtNumber === num)
              if (!district) return null

              const isExpanded = expandedDistricts.has(num)
              const IconComponent = getIconComponent(district.iconName)

              return (
                <div
                  key={num}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    district.isActive
                      ? 'border-slate-300 bg-white'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50"
                    onClick={() => toggleDistrictExpanded(num)}
                  >
                    <GripVertical className="w-4 h-4 text-slate-400" />

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        district.isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="text-sm font-bold">{num}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          district.isActive ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {district.title}
                      </p>
                      {district.subtitle && (
                        <p className="text-xs text-slate-500 truncate">{district.subtitle}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {district.isActive && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" title={`Sorrend érték: ${district.sortOrder}`}>
                          #{getDistrictPosition(num)}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDistrictActive(num)
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          district.isActive
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={district.isActive ? 'Deaktiválás' : 'Aktiválás'}
                      >
                        {district.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Cím
                          </label>
                          <input
                            type="text"
                            value={district.title}
                            onChange={(e) => updateDistrict(num, { title: e.target.value })}
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Alcím
                          </label>
                          <input
                            type="text"
                            value={district.subtitle || ''}
                            onChange={(e) =>
                              updateDistrict(num, { subtitle: e.target.value || undefined })
                            }
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Leírás
                        </label>
                        <textarea
                          value={district.description}
                          onChange={(e) => updateDistrict(num, { description: e.target.value })}
                          rows={2}
                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Elrendezés
                          </label>
                          <select
                            value={district.layoutType}
                            onChange={(e) =>
                              updateDistrict(num, {
                                layoutType: e.target.value as DistrictLayoutType,
                              })
                            }
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          >
                            {layoutOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Sorrend
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={district.sortOrder}
                            onChange={(e) =>
                              updateDistrict(num, { sortOrder: parseInt(e.target.value) || 1 })
                            }
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Ikon
                          </label>
                          <select
                            value={district.iconName || 'MapPin'}
                            onChange={(e) => updateDistrict(num, { iconName: e.target.value })}
                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          >
                            {iconOptions.map((icon) => (
                              <option key={icon.name} value={icon.name}>
                                {icon.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Látnivalók (vesszővel elválasztva)
                        </label>
                        <input
                          type="text"
                          value={district.highlights?.join(', ') || ''}
                          onChange={(e) => updateHighlights(num, e.target.value)}
                          placeholder="Eiffel-torony, Louvre, Notre-Dame"
                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Fő attrakció
                        </label>
                        <input
                          type="text"
                          value={district.mainAttraction || ''}
                          onChange={(e) =>
                            updateDistrict(num, { mainAttraction: e.target.value || undefined })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Helyi tippek
                        </label>
                        <textarea
                          value={district.localTips || ''}
                          onChange={(e) =>
                            updateDistrict(num, { localTips: e.target.value || undefined })
                          }
                          rows={2}
                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Ideális ha... (vesszővel elválasztva)
                        </label>
                        <input
                          type="text"
                          value={district.bestFor?.join(', ') || ''}
                          onChange={(e) => updateBestFor(num, e.target.value)}
                          placeholder="Művészet, Romantika, Fotózás"
                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
