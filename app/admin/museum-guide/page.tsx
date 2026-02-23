'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { MuseumGuideArtwork, MuseumWing } from '@/lib/types/database'
import { GRADIENT_PRESETS } from '@/lib/types/database'
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Landmark,
  MapPin,
  Palette,
  GripVertical,
} from 'lucide-react'

const supabase = createClient()

const WINGS: MuseumWing[] = ['Denon', 'Sully', 'Richelieu']

const EMPTY_ARTWORK: Partial<MuseumGuideArtwork> = {
  title: '',
  artist: '',
  year: '',
  wing: 'Denon',
  floor: '',
  room: '',
  story: '',
  fun_fact: '',
  image_url: '',
  gradient: GRADIENT_PRESETS[0].value,
  map_position_x: 50,
  map_position_y: 50,
  display_order: 0,
  is_published: true,
}

export default function MuseumGuideAdminPage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Partial<MuseumGuideArtwork> | null>(null)

  // ── Fetch all artworks ──
  const { data: artworks, isLoading } = useQuery({
    queryKey: ['museum-guide-artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('museum_guide_artworks')
        .select('*')
        .order('display_order', { ascending: true })
      if (error) throw error
      return data as MuseumGuideArtwork[]
    },
  })

  // ── Save (insert/update) ──
  const saveMutation = useMutation({
    mutationFn: async (artwork: Partial<MuseumGuideArtwork>) => {
      if (artwork.id) {
        const { id, created_at, updated_at, ...updateData } = artwork
        const { data, error } = await supabase
          .from('museum_guide_artworks')
          .update(updateData)
          .eq('id', id)
          .select()
        if (error) throw error
        return data
      } else {
        const { id, created_at, updated_at, ...insertData } = artwork
        // Set display_order to next available
        insertData.display_order = (artworks?.length || 0) + 1
        const { data, error } = await supabase
          .from('museum_guide_artworks')
          .insert([insertData])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['museum-guide-artworks'] })
      setIsEditing(false)
      setEditingArtwork(null)
    },
  })

  // ── Delete ──
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('museum_guide_artworks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['museum-guide-artworks'] })
    },
  })

  // ── Reorder ──
  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('museum_guide_artworks')
        .update({ display_order: newOrder })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['museum-guide-artworks'] })
    },
  })

  // ── Toggle published ──
  const togglePublished = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('museum_guide_artworks')
        .update({ is_published })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['museum-guide-artworks'] })
    },
  })

  // ── Handlers ──
  const handleNew = () => {
    setEditingArtwork({ ...EMPTY_ARTWORK })
    setIsEditing(true)
  }

  const handleEdit = (artwork: MuseumGuideArtwork) => {
    setEditingArtwork({ ...artwork })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingArtwork(null)
  }

  const handleSave = () => {
    if (!editingArtwork) return
    if (!editingArtwork.title || !editingArtwork.artist || !editingArtwork.story) {
      alert('A cím, művész és sztori mezők kötelezőek!')
      return
    }
    saveMutation.mutate(editingArtwork)
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Biztosan törlöd: "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleMoveUp = (artwork: MuseumGuideArtwork, index: number) => {
    if (index === 0 || !artworks) return
    const prev = artworks[index - 1]
    reorderMutation.mutate({ id: artwork.id, newOrder: prev.display_order })
    reorderMutation.mutate({ id: prev.id, newOrder: artwork.display_order })
  }

  const handleMoveDown = (artwork: MuseumGuideArtwork, index: number) => {
    if (!artworks || index === artworks.length - 1) return
    const next = artworks[index + 1]
    reorderMutation.mutate({ id: artwork.id, newOrder: next.display_order })
    reorderMutation.mutate({ id: next.id, newOrder: artwork.display_order })
  }

  const updateField = (field: string, value: unknown) => {
    setEditingArtwork((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  // ── Stats ──
  const publishedCount = artworks?.filter((a) => a.is_published).length || 0
  const totalCount = artworks?.length || 0
  const wingCounts = artworks?.reduce(
    (acc, a) => {
      acc[a.wing] = (acc[a.wing] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  ) || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-slate-900">Múzeum Útikalauz</h1>
          <p className="text-sm text-slate-500 mt-1">Louvre interaktív guide alkotásainak kezelése</p>
        </div>
        {!isEditing && (
          <Button onClick={handleNew} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Új alkotás
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Összes alkotás" value={totalCount} />
        <StatCard label="Publikált" value={publishedCount} />
        <StatCard label="Denon szárny" value={wingCounts['Denon'] || 0} />
        <StatCard label="Sully / Richelieu" value={(wingCounts['Sully'] || 0) + (wingCounts['Richelieu'] || 0)} />
      </div>

      {/* Edit form */}
      {isEditing && editingArtwork && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {editingArtwork.id ? 'Alkotás szerkesztése' : 'Új alkotás hozzáadása'}
            </h2>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Row 1: Basic info */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Cím *</Label>
                <Input
                  value={editingArtwork.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="pl. Mona Lisa"
                />
              </div>
              <div>
                <Label>Művész *</Label>
                <Input
                  value={editingArtwork.artist || ''}
                  onChange={(e) => updateField('artist', e.target.value)}
                  placeholder="pl. Leonardo da Vinci"
                />
              </div>
              <div>
                <Label>Évszám</Label>
                <Input
                  value={editingArtwork.year || ''}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="pl. 1503–1519"
                />
              </div>
            </div>

            {/* Row 2: Location */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Szárny *</Label>
                <select
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={editingArtwork.wing || 'Denon'}
                  onChange={(e) => updateField('wing', e.target.value)}
                >
                  {WINGS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Emelet</Label>
                <Input
                  value={editingArtwork.floor || ''}
                  onChange={(e) => updateField('floor', e.target.value)}
                  placeholder="pl. 1. emelet"
                />
              </div>
              <div>
                <Label>Terem</Label>
                <Input
                  value={editingArtwork.room || ''}
                  onChange={(e) => updateField('room', e.target.value)}
                  placeholder="pl. 711. terem"
                />
              </div>
            </div>

            {/* Row 3: Story */}
            <div>
              <Label>Sztori * <span className="text-slate-400 font-normal">(új bekezdéshez használj üres sort)</span></Label>
              <Textarea
                value={editingArtwork.story || ''}
                onChange={(e) => updateField('story', e.target.value)}
                placeholder="Írd meg az alkotás történetét..."
                rows={6}
              />
            </div>

            {/* Row 4: Fun fact */}
            <div>
              <Label>Érdekesség <span className="text-slate-400 font-normal">(opcionális)</span></Label>
              <Textarea
                value={editingArtwork.fun_fact || ''}
                onChange={(e) => updateField('fun_fact', e.target.value)}
                placeholder="Egy rövid érdekesség az alkotásról..."
                rows={2}
              />
            </div>

            {/* Row 5: Image + Gradient */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Kép URL <span className="text-slate-400 font-normal">(opcionális)</span></Label>
                <Input
                  value={editingArtwork.image_url || ''}
                  onChange={(e) => updateField('image_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Háttér gradient</Label>
                <select
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={editingArtwork.gradient || GRADIENT_PRESETS[0].value}
                  onChange={(e) => updateField('gradient', e.target.value)}
                >
                  {GRADIENT_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {/* Gradient preview */}
                <div
                  className="mt-2 h-8 rounded-lg border border-slate-200"
                  style={{ background: editingArtwork.gradient || GRADIENT_PRESETS[0].value }}
                />
              </div>
            </div>

            {/* Row 6: Map position */}
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Térkép pozíció (% — bal fent = 0,0)
              </Label>
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <div>
                  <Label className="text-xs text-slate-400">X pozíció (balról %)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editingArtwork.map_position_x ?? 50}
                    onChange={(e) => updateField('map_position_x', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Y pozíció (fentről %)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editingArtwork.map_position_y ?? 50}
                    onChange={(e) => updateField('map_position_y', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              {/* Mini map preview */}
              <div className="mt-3 relative w-full max-w-xs aspect-[5/4] rounded-lg overflow-hidden border border-slate-200" style={{ backgroundColor: '#23221F' }}>
                <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <g opacity="0.25" stroke="#D4C49E" fill="none" strokeWidth="0.5">
                    <rect x="15" y="12" width="35" height="12" rx="1" />
                    <rect x="50" y="12" width="12" height="55" rx="1" />
                    <rect x="15" y="55" width="35" height="12" rx="1" />
                    <rect x="15" y="12" width="12" height="55" rx="1" />
                  </g>
                  <text x="32" y="9" textAnchor="middle" fill="#D4C49E" opacity="0.4" fontSize="2.5">RICHELIEU</text>
                  <text x="32" y="75" textAnchor="middle" fill="#D4C49E" opacity="0.4" fontSize="2.5">DENON</text>
                  <text x="72" y="42" textAnchor="middle" fill="#D4C49E" opacity="0.4" fontSize="2.5">SULLY</text>
                </svg>
                {/* Pin indicator */}
                <div
                  className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-lg"
                  style={{
                    left: `${editingArtwork.map_position_x ?? 50}%`,
                    top: `${editingArtwork.map_position_y ?? 50}%`,
                    backgroundColor: '#B8A472',
                  }}
                />
              </div>
            </div>

            {/* Row 7: Publish toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArtwork.is_published ?? true}
                  onChange={(e) => updateField('is_published', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">Publikálva (látható a guide-ban)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Mégse
              </Button>
              {saveMutation.isError && (
                <p className="text-red-500 text-sm self-center">
                  Hiba: {(saveMutation.error as Error)?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Artworks list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Betöltés...</div>
        ) : !artworks?.length ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Landmark className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Még nincs alkotás hozzáadva</p>
            <p className="text-sm text-slate-400 mt-1">Kattints az &quot;Új alkotás&quot; gombra a kezdéshez</p>
          </div>
        ) : (
          artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-opacity ${
                artwork.is_published ? 'border-slate-200' : 'border-slate-100 opacity-60'
              }`}
            >
              {/* Order + Reorder */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleMoveUp(artwork, index)}
                  disabled={index === 0}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-400 w-6 text-center">
                  {index + 1}
                </span>
                <button
                  onClick={() => handleMoveDown(artwork, index)}
                  disabled={index === artworks.length - 1}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Gradient preview */}
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: artwork.gradient }}
              >
                <span className="font-playfair font-bold text-white/40 text-2xl">{index + 1}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{artwork.title}</h3>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
                    style={{
                      backgroundColor:
                        artwork.wing === 'Denon' ? '#7B6F52' :
                        artwork.wing === 'Sully' ? '#6B7B5E' : '#5E6B7B',
                    }}
                  >
                    {artwork.wing}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {artwork.artist} &middot; {artwork.year} &middot; {artwork.floor}, {artwork.room}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {artwork.story.replace(/\n/g, ' ').slice(0, 100)}...
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublished.mutate({ id: artwork.id, is_published: !artwork.is_published })}
                  className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                  title={artwork.is_published ? 'Elrejtés' : 'Publikálás'}
                >
                  {artwork.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(artwork)}
                  className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600"
                  title="Szerkesztés"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(artwork.id, artwork.title)}
                  className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-red-600"
                  title="Törlés"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  )
}
