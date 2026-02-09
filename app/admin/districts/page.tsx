'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { DistrictGuide, ContentLayout } from '@/lib/types/database'
import {
  MapPin,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Map,
} from 'lucide-react'
import Link from 'next/link'

const contentLayoutOptions: { value: ContentLayout; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'rich_ticket', label: 'Rich Ticket (kiemelt attrakció)' },
  { value: 'rich_list', label: 'Rich List (felsorolás)' },
]

const accentColorOptions = [
  { value: 'amber', label: 'Arany', class: 'bg-amber-500' },
  { value: 'blue', label: 'Kék', class: 'bg-blue-500' },
  { value: 'green', label: 'Zöld', class: 'bg-green-500' },
  { value: 'purple', label: 'Lila', class: 'bg-purple-500' },
  { value: 'rose', label: 'Rózsaszín', class: 'bg-rose-500' },
]

export default function AdminDistrictsPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()
  const supabase = createClient()

  // Fetch districts
  const { data: districts, isLoading } = useQuery({
    queryKey: ['admin-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('district_guides')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data as DistrictGuide[]
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newDistrict: Partial<DistrictGuide>) => {
      const { data, error } = await supabase
        .from('district_guides')
        .insert([newDistrict])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] })
      setIsCreating(false)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DistrictGuide> }) => {
      const { data, error } = await supabase
        .from('district_guides')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] })
      setEditingId(null)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('district_guides').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] })
    },
  })

  // Toggle visibility
  const toggleVisibility = (district: DistrictGuide) => {
    updateMutation.mutate({
      id: district.id,
      updates: { is_active: !district.is_active },
    })
  }

  // Move district order
  const moveDistrict = (district: DistrictGuide, direction: 'up' | 'down') => {
    if (!districts) return

    const currentIndex = districts.findIndex((d) => d.id === district.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= districts.length) return

    const targetDistrict = districts[targetIndex]

    // Swap sort orders
    updateMutation.mutate({
      id: district.id,
      updates: { sort_order: targetDistrict.sort_order },
    })
    updateMutation.mutate({
      id: targetDistrict.id,
      updates: { sort_order: district.sort_order },
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-white border-b border-amber-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Map className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-bold text-slate-900">Kerületek kezelése</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Előnézet
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Új kerület
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            <strong>Tipp:</strong> A sorrend határozza meg, milyen sorrendben jelennek meg a kerületek a
            felfedezési útvonalon. Használd a fel/le nyilakat a sorrend módosításához!
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-amber-100">
                <div className="h-6 bg-amber-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-amber-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Districts List */}
        {districts && (
          <div className="space-y-4">
            {/* Create New Form */}
            {isCreating && (
              <DistrictForm
                onSave={(data) => createMutation.mutate(data)}
                onCancel={() => setIsCreating(false)}
                isLoading={createMutation.isPending}
              />
            )}

            {/* Existing Districts */}
            {districts.map((district, index) => (
              <div
                key={district.id}
                className={`bg-white rounded-xl border transition-all ${
                  district.is_active ? 'border-amber-200' : 'border-slate-200 opacity-60'
                }`}
              >
                {editingId === district.id ? (
                  <DistrictForm
                    district={district}
                    onSave={(data) =>
                      updateMutation.mutate({ id: district.id, updates: data })
                    }
                    onCancel={() => setEditingId(null)}
                    isLoading={updateMutation.isPending}
                  />
                ) : (
                  <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Drag Handle & Order */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => moveDistrict(district, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
                          {district.sort_order}
                        </div>
                        <button
                          onClick={() => moveDistrict(district, 'down')}
                          disabled={index === districts.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white font-bold">
                            {district.district_number}
                          </span>
                          <div>
                            <h3 className="font-semibold text-slate-900">{district.title}</h3>
                            {district.subtitle && (
                              <p className="text-sm text-slate-500">{district.subtitle}</p>
                            )}
                          </div>
                        </div>

                        {district.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {district.description}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              district.content_layout === 'rich_ticket'
                                ? 'bg-purple-100 text-purple-700'
                                : district.content_layout === 'rich_list'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {contentLayoutOptions.find((o) => o.value === district.content_layout)
                              ?.label || 'Standard'}
                          </span>
                          {district.best_for?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-amber-50 text-amber-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(district)}
                          className={`p-2 rounded-lg transition-colors ${
                            district.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-slate-400 hover:bg-slate-50'
                          }`}
                          title={district.is_active ? 'Elrejtés' : 'Megjelenítés'}
                        >
                          {district.is_active ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(district.id)}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Szerkesztés"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Biztosan törölni szeretnéd ezt a kerületet?')) {
                              deleteMutation.mutate(district.id)
                            }
                          }}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Törlés"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// District Form Component
interface DistrictFormProps {
  district?: DistrictGuide
  onSave: (data: Partial<DistrictGuide>) => void
  onCancel: () => void
  isLoading: boolean
}

function DistrictForm({ district, onSave, onCancel, isLoading }: DistrictFormProps) {
  const [formData, setFormData] = useState<Partial<DistrictGuide>>({
    district_number: district?.district_number || 1,
    title: district?.title || '',
    subtitle: district?.subtitle || '',
    description: district?.description || '',
    highlights: district?.highlights || [],
    content_layout: district?.content_layout || 'standard',
    sort_order: district?.sort_order || 0,
    is_active: district?.is_active ?? true,
    main_attraction: district?.main_attraction || '',
    local_tips: district?.local_tips || '',
    best_for: district?.best_for || [],
    avoid_tips: district?.avoid_tips || '',
    accent_color: district?.accent_color || 'amber',
    icon_name: district?.icon_name || 'MapPin',
  })

  const [highlightsText, setHighlightsText] = useState(
    district?.highlights?.join('\n') || ''
  )
  const [bestForText, setBestForText] = useState(
    district?.best_for?.join(', ') || ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      highlights: highlightsText.split('\n').filter((h) => h.trim()),
      best_for: bestForText.split(',').map((t) => t.trim()).filter(Boolean),
    }

    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-amber-50 rounded-xl border border-amber-200">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* District Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kerület száma (1-20)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.district_number}
              onChange={(e) =>
                setFormData({ ...formData, district_number: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cím</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="pl. 7. kerület - Eiffel-torony"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alcím</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="pl. Az ikonikus negyed"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Leírás</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="A kerület rövid bemutatása..."
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Content Layout */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tartalom elrendezés
            </label>
            <select
              value={formData.content_layout}
              onChange={(e) =>
                setFormData({ ...formData, content_layout: e.target.value as ContentLayout })
              }
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {contentLayoutOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sorrend (felfedezési útvonalon)
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({ ...formData, sort_order: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fő látnivalók (soronként egy)
            </label>
            <textarea
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              rows={4}
              placeholder="Eiffel-torony&#10;Musée d'Orsay&#10;Invalidusok"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Best For */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ideális (vesszővel elválasztva)
            </label>
            <input
              type="text"
              value={bestForText}
              onChange={(e) => setBestForText(e.target.value)}
              placeholder="Turisták, Romantika, Fotózás"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Main Attraction (for rich_ticket layout) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fő attrakció (rich_ticket elrendezéshez)
            </label>
            <input
              type="text"
              value={formData.main_attraction}
              onChange={(e) => setFormData({ ...formData, main_attraction: e.target.value })}
              placeholder="Az Eiffel-torony - Párizs ikonikus szimbóluma"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Local Tips */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Viktória tippje
            </label>
            <textarea
              value={formData.local_tips}
              onChange={(e) => setFormData({ ...formData, local_tips: e.target.value })}
              rows={3}
              placeholder="A legjobb kilátás a Trocadéróról van..."
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Avoid Tips */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kerüld el (opcionális figyelmeztetés)
            </label>
            <textarea
              value={formData.avoid_tips}
              onChange={(e) => setFormData({ ...formData, avoid_tips: e.target.value })}
              rows={2}
              placeholder="Vigyázz a zsebtolvajokra..."
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-amber-500 border-amber-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="is_active" className="text-sm text-slate-700">
              Aktív (megjelenik a térképen)
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-amber-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Mégse
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Mentés...' : 'Mentés'}
        </button>
      </div>
    </form>
  )
}
