'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import type { Testimonial } from '@/lib/types/database'

export default function TestimonialsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order')
      return data as Testimonial[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (testimonial: Partial<Testimonial>) => {
      if (testimonial.id) {
        const { data, error } = await supabase
          .from('testimonials')
          .update(testimonial)
          .eq('id', testimonial.id)
          .select()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([testimonial])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      setIsEditing(false)
      setEditingTestimonial(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_visible })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })

  const handleSave = () => {
    if (editingTestimonial) {
      saveMutation.mutate(editingTestimonial)
    }
  }

  const handleNew = () => {
    setEditingTestimonial({
      name: '',
      message: '',
      rating: 5,
      date: new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' }),
      avatar: '',
      display_order: (testimonials?.length || 0) + 1,
      is_visible: true,
    })
    setIsEditing(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Biztosan törölni szeretné ezt a véleményt?')) {
      deleteMutation.mutate(id)
    }
  }

  const toggleVisibility = (testimonial: Testimonial) => {
    toggleVisibilityMutation.mutate({
      id: testimonial.id,
      is_visible: !testimonial.is_visible,
    })
  }

  if (isLoading) {
    return <div className="p-8">Betöltés...</div>
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">Vélemények kezelése</h1>
        <Button onClick={handleNew} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Új vélemény
        </Button>
      </div>

      {isEditing && editingTestimonial && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTestimonial.id ? 'Vélemény szerkesztése' : 'Új vélemény hozzáadása'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Név *</Label>
                <Input
                  id="name"
                  value={editingTestimonial.name || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                  }
                  placeholder="Kovács Mária"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Dátum</Label>
                <Input
                  id="date"
                  value={editingTestimonial.date || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, date: e.target.value })
                  }
                  placeholder="2024 december"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Üzenet *</Label>
              <Textarea
                id="message"
                value={editingTestimonial.message || ''}
                onChange={(e) =>
                  setEditingTestimonial({ ...editingTestimonial, message: e.target.value })
                }
                rows={4}
                placeholder="Fantasztikus élmény volt..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rating">Értékelés (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={editingTestimonial.rating || 5}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar (1 betű)</Label>
                <Input
                  id="avatar"
                  maxLength={1}
                  value={editingTestimonial.avatar || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value.toUpperCase() })
                  }
                  placeholder="K"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Sorrend</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={editingTestimonial.display_order || 1}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, display_order: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setEditingTestimonial(null)
                }}
                variant="outline"
              >
                Mégse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className={testimonial.is_visible ? '' : 'opacity-60'}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-500 font-playfair font-bold text-white">
                    {testimonial.avatar || testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    {testimonial.date && (
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {testimonial.rating && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating!
                          ? 'fill-parisian-beige-500 text-parisian-beige-500'
                          : 'fill-grey-300 text-grey-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-4">&ldquo;{testimonial.message}&rdquo;</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(testimonial)} size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => toggleVisibility(testimonial)}
                  size="sm"
                  variant="outline"
                >
                  {testimonial.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button onClick={() => handleDelete(testimonial.id)} size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
