'use client'

import { useEffect, useState } from 'react'
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
  point_id?: string
}

const MAP_POINT_TYPES = [
  { value: 'metro', label: 'Közlekedés (Metro)' },
  { value: 'ticket', label: 'Jegyek (Ticket)' },
  { value: 'info', label: 'Információ (Info)' },
  { value: 'safety', label: 'Biztonság (Safety)' },
  { value: 'app', label: 'Alkalmazás (App)' },
  { value: 'situation', label: 'Szituáció (Situation)' },
]

const PRESET_COLORS = [
  { value: 'bg-french-blue-600', label: 'Kék (Francia)' },
  { value: 'bg-parisian-gold-500', label: 'Arany' },
  { value: 'bg-green-700', label: 'Zöld' },
  { value: 'bg-orange-600', label: 'Narancssárga' },
  { value: 'bg-slate-700', label: 'Szürke' },
  { value: 'bg-blue-600', label: 'Királykék' },
]

export function MapEditor() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [editingPoint, setEditingPoint] = useState<MapPoint | null>(null)
  const [formData, setFormData] = useState<MapPoint>({
    title: '',
    description: '',
    x: 50,
    y: 50,
    type: 'metro',
    color: 'bg-french-blue-600',
  })
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Fetch map points
  const { data: mapPoints = [], isLoading } = useQuery({
    queryKey: ['map-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_points')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []) as MapPoint[]
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
    onError: (error) => {
      alert(`Hiba: ${error.message}`)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (point: MapPoint) => {
      if (!point.id) throw new Error('Nincs pont ID')
      const { id, ...data } = point
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
    onError: (error) => {
      alert(`Hiba: ${error.message}`)
    },
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
    onError: (error) => {
      alert(`Hiba: ${error.message}`)
    },
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
    setEditingPoint(null)
    setIsAddingNew(false)
  }

  const handleEdit = (point: MapPoint) => {
    setEditingPoint(point)
    setFormData(point)
    setIsAddingNew(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Kérlek töltsd ki az összes mezőt!')
      return
    }

    if (formData.x < 0 || formData.x > 100 || formData.y < 0 || formData.y > 100) {
      alert('X és Y koordináták 0-100 között kell, hogy legyenek!')
      return
    }

    if (editingPoint?.id) {
      updateMutation.mutate({
        ...formData,
        id: editingPoint.id,
      })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-parisian-grey-800">Térkép Pontok</h2>
        {!isAddingNew && !editingPoint && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-parisian-beige-400 hover:bg-parisian-beige-500"
          >
            <Plus className="h-4 w-4" />
            Új Pont
          </Button>
        )}
      </div>

      {/* Form */}
      {(isAddingNew || editingPoint) && (
        <Card className="border-parisian-beige-200 bg-parisian-cream-50">
          <CardHeader>
            <CardTitle>
              {editingPoint ? 'Pont Szerkesztése' : 'Új Pont Hozzáadása'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-parisian-grey-700">
                  Cím *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="pl. Jegyek"
                  className="mt-1 border-parisian-beige-200 focus:border-parisian-beige-400"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-parisian-grey-700">
                  Leírás *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Pont leírása"
                  rows={3}
                  className="mt-1 border-parisian-beige-200 focus:border-parisian-beige-400"
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type" className="text-parisian-grey-700">
                  Típus *
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as MapPoint['type'],
                    })
                  }
                  className="mt-1 w-full rounded-md border border-parisian-beige-200 px-3 py-2 text-sm focus:border-parisian-beige-400 focus:outline-none"
                >
                  {MAP_POINT_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <Label htmlFor="color" className="text-parisian-grey-700">
                  Szín
                </Label>
                <select
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-parisian-beige-200 px-3 py-2 text-sm focus:border-parisian-beige-400 focus:outline-none"
                >
                  {PRESET_COLORS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x" className="text-parisian-grey-700">
                    X Koordináta (%) *
                  </Label>
                  <Input
                    id="x"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.x}
                    onChange={(e) =>
                      setFormData({ ...formData, x: parseFloat(e.target.value) })
                    }
                    className="mt-1 border-parisian-beige-200 focus:border-parisian-beige-400"
                  />
                </div>
                <div>
                  <Label htmlFor="y" className="text-parisian-grey-700">
                    Y Koordináta (%) *
                  </Label>
                  <Input
                    id="y"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.y}
                    onChange={(e) =>
                      setFormData({ ...formData, y: parseFloat(e.target.value) })
                    }
                    className="mt-1 border-parisian-beige-200 focus:border-parisian-beige-400"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex items-center gap-2 bg-parisian-beige-400 hover:bg-parisian-beige-500"
                >
                  <Save className="h-4 w-4" />
                  {editingPoint ? 'Frissítés' : 'Hozzáadás'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="flex items-center gap-2 border-parisian-beige-200 hover:bg-parisian-beige-50"
                >
                  <X className="h-4 w-4" />
                  Mégse
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {!isAddingNew && !editingPoint && (
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-parisian-grey-600">Betöltés...</p>
          ) : mapPoints.length === 0 ? (
            <p className="text-center text-parisian-grey-600">
              Nincsenek térkép pontok. Hozz létre egy újat!
            </p>
          ) : (
            mapPoints.map((point) => (
              <Card
                key={point.id}
                className="border-parisian-beige-200 bg-white hover:border-parisian-beige-400 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded ${point.color || 'bg-parisian-beige-400'}`}
                        />
                        <h3 className="font-semibold text-parisian-grey-800">
                          {point.title}
                        </h3>
                        <span className="ml-2 text-xs bg-parisian-beige-100 text-parisian-beige-700 px-2 py-1 rounded">
                          {MAP_POINT_TYPES.find((t) => t.value === point.type)
                            ?.label || point.type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-parisian-grey-600 line-clamp-2">
                        {point.description}
                      </p>
                      <div className="mt-2 flex gap-4 text-xs text-parisian-grey-500">
                        <span>X: {point.x.toFixed(1)}%</span>
                        <span>Y: {point.y.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(point)}
                        className="border-parisian-beige-200 hover:bg-parisian-beige-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (
                            confirm(
                              `Biztosan törölni szeretnéd: "${point.title}"?`
                            )
                          ) {
                            if (point.id) {
                              deleteMutation.mutate(point.id)
                            }
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
