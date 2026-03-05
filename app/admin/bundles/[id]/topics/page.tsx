'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import {
  Plus,
  Save,
  X,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Package,
  Layers,
} from 'lucide-react'
import type { Bundle, BundleTopic } from '@/lib/types/database'

interface TopicsEditorProps {
  params: { id: string }
}

export default function TopicsEditor({ params }: TopicsEditorProps) {
  const bundleId = params.id
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { userId, isSuperAdmin } = useUserRole()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: '' as '' | 'beginner' | 'intermediate' | 'advanced',
    estimated_time_minutes: '',
  })

  const { data: bundle } = useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single()
      return data as Bundle
    },
  })

  // Fetch topics
  const { data: topics, isLoading } = useQuery({
    queryKey: ['bundle-topics', bundleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('bundle_topics')
        .select('*')
        .eq('bundle_id', bundleId)
        .order('topic_order', { ascending: true })
      return (data ?? []) as BundleTopic[]
    },
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: typeof formData }) => {
      if (!data.title.trim()) throw new Error('A témakör neve kötelező!')

      const slug = generateSlug(data.title)
      const topicData = {
        title: data.title.trim(),
        slug,
        description: data.description || null,
        difficulty_level: data.difficulty_level || null,
        estimated_time_minutes: data.estimated_time_minutes ? parseInt(data.estimated_time_minutes, 10) : null,
      }

      if (id) {
        const { error } = await supabase
          .from('bundle_topics')
          .update(topicData)
          .eq('id', id)
        if (error) throw error
      } else {
        const maxOrder = topics?.reduce((max, t) => Math.max(max, t.topic_order), -1) ?? -1
        const { error } = await supabase
          .from('bundle_topics')
          .insert({
            ...topicData,
            bundle_id: bundleId,
            author_id: userId,
            topic_order: maxOrder + 1,
            is_published: false,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle-topics', bundleId] })
      setIsCreating(false)
      setEditingId(null)
      resetForm()
    },
    onError: (error: Error) => {
      setSaveError(error.message || 'Mentés sikertelen. Kérjük, próbáld újra.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bundle_topics').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle-topics', bundleId] })
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('bundle_topics')
        .update({ is_published })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle-topics', bundleId] })
    },
  })

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('bundle_topics')
        .update({ topic_order: newOrder })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle-topics', bundleId] })
    },
  })

  const resetForm = () => {
    setFormData({ title: '', description: '', difficulty_level: '', estimated_time_minutes: '' })
    setSaveError(null)
  }

  const handleEdit = (topic: BundleTopic) => {
    setEditingId(topic.id)
    setSaveError(null)
    setFormData({
      title: topic.title,
      description: topic.description || '',
      difficulty_level: topic.difficulty_level || '',
      estimated_time_minutes: topic.estimated_time_minutes ? String(topic.estimated_time_minutes) : '',
    })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    resetForm()
  }

  const handleMoveUp = (topic: BundleTopic, index: number) => {
    if (index === 0 || !topics) return
    const prevTopic = topics[index - 1]
    reorderMutation.mutate({ id: topic.id, newOrder: prevTopic.topic_order })
    reorderMutation.mutate({ id: prevTopic.id, newOrder: topic.topic_order })
  }

  const handleMoveDown = (topic: BundleTopic, index: number) => {
    if (!topics || index === topics.length - 1) return
    const nextTopic = topics[index + 1]
    reorderMutation.mutate({ id: topic.id, newOrder: nextTopic.topic_order })
    reorderMutation.mutate({ id: nextTopic.id, newOrder: topic.topic_order })
  }

  const isAuthorized = isSuperAdmin || (bundle && bundle.author_id === userId)

  if (!isAuthorized && bundle) {
    return (
      <div className="p-8">
        <Card className="border-french-red-200">
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-bold text-french-red-500">Hozzáférés megtagadva</h2>
            <p className="mt-2 text-slate-600">Nincs jogosultságod ennek a csomagnak a szerkesztéséhez.</p>
            <Link href="/admin/bundles">
              <Button className="mt-4 bg-french-blue-500 hover:bg-french-blue-600">
                Vissza a csomagokhoz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  const difficultyLabels: Record<string, string> = {
    beginner: 'Kezdő',
    intermediate: 'Középhaladó',
    advanced: 'Haladó',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/bundles">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vissza a csomagokhoz
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
              {bundle?.title} — Témakörök
            </h1>
            <p className="mt-2 text-slate-600">
              Témakörök kezelése ({topics?.length || 0} témakör)
            </p>
          </div>
          <Button
            onClick={() => { setIsCreating(true); setSaveError(null) }}
            className="bg-french-red-500 hover:bg-french-red-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Új témakör
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-6 border-french-blue-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-french-blue-500">
                {editingId ? 'Témakör szerkesztése' : 'Új témakör'}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveMutation.mutate({ id: editingId || undefined, data: formData })}
                  disabled={saveMutation.isPending}
                  className="bg-french-red-500 hover:bg-french-red-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Mentés
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Mégse
                </Button>
              </div>
            </div>

            {saveError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Témakör neve *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="pl. Tömegközlekedés, Francia konyha, Múzeumok"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Leírás</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="A témakör rövid leírása..."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nehézségi szint</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value as typeof formData.difficulty_level }))}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Nincs megadva</option>
                    <option value="beginner">Kezdő</option>
                    <option value="intermediate">Középhaladó</option>
                    <option value="advanced">Haladó</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Becsült idő (perc)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.estimated_time_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_time_minutes: e.target.value }))}
                    placeholder="pl. 15"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topics List */}
      {topics && topics.length > 0 ? (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <Card key={topic.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveUp(topic, index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <span className="text-center text-xs font-semibold text-slate-500">
                      {index + 1}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveDown(topic, index)}
                      disabled={index === topics.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-french-blue-500">{topic.title}</h4>
                      {!topic.is_published && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          Vázlat
                        </span>
                      )}
                      {topic.difficulty_level && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {difficultyLabels[topic.difficulty_level]}
                        </span>
                      )}
                    </div>
                    {topic.description && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-1">{topic.description}</p>
                    )}
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {topic.total_cards} kártya
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/bundles/${bundleId}/topics/${topic.id}/cards`)}
                    >
                      <Package className="mr-1 h-3 w-3" />
                      Kártyák
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublishMutation.mutate({ id: topic.id, is_published: !topic.is_published })}
                    >
                      {topic.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(topic)}
                      className="bg-french-blue-500 hover:bg-french-blue-600"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Biztosan törli ezt a témakört? Minden benne lévő kártya is törlődik!')) {
                          deleteMutation.mutate(topic.id)
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">Még nincs témakör</h3>
            <p className="mt-2 text-sm text-slate-400">
              Hozz létre témakörokat (pl. Közlekedés, Étterem, Kultúra) és adj hozzá kártyákat!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
