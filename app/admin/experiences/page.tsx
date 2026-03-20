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
  Euro,
  Users,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  X,
  Check,
} from 'lucide-react'
import type { Experience, ExperienceDesignAccent } from '@/lib/types/database'

const DESIGN_ACCENT_LABELS: Record<ExperienceDesignAccent, string> = {
  VR_3D: 'VR / 3D Virtuális',
  GASTRONOMY: 'Gasztronómia',
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const emptyForm = (): Partial<Experience> => ({
  slug: '',
  title: '',
  short_description: '',
  full_description: '',
  price: 0,
  group_size: '',
  duration: '',
  image: '/images/eiffel1.jpeg',
  design_accent: 'VR_3D',
  includes: [],
  is_active: true,
})

export default function ExperiencesAdminPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Partial<Experience>>(emptyForm())
  const [includesInput, setIncludesInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Experience[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (exp: Partial<Experience>) => {
      const payload = { ...exp }
      if (!payload.slug && payload.title) {
        payload.slug = slugify(payload.title)
      }
      if (payload.id) {
        const { id, created_at, updated_at, ...updateData } = payload as Experience
        const { error } = await supabase.from('experiences').update(updateData).eq('id', id)
        if (error) throw error
      } else {
        const { id, created_at, updated_at, ...insertData } = payload as any
        const { error } = await supabase.from('experiences').insert([insertData])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] })
      setEditingId(null)
      setForm(emptyForm())
      setIncludesInput('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] })
      setDeleteConfirm(null)
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('experiences').update({ is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-experiences'] }),
  })

  function startEdit(exp: Experience) {
    setForm({ ...exp })
    setIncludesInput('')
    setEditingId(exp.id)
  }

  function startNew() {
    setForm(emptyForm())
    setIncludesInput('')
    setEditingId('new')
  }

  function addInclude() {
    const val = includesInput.trim()
    if (!val) return
    setForm((f) => ({ ...f, includes: [...(f.includes || []), val] }))
    setIncludesInput('')
  }

  function removeInclude(i: number) {
    setForm((f) => ({ ...f, includes: (f.includes || []).filter((_, idx) => idx !== i) }))
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: f.id ? f.slug : slugify(title),
    }))
  }

  const isEditorOpen = editingId !== null

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Párizsi Élmények</h1>
          <p className="text-slate-500 text-sm mt-1">Különleges foglalható élmények kezelése</p>
        </div>
        <Button onClick={startNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Új élmény
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: list */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-slate-400 text-sm text-center py-8">Betöltés...</div>
          )}
          {!isLoading && experiences?.length === 0 && (
            <div className="text-slate-400 text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              Még nincs élmény. Kattints az „Új élmény" gombra!
            </div>
          )}
          {experiences?.map((exp) => (
            <Card key={exp.id} className={`transition-all ${!exp.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/eiffel1.jpeg' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800 text-sm truncate">{exp.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        exp.design_accent === 'VR_3D'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {DESIGN_ACCENT_LABELS[exp.design_accent]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />{exp.price} €
                      </span>
                      {exp.group_size && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />{exp.group_size}
                        </span>
                      )}
                      {exp.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{exp.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{exp.short_description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(exp)}
                    className="flex items-center gap-1 h-7 text-xs"
                  >
                    <Edit className="h-3 w-3" /> Szerkesztés
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActiveMutation.mutate({ id: exp.id, is_active: !exp.is_active })}
                    className="flex items-center gap-1 h-7 text-xs"
                  >
                    {exp.is_active ? (
                      <><EyeOff className="h-3 w-3" /> Elrejtés</>
                    ) : (
                      <><Eye className="h-3 w-3" /> Megjelenítés</>
                    )}
                  </Button>
                  {deleteConfirm === exp.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(exp.id)}
                        className="h-7 text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" /> Törlés megerősítése
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirm(exp.id)}
                      className="flex items-center gap-1 h-7 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" /> Törlés
                    </Button>
                  )}
                  <a
                    href={`/elmenyek/${exp.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> Előnézet
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: editor */}
        {isEditorOpen && (
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {editingId === 'new' ? 'Új élmény létrehozása' : 'Élmény szerkesztése'}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditingId(null); setForm(emptyForm()) }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Cím *</Label>
                  <Input
                    value={form.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="pl. Különleges Notre-Dame élménytúra"
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">URL slug *</Label>
                  <Input
                    value={form.slug || ''}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="pl. notre-dame-elmenytura"
                    className="font-mono text-sm"
                  />
                </div>

                {/* Short description */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Rövid leírás *</Label>
                  <Textarea
                    value={form.short_description || ''}
                    onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                    rows={2}
                    placeholder="1-2 mondatos összefoglaló"
                  />
                </div>

                {/* Full description */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Teljes leírás (Markdown)</Label>
                  <Textarea
                    value={form.full_description || ''}
                    onChange={(e) => setForm((f) => ({ ...f, full_description: e.target.value }))}
                    rows={8}
                    placeholder="Részletes leírás, bekezdésekkel..."
                    className="font-mono text-sm"
                  />
                </div>

                {/* Price + Group size + Duration in a row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-slate-600 mb-1 block">Ár (€) *</Label>
                    <Input
                      type="number"
                      value={form.price || 0}
                      onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600 mb-1 block">Csoportméret</Label>
                    <Input
                      value={form.group_size || ''}
                      onChange={(e) => setForm((f) => ({ ...f, group_size: e.target.value || null }))}
                      placeholder="pl. 4-25 főig"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600 mb-1 block">Időtartam</Label>
                    <Input
                      value={form.duration || ''}
                      onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value || null }))}
                      placeholder="pl. kb. 1 óra"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Kép URL</Label>
                  <Input
                    value={form.image || ''}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="/images/..."
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-2 h-24 w-full object-cover rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>

                {/* Design Accent */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Design stílus</Label>
                  <select
                    value={form.design_accent || 'VR_3D'}
                    onChange={(e) => setForm((f) => ({ ...f, design_accent: e.target.value as ExperienceDesignAccent }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="VR_3D">VR / 3D Virtuális</option>
                    <option value="GASTRONOMY">Gasztronómia</option>
                  </select>
                </div>

                {/* Includes */}
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">Tartalmazza (includes)</Label>
                  <div className="space-y-2">
                    {(form.includes || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex-1 text-sm bg-slate-50 rounded px-3 py-1.5 border border-slate-200">
                          {item}
                        </span>
                        <button
                          onClick={() => removeInclude(i)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={includesInput}
                        onChange={(e) => setIncludesInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInclude() } }}
                        placeholder="pl. magyar nyelvű idegenvezetés"
                        className="flex-1 text-sm"
                      />
                      <Button size="sm" variant="outline" onClick={addInclude}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active ?? true}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <Label htmlFor="is_active" className="text-sm cursor-pointer">
                    Aktív (látható a weboldalon)
                  </Label>
                </div>

                {/* Save */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => saveMutation.mutate(form)}
                    disabled={saveMutation.isPending || !form.title || !form.slug}
                    className="flex-1"
                  >
                    {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setEditingId(null); setForm(emptyForm()) }}
                  >
                    Mégse
                  </Button>
                </div>

                {saveMutation.isError && (
                  <p className="text-red-600 text-sm">
                    Hiba: {(saveMutation.error as Error)?.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
