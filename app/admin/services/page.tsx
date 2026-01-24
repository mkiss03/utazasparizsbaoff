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

export default function ServicesPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState<Partial<Tour> | null>(null)
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
      programs: [],
      icon_name: 'MapPin',
      color_gradient: 'from-parisian-beige-400 to-parisian-beige-500',
    })
    setIsEditing(true)
  }

  const handleAddProgram = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        programs: [
          ...(editingService.programs || []),
          { title: '', description: '', items: [] }
        ]
      })
    }
  }

  const handleRemoveProgram = (index: number) => {
    if (editingService?.programs) {
      const newPrograms = [...editingService.programs]
      newPrograms.splice(index, 1)
      setEditingService({ ...editingService, programs: newPrograms })
    }
  }

  const handleProgramChange = (index: number, field: string, value: any) => {
    if (editingService?.programs) {
      const newPrograms = [...editingService.programs]
      newPrograms[index] = { ...newPrograms[index], [field]: value }
      setEditingService({ ...editingService, programs: newPrograms })
    }
  }

  const handleProgramItemAdd = (programIndex: number) => {
    if (editingService?.programs) {
      const newPrograms = [...editingService.programs]
      newPrograms[programIndex].items = [...(newPrograms[programIndex].items || []), '']
      setEditingService({ ...editingService, programs: newPrograms })
    }
  }

  const handleProgramItemChange = (programIndex: number, itemIndex: number, value: string) => {
    if (editingService?.programs) {
      const newPrograms = [...editingService.programs]
      const items = [...(newPrograms[programIndex].items || [])]
      items[itemIndex] = value
      newPrograms[programIndex].items = items
      setEditingService({ ...editingService, programs: newPrograms })
    }
  }

  const handleProgramItemRemove = (programIndex: number, itemIndex: number) => {
    if (editingService?.programs) {
      const newPrograms = [...editingService.programs]
      const items = [...(newPrograms[programIndex].items || [])]
      items.splice(itemIndex, 1)
      newPrograms[programIndex].items = items
      setEditingService({ ...editingService, programs: newPrograms })
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
                  placeholder="klasszikus-parizs"
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
              <Label htmlFor="full_description">Hosszú leírás</Label>
              <Textarea
                id="full_description"
                value={editingService.full_description || ''}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    full_description: e.target.value,
                  })
                }
                rows={6}
                placeholder="Részletes leírás a szolgáltatásról, amely megjelenik a kártya megnyitásakor..."
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
                <Label htmlFor="icon_name">Ikon neve</Label>
                <Input
                  id="icon_name"
                  value={editingService.icon_name || 'MapPin'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, icon_name: e.target.value })
                  }
                  placeholder="MapPin, Calendar, Coffee, stb."
                />
                <p className="text-xs text-navy-400">
                  Lucide ikon neve (pl.: MapPin, Calendar, Coffee)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color_gradient">Szín gradiens</Label>
                <Input
                  id="color_gradient"
                  value={editingService.color_gradient || 'from-parisian-beige-400 to-parisian-beige-500'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, color_gradient: e.target.value })
                  }
                  placeholder="from-parisian-beige-400 to-parisian-beige-500"
                />
              </div>
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

            {/* Programs Section */}
            <div className="space-y-4 rounded-lg border-2 border-parisian-beige-200 bg-parisian-cream-50 p-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Programok / Részletek (aldobozok a modal-ban)</Label>
                <Button
                  type="button"
                  onClick={handleAddProgram}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Új program
                </Button>
              </div>
              <p className="text-sm text-navy-400">
                Ezek a dobozok jelennek meg amikor rákattintanak a szolgáltatásra. Ha üres, nem jelenik meg semmi.
              </p>

              {editingService.programs?.map((program, programIdx) => (
                <div key={programIdx} className="space-y-3 rounded-lg border border-parisian-beige-300 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Program #{programIdx + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => handleRemoveProgram(programIdx)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`program-title-${programIdx}`}>Program címe *</Label>
                    <Input
                      id={`program-title-${programIdx}`}
                      value={program.title}
                      onChange={(e) => handleProgramChange(programIdx, 'title', e.target.value)}
                      placeholder="pl.: A klasszikus városnézés tartalmazza"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`program-desc-${programIdx}`}>Program leírása (opcionális)</Label>
                    <Textarea
                      id={`program-desc-${programIdx}`}
                      value={program.description || ''}
                      onChange={(e) => handleProgramChange(programIdx, 'description', e.target.value)}
                      rows={2}
                      placeholder="Rövid leírás a programról..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Pontok / Lista elemek</Label>
                      <Button
                        type="button"
                        onClick={() => handleProgramItemAdd(programIdx)}
                        size="sm"
                        variant="ghost"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Új pont
                      </Button>
                    </div>
                    {program.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleProgramItemChange(programIdx, itemIdx, e.target.value)}
                          placeholder="pl.: Eiffel-torony látogatás"
                        />
                        <Button
                          type="button"
                          onClick={() => handleProgramItemRemove(programIdx, itemIdx)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} variant="secondary">
                Mentés
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setEditingService(null)
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
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingService(service)
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
