'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Loader2,
  Map,
  FileText,
  Palette,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  ParisGuideConfig,
  ParisGuideStyles,
  ParisGuideGlobalContent,
  DistrictContent,
  createDefaultParisGuideConfig,
} from '@/lib/types/database'
import DistrictContentEditor from '@/components/admin/paris-guide/DistrictContentEditor'
import DistrictStyleEditor from '@/components/admin/paris-guide/DistrictStyleEditor'
import DistrictGuidePreview from '@/components/admin/paris-guide/DistrictGuidePreview'

type TabKey = 'content' | 'styles'

export default function ParisGuideEditorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [configId, setConfigId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Config state
  const [name, setName] = useState('Paris District Guide')
  const [globalContent, setGlobalContent] = useState<ParisGuideGlobalContent>(
    createDefaultParisGuideConfig().globalContent
  )
  const [districts, setDistricts] = useState<DistrictContent[]>([])
  const [styles, setStyles] = useState<ParisGuideStyles | null>(null)
  const [isActive, setIsActive] = useState(true)

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>('content')
  const [showPreview, setShowPreview] = useState(true)

  // Load config from database
  useEffect(() => {
    async function loadConfig() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('paris_guide_configs')
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
          setGlobalContent(data.global_content || createDefaultParisGuideConfig().globalContent)
          setDistricts(data.districts || [])
          setStyles(data.styles || createDefaultParisGuideConfig().styles)
          setIsActive(data.is_active ?? true)
        } else {
          // Use default config
          const defaultConfig = createDefaultParisGuideConfig()
          setGlobalContent(defaultConfig.globalContent)
          setDistricts(defaultConfig.districts)
          setStyles(defaultConfig.styles)
          setIsActive(defaultConfig.isActive)
        }
      } catch (err) {
        console.error('Failed to load config:', err)
        // Fall back to defaults
        const defaultConfig = createDefaultParisGuideConfig()
        setGlobalContent(defaultConfig.globalContent)
        setDistricts(defaultConfig.districts)
        setStyles(defaultConfig.styles)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Ensure all 20 districts exist
  useEffect(() => {
    if (districts.length > 0 && districts.length < 20) {
      // Fill in missing districts with defaults
      const existingNumbers = new Set(districts.map((d) => d.districtNumber))
      const missingDistricts: DistrictContent[] = []

      for (let i = 1; i <= 20; i++) {
        if (!existingNumbers.has(i)) {
          missingDistricts.push({
            districtNumber: i,
            isActive: false,
            title: `${i}. kerület`,
            description: `A ${i}. kerület leírása.`,
            layoutType: 'standard',
            sortOrder: 20,
            iconName: 'MapPin',
          })
        }
      }

      if (missingDistricts.length > 0) {
        setDistricts([...districts, ...missingDistricts])
      }
    }
  }, [districts])

  // Save config to database
  const handleSave = async () => {
    if (!styles) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const supabase = createClient()

      const configData = {
        name,
        global_content: globalContent,
        districts,
        styles,
        is_active: isActive,
      }

      let result
      if (configId) {
        // Update existing
        result = await supabase
          .from('paris_guide_configs')
          .update(configData)
          .eq('id', configId)
          .select()
          .single()
      } else {
        // Insert new
        result = await supabase.from('paris_guide_configs').insert(configData).select().single()
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
    if (
      confirm(
        'Biztosan visszaállítod az alapértelmezett beállításokat? A nem mentett változások elvesznek.'
      )
    ) {
      const defaultConfig = createDefaultParisGuideConfig()
      setGlobalContent(defaultConfig.globalContent)
      setDistricts(defaultConfig.districts)
      setStyles(defaultConfig.styles)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'content', label: 'Tartalom', icon: FileText },
    { key: 'styles', label: 'Stílusok', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Párizs Kerületi Útmutató</h1>
                <p className="text-sm text-slate-500">
                  No-code szerkesztő a térkép és tartalomhoz
                </p>
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

              {/* Active Toggle */}
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">Aktív</span>
              </label>

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
              {activeTab === 'content' && (
                <DistrictContentEditor
                  globalContent={globalContent}
                  districts={districts}
                  onGlobalContentChange={setGlobalContent}
                  onDistrictsChange={setDistricts}
                />
              )}

              {activeTab === 'styles' && styles && (
                <DistrictStyleEditor styles={styles} onChange={setStyles} />
              )}
            </div>

            {/* Config Name (bottom of editor) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Konfiguráció neve (admin referencia)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          {showPreview && styles && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <DistrictGuidePreview
                globalContent={globalContent}
                districts={districts}
                styles={styles}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
