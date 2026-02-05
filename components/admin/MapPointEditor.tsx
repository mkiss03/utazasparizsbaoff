'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface MapPoint {
  id?: string
  title: string
  description: string
  x: number
  y: number
  type: 'metro' | 'ticket' | 'info' | 'safety' | 'app' | 'situation'
  color?: string
  created_at?: string
}

const TYPE_OPTIONS = [
  { value: 'metro', label: 'Közlekedés (Metro)' },
  { value: 'ticket', label: 'Jegyek (Ticket)' },
  { value: 'info', label: 'Információ (Info)' },
  { value: 'safety', label: 'Biztonság (Safety)' },
  { value: 'app', label: 'Alkalmazás (App)' },
  { value: 'situation', label: 'Szituáció (Situation)' },
]

const COLOR_PRESETS = [
  { value: 'bg-french-blue-600', label: 'Francia Kék' },
  { value: 'bg-parisian-gold-500', label: 'Párizsi Arany' },
  { value: 'bg-green-700', label: 'Zöld' },
  { value: 'bg-orange-600', label: 'Narancssárga' },
  { value: 'bg-slate-700', label: 'Szürke' },
  { value: 'bg-blue-600', label: 'Királykék' },
]

export function MapPointEditor() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<MapPoint>({
    title: '',
    description: '',
    x: 50,
    y: 50,
    type: 'metro',
    color: 'bg-french-blue-600',
  })

  // Fetch all map points
  const { data: points = [], isLoading } = useQuery({
    queryKey: ['map-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_points')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data as MapPoint[]) || []
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (point: Omit<MapPoint, 'id'>) => {
      const { error } = await supabase
        .from('map_points')
        .insert([point])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] })
      resetForm()
      alert('Pont sikeresen hozzáadva!')
    },
    onError: (error: any) => alert(`Hiba: ${error.message}`),
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (point: MapPoint) => {
      if (!point.id) throw new Error('Nincs pont ID')
      const { id, created_at, ...data } = point
      const { error } = await supabase
        .from('map_points')
        .update(data)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] })
      resetForm()
      alert('Pont sikeresen frissítve!')
    },
    onError: (error: any) => alert(`Hiba: ${error.message}`),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('map_points')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] })
      alert('Pont sikeresen törölve!')
    },
    onError: (error: any) => alert(`Hiba: ${error.message}`),
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      x: 50,
      y: 50,
      type: 'metro',
      color: 'bg-french-blue-600',
    })
    setEditingId(null)
    setIsAdding(false)
  }

  const handleEdit = (point: MapPoint) => {
    setFormData(point)
    setEditingId(point.id || null)
    setIsAdding(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Kérlek töltsd ki az összes kötelező mezőt!')
      return
    }

    if (formData.x < 0 || formData.x > 100 || formData.y < 0 || formData.y > 100) {
      alert('Koordináták 0-100 között kell legyenek!')
      return
    }

    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId } as MapPoint)
    } else {
      createMutation.mutate(formData as Omit<MapPoint, 'id'>)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-parisian-grey-800">Térkép Pontok</h3>
        {!isAdding && !editingId && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-parisian-beige-400 hover:bg-parisian-beige-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Új Pont
          </Button>
        )}
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <Card className="bg-parisian-cream-50 border-parisian-beige-200">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Pont Szerkesztése' : 'Új Pont Hozzáadása'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Cím *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="pl. Jegyvétel módjai"
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Leírás *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Pont leírása"
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type">Típus *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as MapPoint['type'],
                    })
                  }
                  className="mt-1 w-full rounded-md border border-parisian-beige-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-parisian-beige-400"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <Label htmlFor="color">Szín</Label>
                <select
                  id="color"
                  value={formData.color || 'bg-french-blue-600'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="mt-1 w-full rounded-md border border-parisian-beige-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-parisian-beige-400"
                >
                  {COLOR_PRESETS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x">X Koordináta (%) *</Label>
                  <Input
                    id="x"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.x}
                    onChange={(e) => setFormData({ ...formData, x: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="y">Y Koordináta (%) *</Label>
                  <Input
                    id="y"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.y}
                    onChange={(e) => setFormData({ ...formData, y: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-parisian-beige-400 hover:bg-parisian-beige-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Frissítés' : 'Hozzáadás'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-parisian-beige-200"
                >
                  <X className="mr-2 h-4 w-4" />
                  Mégse
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {!isAdding && !editingId && (
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center py-8 text-parisian-grey-600">Betöltés...</p>
          ) : points.length === 0 ? (
            <p className="text-center py-8 text-parisian-grey-600">
              Nincsenek térkép pontok. Hozz létre egyet!
            </p>
          ) : (
            points.map((point) => (
              <Card
                key={point.id}
                className="border-parisian-beige-200 hover:border-parisian-beige-400 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`h-3 w-3 rounded-full ${point.color || 'bg-parisian-beige-400'}`}
                        />
                        <h4 className="font-semibold text-parisian-grey-800">
                          {point.title}
                        </h4>
                        <span className="text-xs bg-parisian-beige-100 text-parisian-beige-700 px-2 py-1 rounded ml-2">
                          {TYPE_OPTIONS.find((t) => t.value === point.type)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-parisian-grey-600 line-clamp-2 mb-2">
                        {point.description}
                      </p>
                      <div className="text-xs text-parisian-grey-500 space-x-4">
                        <span>X: {point.x.toFixed(1)}%</span>
                        <span>Y: {point.y.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(point)}
                        className="border-parisian-beige-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm(`Biztosan törölni szeretnéd: "${point.title}"?`)) {
                            if (point.id) deleteMutation.mutate(point.id)
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
