'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import MapPointEditor, { type MapPointFormData } from '@/components/admin/MapPointEditor'
import type { MapPoint } from '@/components/sections/draggable-map-data'

export default function AdminMapPage() {
  const [editingPoint, setEditingPoint] = useState<MapPointFormData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: points, isLoading } = useQuery({
    queryKey: ['map_points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_points')
        .select('*')
        .order('title')
      if (error) throw error
      return data as MapPoint[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (point: MapPointFormData) => {
      const payload = {
        title: point.title,
        x: point.x,
        y: point.y,
        type: point.type,
        color: point.color,
        question: point.question,
        answer: point.answer,
        details: point.details,
        pros: point.pros || null,
        usage_steps: point.usage_steps || null,
        tip: point.tip || null,
      }

      if (point.id) {
        const { data, error } = await supabase
          .from('map_points')
          .update(payload)
          .eq('id', point.id)
          .select()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('map_points')
          .insert([payload])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_points'] })
      setIsEditing(false)
      setEditingPoint(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('map_points').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_points'] })
    },
  })

  const handleNew = () => {
    setEditingPoint(null)
    setIsEditing(true)
  }

  const handleEdit = (point: MapPoint) => {
    setEditingPoint({
      id: point.id,
      title: point.title,
      x: point.x,
      y: point.y,
      type: point.type,
      color: point.color,
      question: point.question,
      answer: point.answer,
      details: point.details,
      pros: point.pros || '',
      usage_steps: point.usage_steps || '',
      tip: point.tip || '',
    })
    setIsEditing(true)
  }

  const handleSave = (data: MapPointFormData) => {
    saveMutation.mutate(data)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingPoint(null)
  }

  const TYPE_LABELS: Record<string, string> = {
    transport: 'Közlekedés',
    ticket: 'Jegyek',
    info: 'Információ',
    survival: 'Túlélőtippek',
    apps: 'Appok',
    situations: 'Szituációk',
    situation: 'Szituáció (egyedi)',
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Térkép pontok kezelése
        </h1>
        {!isEditing && (
          <Button onClick={handleNew} variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Új pont
          </Button>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-playfair text-xl font-bold text-navy-500">
              {editingPoint?.id ? 'Pont szerkesztése' : 'Új pont létrehozása'}
            </h2>
            <MapPointEditor
              point={editingPoint}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={saveMutation.isPending}
            />
            {saveMutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                Hiba történt a mentés során. Kérlek próbáld újra.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {points?.map((point) => (
          <Card key={point.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-playfair text-xl font-bold text-navy-500">
                    {point.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5">
                      {TYPE_LABELS[point.type] || point.type}
                    </span>
                    <span>X: {point.x}% / Y: {point.y}%</span>
                  </div>
                  {point.question && (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Kérdés:</span> {point.question}
                    </p>
                  )}
                  {point.answer && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-medium">Válasz:</span>{' '}
                      {point.answer.length > 100
                        ? point.answer.slice(0, 100) + '...'
                        : point.answer}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(point)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm('Biztosan törölni szeretnéd ezt a pontot?')) {
                        deleteMutation.mutate(point.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {points?.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">Még nincsenek térkép pontok.</p>
            <Button onClick={handleNew} variant="secondary" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Első pont létrehozása
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
