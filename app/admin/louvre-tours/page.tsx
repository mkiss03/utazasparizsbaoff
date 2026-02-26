'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Landmark,
  Save,
  X,
  Loader2,
} from 'lucide-react'
import type { LouvreTour, LouvreTourStop } from '@/lib/types/database'

export default function LouvreToursPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [editingTour, setEditingTour] = useState<Partial<LouvreTour> | null>(null)
  const [editingStop, setEditingStop] = useState<Partial<LouvreTourStop> | null>(null)
  const [expandedTour, setExpandedTour] = useState<string | null>(null)

  // Fetch tours
  const { data: tours, isLoading } = useQuery({
    queryKey: ['louvre-tours'],
    queryFn: async () => {
      const { data } = await supabase
        .from('louvre_tours')
        .select('*')
        .order('display_order')
      return (data || []) as LouvreTour[]
    },
  })

  // Fetch stops for expanded tour
  const { data: stops } = useQuery({
    queryKey: ['louvre-tour-stops', expandedTour],
    queryFn: async () => {
      if (!expandedTour) return []
      const { data } = await supabase
        .from('louvre_tour_stops')
        .select('*')
        .eq('tour_id', expandedTour)
        .order('display_order')
      return (data || []) as LouvreTourStop[]
    },
    enabled: !!expandedTour,
  })

  // Save tour
  const saveTourMutation = useMutation({
    mutationFn: async (tour: Partial<LouvreTour>) => {
      const payload = { ...tour }
      if (!payload.slug && payload.title) {
        payload.slug = payload.title
          .toLowerCase()
          .replace(/[^a-z0-9áéíóöőúüű]+/gi, '-')
          .replace(/^-|-$/g, '')
      }
      if (payload.id) {
        const { id, created_at, updated_at, ...updateData } = payload as LouvreTour
        const { error } = await supabase.from('louvre_tours').update(updateData).eq('id', id)
        if (error) throw error
      } else {
        const { id, created_at, updated_at, ...insertData } = payload as any
        const { error } = await supabase.from('louvre_tours').insert([insertData])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['louvre-tours'] })
      setEditingTour(null)
    },
  })

  // Delete tour
  const deleteTourMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('louvre_tours').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['louvre-tours'] })
      setExpandedTour(null)
    },
  })

  // Save stop
  const saveStopMutation = useMutation({
    mutationFn: async (stop: Partial<LouvreTourStop>) => {
      if (stop.id) {
        const { id, created_at, updated_at, ...updateData } = stop as LouvreTourStop
        const { error } = await supabase.from('louvre_tour_stops').update(updateData).eq('id', id)
        if (error) throw error
      } else {
        const { id, created_at, updated_at, ...insertData } = stop as any
        const { error } = await supabase.from('louvre_tour_stops').insert([insertData])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['louvre-tour-stops', expandedTour] })
      setEditingStop(null)
    },
  })

  // Delete stop
  const deleteStopMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('louvre_tour_stops').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['louvre-tour-stops', expandedTour] })
    },
  })

  const newTour = () => {
    setEditingTour({
      title: '',
      slug: '',
      subtitle: '',
      duration_text: '3 órás túra',
      summary_text: '',
      tips: '',
      status: 'draft',
      display_order: (tours?.length || 0) + 1,
    })
  }

  const newStop = () => {
    if (!expandedTour) return
    setEditingStop({
      tour_id: expandedTour,
      stop_number: (stops?.length || 0) + 1,
      title: '',
      location_wing: '',
      location_floor: '',
      location_rooms: '',
      duration_minutes: 15,
      main_artwork: '',
      description: '',
      display_order: (stops?.length || 0) + 1,
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Louvre Túrák</h1>
            <p className="text-sm text-slate-500">Múzeumi túra útvonalak és megállók kezelése</p>
          </div>
        </div>
        <Button onClick={newTour} className="gap-2 bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Új túra
        </Button>
      </div>

      {/* Tour form */}
      {editingTour && (
        <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">
            {editingTour.id ? 'Túra szerkesztése' : 'Új túra létrehozása'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Cím</Label>
              <Input
                value={editingTour.title || ''}
                onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                placeholder="Louvre – Mesterművek időutazása"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input
                value={editingTour.slug || ''}
                onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                placeholder="auto-generált ha üresen hagyod"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alcím</Label>
              <Input
                value={editingTour.subtitle || ''}
                onChange={(e) => setEditingTour({ ...editingTour, subtitle: e.target.value })}
                placeholder="3 órás túra a világ legnagyobb múzeumában"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Időtartam szöveg</Label>
              <Input
                value={editingTour.duration_text || ''}
                onChange={(e) => setEditingTour({ ...editingTour, duration_text: e.target.value })}
                placeholder="3 órás túra"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Összesített útvonal leírás</Label>
              <Textarea
                value={editingTour.summary_text || ''}
                onChange={(e) => setEditingTour({ ...editingTour, summary_text: e.target.value })}
                rows={3}
                placeholder="Ajánlott sorrend, összidő, stb."
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Tippek</Label>
              <Textarea
                value={editingTour.tips || ''}
                onChange={(e) => setEditingTour({ ...editingTour, tips: e.target.value })}
                rows={2}
                placeholder="Általános tippek a látogatóknak"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Státusz</Label>
              <select
                className="flex h-10 w-full rounded-lg border-2 border-champagne-400 bg-white px-3 py-2 text-sm"
                value={editingTour.status || 'draft'}
                onChange={(e) => setEditingTour({ ...editingTour, status: e.target.value as LouvreTour['status'] })}
              >
                <option value="draft">Vázlat</option>
                <option value="published">Publikált</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => saveTourMutation.mutate(editingTour)}
              disabled={saveTourMutation.isPending}
              className="gap-2 bg-violet-600 hover:bg-violet-700"
            >
              {saveTourMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Mentés
            </Button>
            <Button variant="outline" onClick={() => setEditingTour(null)} className="gap-2">
              <X className="h-4 w-4" />
              Mégse
            </Button>
          </div>
        </div>
      )}

      {/* Tours list */}
      {tours?.length === 0 && !editingTour ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <Landmark className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Még nincs Louvre túra. Hozz létre az elsőt!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tours?.map((tour) => (
            <div key={tour.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Tour header */}
              <div className="flex items-center justify-between p-4">
                <div
                  className="flex flex-1 items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedTour(expandedTour === tour.id ? null : tour.id)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{tour.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tour.duration_text}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        tour.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tour.status === 'published' ? 'Publikált' : 'Vázlat'}
                      </span>
                    </div>
                  </div>
                  {expandedTour === tour.id ? (
                    <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div className="ml-3 flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTour(tour)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Biztosan törlöd ezt a túrát és az összes megállóját?')) {
                        deleteTourMutation.mutate(tour.id)
                      }
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Expanded stops */}
              {expandedTour === tour.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">
                      Megállók ({stops?.length || 0})
                    </h4>
                    <Button onClick={newStop} size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-xs h-8">
                      <Plus className="h-3.5 w-3.5" />
                      Új megálló
                    </Button>
                  </div>

                  {/* Stop form */}
                  {editingStop && (
                    <div className="rounded-xl border-2 border-violet-200 bg-white p-4 space-y-3">
                      <h5 className="text-sm font-bold text-slate-700">
                        {editingStop.id ? 'Megálló szerkesztése' : 'Új megálló'}
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Megálló száma</Label>
                          <Input
                            type="number"
                            value={editingStop.stop_number || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, stop_number: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Cím</Label>
                          <Input
                            value={editingStop.title || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, title: e.target.value })}
                            placeholder="Ókori Egyiptom"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Szárny</Label>
                          <select
                            className="flex h-10 w-full rounded-lg border-2 border-champagne-400 bg-white px-3 py-2 text-sm"
                            value={editingStop.location_wing || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, location_wing: e.target.value })}
                          >
                            <option value="">Válassz...</option>
                            <option value="Sully-szárny">Sully-szárny</option>
                            <option value="Denon-szárny">Denon-szárny</option>
                            <option value="Richelieu-szárny">Richelieu-szárny</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Szint</Label>
                          <Input
                            value={editingStop.location_floor || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, location_floor: e.target.value })}
                            placeholder="Földszint"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Termek</Label>
                          <Input
                            value={editingStop.location_rooms || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, location_rooms: e.target.value })}
                            placeholder="Salles 300–348"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Időtartam (perc)</Label>
                          <Input
                            type="number"
                            value={editingStop.duration_minutes || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, duration_minutes: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Fő műalkotás</Label>
                          <Input
                            value={editingStop.main_artwork || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, main_artwork: e.target.value })}
                            placeholder="Taniszi Szfinx"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Leírás / Mit érdemes figyelni</Label>
                          <Textarea
                            value={editingStop.description || ''}
                            onChange={(e) => setEditingStop({ ...editingStop, description: e.target.value })}
                            rows={3}
                            placeholder="Mit érdemes megfigyelni ennél a megállónál..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveStopMutation.mutate(editingStop)}
                          disabled={saveStopMutation.isPending}
                          size="sm"
                          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-xs"
                        >
                          {saveStopMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          Mentés
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingStop(null)} className="text-xs">
                          Mégse
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Stops list */}
                  {stops && stops.length > 0 ? (
                    <div className="space-y-2">
                      {stops.map((stop) => (
                        <div key={stop.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                            {stop.stop_number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-800">{stop.title}</p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {stop.location_wing} · {stop.location_floor}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {stop.duration_minutes} perc
                              </span>
                            </div>
                            {stop.main_artwork && (
                              <p className="mt-1 text-xs text-violet-600 font-medium">{stop.main_artwork}</p>
                            )}
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{stop.description}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStop(stop)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Törlöd ezt a megállót?')) {
                                  deleteStopMutation.mutate(stop.id)
                                }
                              }}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !editingStop ? (
                    <p className="text-center text-xs text-slate-400 py-4">
                      Még nincsenek megállók. Adj hozzá az elsőt!
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
