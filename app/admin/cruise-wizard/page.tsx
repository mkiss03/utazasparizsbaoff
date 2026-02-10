'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Loader2,
  Ship,
  Settings,
  Palette,
  DollarSign,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  WizardConfig,
  WizardStep,
  WizardStyles,
  WizardPricing,
  createDefaultWizardConfig,
} from '@/lib/types/database'
import WizardStepEditor from '@/components/admin/wizard/WizardStepEditor'
import WizardStyleEditor from '@/components/admin/wizard/WizardStyleEditor'
import WizardPreview from '@/components/admin/wizard/WizardPreview'

type TabKey = 'steps' | 'styles' | 'pricing' | 'settings'

export default function CruiseWizardEditorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [configId, setConfigId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Config state
  const [name, setName] = useState('Seine Cruise Wizard')
  const [steps, setSteps] = useState<WizardStep[]>([])
  const [styles, setStyles] = useState<WizardStyles | null>(null)
  const [pricing, setPricing] = useState<WizardPricing>({
    adultPrice: 17,
    childPrice: 8,
    currency: '€',
    privacyNote: 'A megrendeléssel elfogadod az adatvédelmi tájékoztatómat.',
  })
  const [fabText, setFabText] = useState('Hajózás Párizsban')
  const [fabPosition, setFabPosition] = useState<'bottom-left' | 'bottom-right'>('bottom-left')
  const [isActive, setIsActive] = useState(true)

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>('steps')
  const [showPreview, setShowPreview] = useState(true)

  // Load config from database
  useEffect(() => {
    async function loadConfig() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('cruise_wizard_configs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading config:', error)
        }

        if (data) {
          setConfigId(data.id)
          setName(data.name)
          setSteps(data.steps || [])
          setStyles(data.styles || createDefaultWizardConfig().styles)
          setPricing(data.pricing || createDefaultWizardConfig().pricing)
          setFabText(data.fab_text || 'Hajózás Párizsban')
          setFabPosition(data.fab_position || 'bottom-left')
          setIsActive(data.is_active ?? true)
        } else {
          // Use default config
          const defaultConfig = createDefaultWizardConfig()
          setSteps(defaultConfig.steps)
          setStyles(defaultConfig.styles)
          setPricing(defaultConfig.pricing)
          setFabText(defaultConfig.fabText)
          setFabPosition(defaultConfig.fabPosition)
          setIsActive(defaultConfig.isActive)
        }
      } catch (err) {
        console.error('Failed to load config:', err)
        // Fall back to defaults
        const defaultConfig = createDefaultWizardConfig()
        setSteps(defaultConfig.steps)
        setStyles(defaultConfig.styles)
        setPricing(defaultConfig.pricing)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Save config to database
  const handleSave = async () => {
    if (!styles) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const supabase = createClient()

      const configData = {
        name,
        steps,
        styles,
        pricing,
        fab_text: fabText,
        fab_icon: 'Ship',
        fab_position: fabPosition,
        is_active: isActive,
      }

      let result
      if (configId) {
        // Update existing
        result = await supabase
          .from('cruise_wizard_configs')
          .update(configData)
          .eq('id', configId)
          .select()
          .single()
      } else {
        // Insert new
        result = await supabase.from('cruise_wizard_configs').insert(configData).select().single()
      }

      if (result.error) {
        throw result.error
      }

      if (result.data && !configId) {
        setConfigId(result.data.id)
      }

      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      console.error('Failed to save config:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Biztosan visszaállítod az alapértelmezett beállításokat? A nem mentett változások elvesznek.')) {
      const defaultConfig = createDefaultWizardConfig()
      setSteps(defaultConfig.steps)
      setStyles(defaultConfig.styles)
      setPricing(defaultConfig.pricing)
      setFabText(defaultConfig.fabText)
      setFabPosition(defaultConfig.fabPosition)
    }
  }

  // Build preview config
  const previewConfig = styles
    ? {
        name,
        steps,
        styles,
        pricing,
        fabText,
        fabIcon: 'Ship',
        fabPosition,
        isActive,
      }
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'steps', label: 'Lépések', icon: Ship },
    { key: 'styles', label: 'Stílusok', icon: Palette },
    { key: 'pricing', label: 'Árazás', icon: DollarSign },
    { key: 'settings', label: 'Beállítások', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Szajnai Hajózás Varázsló</h1>
                <p className="text-sm text-slate-500">No-code szerkesztő a hajózás modalhoz</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Status */}
              {saveStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-green-600 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mentve!
                </motion.div>
              )}
              {saveStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Hiba történt!
                </motion.div>
              )}

              {/* Preview Toggle */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPreview
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Előnézet
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Alaphelyzet
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Mentés
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl'}`}>
          {/* Left Panel - Editor */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {activeTab === 'steps' && (
                <WizardStepEditor steps={steps} onChange={setSteps} />
              )}

              {activeTab === 'styles' && styles && (
                <WizardStyleEditor styles={styles} onChange={setStyles} />
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Árazás beállítások</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Felnőtt ár
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pricing.adultPrice}
                          onChange={(e) =>
                            setPricing({ ...pricing, adultPrice: parseFloat(e.target.value) || 0 })
                          }
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                        <span className="text-slate-500">{pricing.currency}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Gyermek ár
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pricing.childPrice}
                          onChange={(e) =>
                            setPricing({ ...pricing, childPrice: parseFloat(e.target.value) || 0 })
                          }
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                        <span className="text-slate-500">{pricing.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pénznem</label>
                    <select
                      value={pricing.currency}
                      onChange={(e) => setPricing({ ...pricing, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="€">EUR (€)</option>
                      <option value="Ft">HUF (Ft)</option>
                      <option value="$">USD ($)</option>
                      <option value="£">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Adatvédelmi megjegyzés
                    </label>
                    <textarea
                      value={pricing.privacyNote}
                      onChange={(e) => setPricing({ ...pricing, privacyNote: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Általános beállítások</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Konfiguráció neve (admin referencia)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Lebegő gomb szövege
                    </label>
                    <input
                      type="text"
                      value={fabText}
                      onChange={(e) => setFabText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Lebegő gomb pozíciója
                    </label>
                    <select
                      value={fabPosition}
                      onChange={(e) => setFabPosition(e.target.value as 'bottom-left' | 'bottom-right')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="bottom-left">Bal alsó sarok</option>
                      <option value="bottom-right">Jobb alsó sarok</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300"
                    />
                    <div>
                      <label htmlFor="isActive" className="font-medium text-slate-900">
                        Aktív konfiguráció
                      </label>
                      <p className="text-sm text-slate-500">
                        Ha ki van kapcsolva, a varázsló nem jelenik meg a weboldalon.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          {showPreview && previewConfig && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <WizardPreview config={previewConfig} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
