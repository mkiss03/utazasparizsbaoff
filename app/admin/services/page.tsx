'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Star, AlertCircle } from 'lucide-react'
import type { Tour } from '@/lib/types/database'

export default function ServicesPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState<Partial<Tour> | null>(null)
  const [programsJsonError, setProgramsJsonError] = useState<string | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: services, isLoading } = useQuery({
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
    mutationFn: async (service: Partial<Tour>) => {
      if (service.id) {
        const { data, error } = await supabase
          .from('tours')
          .update(service)
          .eq('id', service.id)
          .select()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('tours')
          .insert([service])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      setIsEditing(false)
      setEditingService(null)
      setProgramsJsonError(null)
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
    if (editingService) {
      // Validate programs JSON if it exists
      if (editingService.programs && typeof editingService.programs === 'string') {
        setProgramsJsonError('JSON formátum hibás - javítsd ki mielőtt mentesz!')
        return
      }
      saveMutation.mutate(editingService)
    }
  }

  const handleNew = () => {
    setEditingService({
      title: '',
      slug: '',
      short_description: '',
      price: 0,
      duration: 3,
      max_group_size: 8,
      is_featured: false,
      display_order: (services?.length || 0) + 1,
      icon_name: 'MapPin',
      color_gradient: 'from-parisian-beige-400 to-parisian-beige-500',
      programs: [],
    })
    setIsEditing(true)
    setProgramsJsonError(null)
  }

  const handleProgramsChange = (value: string) => {
    try {
      const parsed = JSON.parse(value)
      setEditingService({ ...editingService, programs: parsed })
      setProgramsJsonError(null)
    } catch {
      // Keep raw value for user to fix JSON
      setEditingService({ ...editingService, programs: value as unknown as Program[] })
      setProgramsJsonError('Érvénytelen JSON formátum')
    }
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Szolgáltatások kezelése
        </h1>
        <Button onClick={handleNew} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Új szolgáltatás
        </Button>
      </div>

      {isEditing && editingService && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService.id ? 'Szolgáltatás szerkesztése' : 'Új szolgáltatás létrehozása'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Szolgáltatás neve *</Label>
                <Input
                  id="title"
                  value={editingService.title || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug *</Label>
                <Input
                  id="slug"
                  value={editingService.slug || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, slug: e.target.value })
                  }
                  placeholder="varosnezesi-setak"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Rövid leírás</Label>
              <Textarea
                id="short_description"
                value={editingService.short_description || ''}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    short_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Részletes leírás</Label>
              <Textarea
                id="full_description"
                value={editingService.full_description || ''}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    full_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Ár (EUR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingService.price || 0}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
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
                  value={editingService.duration || 3}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
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
                  value={editingService.max_group_size || 8}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      max_group_size: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon_name">Ikon</Label>
                <select
                  id="icon_name"
                  value={editingService.icon_name || 'MapPin'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, icon_name: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="MapPin">MapPin (Térkép pin)</option>
                  <option value="Calendar">Calendar (Naptár)</option>
                  <option value="Car">Car (Autó)</option>
                  <option value="Compass">Compass (Iránytű)</option>
                  <option value="Utensils">Utensils (Evőeszközök)</option>
                  <option value="Camera">Camera (Fényképezőgép)</option>
                  <option value="Users">Users (Emberek)</option>
                  <option value="Briefcase">Briefcase (Táska)</option>
                  <option value="Heart">Heart (Szív)</option>
                  <option value="Star">Star (Csillag)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color_gradient">Színgradiens</Label>
                <select
                  id="color_gradient"
                  value={editingService.color_gradient || 'from-parisian-beige-400 to-parisian-beige-500'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, color_gradient: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="from-parisian-beige-400 to-parisian-beige-500">Bézs világos</option>
                  <option value="from-parisian-beige-500 to-parisian-beige-600">Bézs közepes</option>
                  <option value="from-parisian-beige-600 to-parisian-beige-700">Bézs sötét</option>
                  <option value="from-french-blue-400 to-french-blue-500">Kék</option>
                  <option value="from-champagne-400 to-champagne-500">Pezsgő</option>
                  <option value="from-gold-400 to-gold-500">Arany</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="programs">
                Programok (JSON formátum)
                <span className="ml-2 text-xs text-slate-500">
                  Példa: [{'{'}&#34;title&#34;:&#34;Program neve&#34;,&#34;description&#34;:&#34;Leírás&#34;,&#34;items&#34;:[&#34;Elem 1&#34;,&#34;Elem 2&#34;]{'}'}]
                </span>
              </Label>
              <Textarea
                id="programs"
                value={
                  typeof editingService.programs === 'string'
                    ? editingService.programs
                    : JSON.stringify(editingService.programs || [], null, 2)
                }
                onChange={(e) => handleProgramsChange(e.target.value)}
                rows={12}
                className="font-mono text-sm"
                placeholder='[{"title":"Program neve","description":"Leírás szövege","items":null}]'
              />
              {programsJsonError && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {programsJsonError}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={editingService.is_featured || false}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    is_featured: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-champagne-400"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Kiemelt szolgáltatás
              </Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} variant="secondary" disabled={saveMutation.isPending || !!programsJsonError}>
                {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setEditingService(null)
                  setProgramsJsonError(null)
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
        {services?.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-playfair text-xl font-bold text-navy-500">
                      {service.title}
                    </h3>
                    {service.is_featured && (
                      <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
                    )}
                  </div>
                  <p className="mt-1 text-navy-400">{service.short_description}</p>
                  <div className="mt-3 flex gap-4 text-sm text-navy-400">
                    <span>{service.price} EUR</span>
                    <span>•</span>
                    <span>{service.duration} óra</span>
                    <span>•</span>
                    <span>Max. {service.max_group_size} fő</span>
                    {service.icon_name && (
                      <>
                        <span>•</span>
                        <span>Ikon: {service.icon_name}</span>
                      </>
                    )}
                    {service.programs && service.programs.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{service.programs.length} program</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingService(service)
                      setIsEditing(true)
                      setProgramsJsonError(null)
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
                          'Biztosan törölni szeretnéd ezt a szolgáltatást?'
                        )
                      ) {
                        deleteMutation.mutate(service.id)
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
