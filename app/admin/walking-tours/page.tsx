'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Euro,
  XCircle,
  Eye,
  Footprints,
} from 'lucide-react'
import Link from 'next/link'
import type { WalkingTour } from '@/lib/types/database'

const statusLabels: Record<string, string> = {
  draft: 'Vázlat',
  published: 'Publikált',
  cancelled: 'Lemondva',
  completed: 'Befejezett',
}

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  published: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function WalkingToursPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTour, setEditingTour] = useState<Partial<WalkingTour> | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: tours, isLoading } = useQuery({
    queryKey: ['walking-tours'],
    queryFn: async () => {
      const { data } = await supabase
        .from('walking_tours')
        .select('*')
        .order('tour_date', { ascending: false })
      return data as WalkingTour[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (tour: Partial<WalkingTour>) => {
      const payload = { ...tour }
      // Auto-generate slug if empty
      if (!payload.slug && payload.title && payload.tour_date) {
        payload.slug = `${payload.title.toLowerCase().replace(/[^a-z0-9áéíóöőúüű]+/gi, '-').replace(/^-|-$/g, '')}-${payload.tour_date}`
      }

      if (payload.id) {
        const { id, created_at, updated_at, current_bookings, ...updateData } = payload as WalkingTour
        const { data, error } = await supabase
          .from('walking_tours')
          .update(updateData)
          .eq('id', id)
          .select()
        if (error) throw error
        return data
      } else {
        const { id, created_at, updated_at, current_bookings, ...insertData } = payload as any
        const { data, error } = await supabase
          .from('walking_tours')
          .insert([insertData])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walking-tours'] })
      setIsEditing(false)
      setEditingTour(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('walking_tours').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walking-tours'] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      // Cancel the tour
      const { error: tourError } = await supabase
        .from('walking_tours')
        .update({ status: 'cancelled', cancellation_reason: reason })
        .eq('id', id)
      if (tourError) throw tourError

      // Cancel all confirmed bookings and refund
      const { error: bookingsError } = await supabase
        .from('walking_tour_bookings')
        .update({
          booking_status: 'cancelled_by_admin',
          payment_status: 'refunded',
        })
        .eq('walking_tour_id', id)
        .eq('booking_status', 'confirmed')
      if (bookingsError) throw bookingsError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walking-tours'] })
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
      description: '',
      short_description: '',
      tour_date: '',
      start_time: '10:00',
      duration_minutes: 120,
      meeting_point: '',
      meeting_point_url: '',
      price_per_person: 25,
      min_participants: 4,
      max_participants: 15,
      image_url: '',
      highlights: [],
      status: 'draft',
    })
    setIsEditing(true)
  }

  const handleCancel = (tour: WalkingTour) => {
    const reason = window.prompt('Add meg a lemondás okát:')
    if (reason) {
      cancelMutation.mutate({ id: tour.id, reason })
    }
  }

  const handleAddHighlight = () => {
    if (editingTour) {
      setEditingTour({
        ...editingTour,
        highlights: [...(editingTour.highlights || []), ''],
      })
    }
  }

  const handleHighlightChange = (index: number, value: string) => {
    if (editingTour?.highlights) {
      const newHighlights = [...editingTour.highlights]
      newHighlights[index] = value
      setEditingTour({ ...editingTour, highlights: newHighlights })
    }
  }

  const handleRemoveHighlight = (index: number) => {
    if (editingTour?.highlights) {
      const newHighlights = [...editingTour.highlights]
      newHighlights.splice(index, 1)
      setEditingTour({ ...editingTour, highlights: newHighlights })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const today = new Date().toISOString().split('T')[0]
  const upcomingCount = tours?.filter(
    (t) => t.status === 'published' && t.tour_date >= today
  ).length || 0
  const totalBookings = tours?.reduce((sum, t) => sum + (t.current_bookings || 0), 0) || 0
  const totalRevenue = tours?.reduce(
    (sum, t) => sum + (t.current_bookings || 0) * Number(t.price_per_person),
    0
  ) || 0

  if (isLoading) {
    return <div className="p-8"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Sétatúrák kezelése
        </h1>
        <Button onClick={handleNew} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Új sétatúra
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Közelgő túrák</p>
                <p className="mt-2 text-3xl font-bold text-french-blue-500">{upcomingCount}</p>
              </div>
              <Footprints className="h-12 w-12 text-french-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Összes foglalás (fő)</p>
                <p className="mt-2 text-3xl font-bold text-french-blue-500">{totalBookings}</p>
              </div>
              <Users className="h-12 w-12 text-french-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Összes bevétel</p>
                <p className="mt-2 text-3xl font-bold text-french-red-500">€{totalRevenue.toFixed(0)}</p>
              </div>
              <Euro className="h-12 w-12 text-french-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      {isEditing && editingTour && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTour.id ? 'Sétatúra szerkesztése' : 'Új sétatúra létrehozása'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Túra neve *</Label>
                <Input
                  id="title"
                  value={editingTour.title || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                  placeholder="pl. Montmartre-i Séta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={editingTour.slug || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                  placeholder="automatikus ha üresen hagyod"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Rövid leírás</Label>
              <Textarea
                id="short_description"
                value={editingTour.short_description || ''}
                onChange={(e) => setEditingTour({ ...editingTour, short_description: e.target.value })}
                rows={2}
                placeholder="Megjelenik a kártyákon..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Részletes leírás</Label>
              <Textarea
                id="description"
                value={editingTour.description || ''}
                onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                rows={5}
                placeholder="Részletes leírás a túráról..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tour_date">Dátum *</Label>
                <Input
                  id="tour_date"
                  type="date"
                  value={editingTour.tour_date || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, tour_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Kezdés *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={editingTour.start_time || '10:00'}
                  onChange={(e) => setEditingTour({ ...editingTour, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Időtartam (perc)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={editingTour.duration_minutes || 120}
                  onChange={(e) => setEditingTour({ ...editingTour, duration_minutes: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meeting_point">Találkozópont *</Label>
                <Input
                  id="meeting_point"
                  value={editingTour.meeting_point || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, meeting_point: e.target.value })}
                  placeholder="pl. Sacré-Cœur bazilika főbejárat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_point_url">Google Maps link</Label>
                <Input
                  id="meeting_point_url"
                  value={editingTour.meeting_point_url || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, meeting_point_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price_per_person">Ár / fő (EUR)</Label>
                <Input
                  id="price_per_person"
                  type="number"
                  value={editingTour.price_per_person || 25}
                  onChange={(e) => setEditingTour({ ...editingTour, price_per_person: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_participants">Min. létszám</Label>
                <Input
                  id="min_participants"
                  type="number"
                  value={editingTour.min_participants || 4}
                  onChange={(e) => setEditingTour({ ...editingTour, min_participants: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max. létszám</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={editingTour.max_participants || 15}
                  onChange={(e) => setEditingTour({ ...editingTour, max_participants: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Kép URL</Label>
              <Input
                id="image_url"
                value={editingTour.image_url || ''}
                onChange={(e) => setEditingTour({ ...editingTour, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Státusz</Label>
              <select
                id="status"
                value={editingTour.status || 'draft'}
                onChange={(e) => setEditingTour({ ...editingTour, status: e.target.value as WalkingTour['status'] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Vázlat</option>
                <option value="published">Publikált</option>
              </select>
            </div>

            {/* Highlights */}
            <div className="space-y-3 rounded-lg border-2 border-parisian-beige-200 bg-parisian-cream-50 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Túra kiemelt pontjai</Label>
                <Button type="button" onClick={handleAddHighlight} size="sm" variant="outline">
                  <Plus className="mr-1 h-3 w-3" /> Új pont
                </Button>
              </div>
              {editingTour.highlights?.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={h}
                    onChange={(e) => handleHighlightChange(i, e.target.value)}
                    placeholder="pl. Sacré-Cœur bazilika meglátogatása"
                  />
                  <Button type="button" onClick={() => handleRemoveHighlight(i)} size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} variant="secondary" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
              </Button>
              <Button onClick={() => { setIsEditing(false); setEditingTour(null) }} variant="outline">
                Mégse
              </Button>
            </div>
            {saveMutation.isError && (
              <p className="text-sm text-red-600">Hiba: {(saveMutation.error as Error).message}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tours List */}
      <div className="grid gap-4">
        {tours && tours.length > 0 ? (
          tours.map((tour) => (
            <Card key={tour.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-playfair text-xl font-bold text-navy-500">
                        {tour.title}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[tour.status]}`}>
                        {statusLabels[tour.status]}
                      </span>
                    </div>
                    {tour.short_description && (
                      <p className="mb-3 text-sm text-slate-600">{tour.short_description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {formatDate(tour.tour_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {tour.start_time?.slice(0, 5)} ({tour.duration_minutes} perc)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {tour.meeting_point}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-slate-400" />
                        {tour.current_bookings || 0} / {tour.max_participants} fő
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4 text-slate-400" />
                        {tour.price_per_person} EUR/fő
                      </span>
                    </div>
                    {tour.cancellation_reason && (
                      <p className="mt-2 text-sm text-red-600">
                        Lemondás oka: {tour.cancellation_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/walking-tours/bookings?tour_id=${tour.id}`}>
                      <Button size="sm" variant="outline" title="Foglalások">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingTour(tour); setIsEditing(true) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {tour.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(tour)}
                        title="Túra lemondása"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm('Biztosan törölni szeretnéd ezt a sétatúrát?')) {
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
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Footprints className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-semibold text-slate-500">Még nincs sétatúra</h3>
              <p className="mt-2 text-sm text-slate-400">
                Kattints az &quot;Új sétatúra&quot; gombra az első túra létrehozásához
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
