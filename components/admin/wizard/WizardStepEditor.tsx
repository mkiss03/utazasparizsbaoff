'use client'

import { useState } from 'react'
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Settings2,
  Type,
  Link as LinkIcon,
  Calendar,
  Clock,
  QrCode,
  MapPin,
  Sun,
  Headphones,
  Star,
  Heart,
  Sparkles,
  Zap,
  Coffee,
  Camera,
  Music,
  Gift,
} from 'lucide-react'
import { WizardStep, WizardFeature } from '@/lib/types/database'

interface WizardStepEditorProps {
  steps: WizardStep[]
  onChange: (steps: WizardStep[]) => void
}

// Available icons for features
const availableIcons = [
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'QrCode', icon: QrCode },
  { name: 'MapPin', icon: MapPin },
  { name: 'Sun', icon: Sun },
  { name: 'Headphones', icon: Headphones },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Zap', icon: Zap },
  { name: 'Coffee', icon: Coffee },
  { name: 'Camera', icon: Camera },
  { name: 'Music', icon: Music },
  { name: 'Gift', icon: Gift },
]

export default function WizardStepEditor({ steps, onChange }: WizardStepEditorProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set([steps[0]?.id]))

  const toggleExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const updateStep = (stepId: string, updates: Partial<WizardStep>) => {
    onChange(steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const addStep = () => {
    const newStep: WizardStep = {
      id: `step-${Date.now()}`,
      title: 'Új lépés',
      description: 'Leírás ide...',
      label: 'Új',
      ctaText: 'Tovább',
      order: steps.length + 1,
    }
    onChange([...steps, newStep])
    setExpandedSteps(new Set([...expandedSteps, newStep.id]))
  }

  const removeStep = (stepId: string) => {
    if (steps.length <= 2) {
      alert('Minimum 2 lépés szükséges!')
      return
    }
    onChange(steps.filter((step) => step.id !== stepId).map((step, idx) => ({ ...step, order: idx + 1 })))
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.id === stepId)
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]

    // Update order numbers
    onChange(newSteps.map((step, idx) => ({ ...step, order: idx + 1 })))
  }

  // Feature management
  const addFeature = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId)
    if (!step) return

    const newFeature: WizardFeature = {
      icon: 'Star',
      text: 'Új funkció',
      subtext: 'Leírás',
    }

    updateStep(stepId, {
      features: [...(step.features || []), newFeature],
    })
  }

  const updateFeature = (stepId: string, featureIndex: number, updates: Partial<WizardFeature>) => {
    const step = steps.find((s) => s.id === stepId)
    if (!step?.features) return

    const newFeatures = [...step.features]
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], ...updates }
    updateStep(stepId, { features: newFeatures })
  }

  const removeFeature = (stepId: string, featureIndex: number) => {
    const step = steps.find((s) => s.id === stepId)
    if (!step?.features) return

    updateStep(stepId, {
      features: step.features.filter((_, idx) => idx !== featureIndex),
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconObj = availableIcons.find((i) => i.name === iconName)
    return iconObj?.icon || Star
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Lépések kezelése</h3>
        <button
          type="button"
          onClick={addStep}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Új lépés
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id)

          return (
            <div
              key={step.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Step Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleExpanded(step.id)}
              >
                <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900">{step.title}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {step.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveStep(step.id, 'up')
                    }}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveStep(step.id, 'down')
                    }}
                    disabled={index === steps.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeStep(step.id)
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Step Content (Expanded) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-4">
                  {/* Basic Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Type className="w-3.5 h-3.5 inline mr-1" />
                        Cím
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Settings2 className="w-3.5 h-3.5 inline mr-1" />
                        Idővonalon megjelenő címke
                      </label>
                      <input
                        type="text"
                        value={step.label}
                        onChange={(e) => updateStep(step.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alcím (opcionális)</label>
                    <input
                      type="text"
                      value={step.subtitle || ''}
                      onChange={(e) => updateStep(step.id, { subtitle: e.target.value || undefined })}
                      placeholder="Rövid kiegészítő szöveg..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Leírás</label>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CTA gomb szövege</label>
                      <input
                        type="text"
                        value={step.ctaText}
                        onChange={(e) => updateStep(step.id, { ctaText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                        CTA link (opcionális)
                      </label>
                      <input
                        type="text"
                        value={step.ctaLink || ''}
                        onChange={(e) => updateStep(step.id, { ctaLink: e.target.value || undefined })}
                        placeholder="#contact vagy /url"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">
                        Funkciók / Előnyök (opcionális)
                      </label>
                      <button
                        type="button"
                        onClick={() => addFeature(step.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md hover:bg-slate-50"
                      >
                        <Plus className="w-3 h-3" />
                        Hozzáad
                      </button>
                    </div>

                    {step.features && step.features.length > 0 ? (
                      <div className="space-y-2">
                        {step.features.map((feature, featureIdx) => {
                          const IconComponent = getIconComponent(feature.icon)
                          return (
                            <div
                              key={featureIdx}
                              className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg"
                            >
                              {/* Icon Selector */}
                              <select
                                value={feature.icon}
                                onChange={(e) =>
                                  updateFeature(step.id, featureIdx, { icon: e.target.value })
                                }
                                className="w-24 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                              >
                                {availableIcons.map((iconOpt) => (
                                  <option key={iconOpt.name} value={iconOpt.name}>
                                    {iconOpt.name}
                                  </option>
                                ))}
                              </select>

                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={feature.text}
                                  onChange={(e) =>
                                    updateFeature(step.id, featureIdx, { text: e.target.value })
                                  }
                                  placeholder="Funkció neve"
                                  className="px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                                <input
                                  type="text"
                                  value={feature.subtext || ''}
                                  onChange={(e) =>
                                    updateFeature(step.id, featureIdx, {
                                      subtext: e.target.value || undefined,
                                    })
                                  }
                                  placeholder="Alszöveg (opcionális)"
                                  className="px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFeature(step.id, featureIdx)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Nincs funkció hozzáadva ehhez a lépéshez.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
