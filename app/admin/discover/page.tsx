'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Save, X, ArrowUp, ArrowDown, Compass } from 'lucide-react'
import type { DiscoverItem } from '@/lib/types/database'
import Image from 'next/image'

export default function DiscoverAdminPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    category: '',
    is_published: true,
  })

  const { data: items, isLoading } = useQuery({
    queryKey: ['discover-items'],
    queryFn: async () => {
      const { data } = await supabase
        .from('discover_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      return data as DiscoverItem[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discover_items')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-items'] })
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('discover_items')
        .update({ is_published })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-items'] })
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: typeof formData }) => {
      if (id) {
        // Update existing
        const { error } = await supabase
          .from('discover_items')
          .update(data)
          .eq('id', id)
        if (error) throw error
      } else {
        // Create new - set sort_order to max + 1
        const maxOrder = items?.reduce((max, item) => Math.max(max, item.sort_order), 0) || 0
        const { error } = await supabase
          .from('discover_items')
          .insert({ ...data, sort_order: maxOrder + 1 })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-items'] })
      setEditingId(null)
      setIsCreating(false)
      setFormData({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        category: '',
        is_published: true,
      })
    },
  })

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('discover_items')
        .update({ sort_order: newOrder })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-items'] })
    },
  })

  const handleEdit = (item: DiscoverItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      link_url: item.link_url || '',
      category: item.category || '',
      is_published: item.is_published,
    })
  }

  const handleSave = (id?: string) => {
    saveMutation.mutate({ id, data: formData })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      category: '',
      is_published: true,
    })
  }

  const handleMoveUp = (item: DiscoverItem, index: number) => {
    if (index === 0 || !items) return
    const prevItem = items[index - 1]
    reorderMutation.mutate({ id: item.id, newOrder: prevItem.sort_order })
    reorderMutation.mutate({ id: prevItem.id, newOrder: item.sort_order })
  }

  const handleMoveDown = (item: DiscoverItem, index: number) => {
    if (!items || index === items.length - 1) return
    const nextItem = items[index + 1]
    reorderMutation.mutate({ id: item.id, newOrder: nextItem.sort_order })
    reorderMutation.mutate({ id: nextItem.id, newOrder: item.sort_order })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('discover-images')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('discover-images')
      .getPublicUrl(filePath)

    setFormData(prev => ({ ...prev, image_url: publicUrl }))
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
            Párizs Ismertető
          </h1>
          <p className="mt-2 text-slate-600">
            Kezelje a &ldquo;Discover Paris&rdquo; kártyákat - húzza az elemeket az újrarendezéshez
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-french-blue-500 hover:bg-french-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Új kártya
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="mb-6 border-french-blue-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-french-blue-500">Új Discover kártya</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSave()}
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cím *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="pl. Gasztronómia"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kategória
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="pl. Kultúra"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Leírás
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Rövid leírás..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kép feltöltés
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Vagy kép URL
                </label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Link URL
                </label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="/discover#gastronomy"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      {items && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="overflow-hidden border-slate-200 transition-shadow hover:shadow-lg">
              {editingId === item.id ? (
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-french-blue-500">Szerkesztés</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(item.id)}
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Cím *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Kategória
                      </label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Leírás
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Kép feltöltés
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Vagy kép URL
                      </label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Link URL
                      </label>
                      <Input
                        value={formData.link_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Drag Handle & Reorder */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveUp(item, index)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <GripVertical className="h-5 w-5 text-slate-400" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveDown(item, index)}
                        disabled={index === items.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Image Preview */}
                    {item.image_url && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-french-blue-500">
                          {item.title}
                        </h3>
                        {item.category && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {item.category}
                          </span>
                        )}
                        {!item.is_published && (
                          <span className="rounded-full bg-french-red-100 px-2 py-0.5 text-xs text-french-red-600">
                            Vázlat
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {item.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        Sorrend: {item.sort_order}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: item.id,
                            is_published: !item.is_published,
                          })
                        }
                      >
                        {item.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="bg-french-blue-500 hover:bg-french-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Biztosan törli ezt az elemet?')) {
                            deleteMutation.mutate(item.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Compass className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">
              Még nincs Discover kártya
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Kezdje el azzal, hogy létrehoz egy új kártyát!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
