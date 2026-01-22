'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import type { Tour } from '@/lib/types/database'

export default function ToursPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: tours, isLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .order('display_order')
      return data as Tour[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (tour: Partial<Tour>) => {
      if (tour.id) {
        const { data, error } = await supabase
          .from('tours')
          .update(tour)
          .eq('id', tour.id)
          .select()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('tours')
          .insert([tour])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      setIsEditing(false)
      setEditingTour(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tours').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] })
    },
  })

  const handleSave = () => {
    if (editingTour) {
      saveMutation.mutate(editingTour)
    }
  }

  const handleNew = () => {
    setEditingTour({
      title: '',
      slug: '',
      short_description: '',
      price: 0,
      duration: 3,
      max_group_size: 8,
      is_featured: false,
      display_order: (tours?.length || 0) + 1,
    })
    setIsEditing(true)
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Túrák kezelése
        </h1>
        <Button onClick={handleNew} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Új túra
        </Button>
      </div>

      {isEditing && editingTour && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTour.id ? 'Túra szerkesztése' : 'Új túra létrehozása'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Túra neve *</Label>
                <Input
                  id="title"
                  value={editingTour.title || ''}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug *</Label>
                <Input
                  id="slug"
                  value={editingTour.slug || ''}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, slug: e.target.value })
                  }
                  placeholder="klasszikus-parizs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Rövid leírás</Label>
              <Textarea
                id="short_description"
                value={editingTour.short_description || ''}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    short_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Hosszú leírás</Label>
              <Textarea
                id="full_description"
                value={editingTour.full_description || ''}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    full_description: e.target.value,
                  })
                }
                rows={6}
                placeholder="Részletes leírás a túráról, amely megjelenik a kártya megnyitásakor..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Ár (EUR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingTour.price || 0}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Időtartam (óra)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  value={editingTour.duration || 3}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      duration: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_group_size">Max. létszám</Label>
                <Input
                  id="max_group_size"
                  type="number"
                  value={editingTour.max_group_size || 8}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      max_group_size: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={editingTour.is_featured || false}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    is_featured: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-champagne-400"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Kiemelt túra
              </Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} variant="secondary">
                Mentés
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setEditingTour(null)
                }}
                variant="outline"
              >
                Mégse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tours?.map((tour) => (
          <Card key={tour.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-playfair text-xl font-bold text-navy-500">
                      {tour.title}
                    </h3>
                    {tour.is_featured && (
                      <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
                    )}
                  </div>
                  <p className="mt-1 text-navy-400">{tour.short_description}</p>
                  <div className="mt-3 flex gap-4 text-sm text-navy-400">
                    <span>{tour.price} EUR</span>
                    <span>•</span>
                    <span>{tour.duration} óra</span>
                    <span>•</span>
                    <span>Max. {tour.max_group_size} fő</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingTour(tour)
                      setIsEditing(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Biztosan törölni szeretné ezt a túrát?'
                        )
                      ) {
                        deleteMutation.mutate(tour.id)
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
      </div>
    </div>
  )
}
