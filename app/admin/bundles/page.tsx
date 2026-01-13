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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  MapPin,
  Layers,
  Save,
  X
} from 'lucide-react'
import type { Bundle } from '@/lib/types/database'
import Image from 'next/image'

export default function BundlesAdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { role, userId, isLoading: roleLoading, isSuperAdmin, isVendor } = useUserRole()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    city: '',
    title: '',
    description: '',
  })

  console.log('BundlesAdminPage rendered, userId:', userId, 'roleLoading:', roleLoading)

  // Fetch available cities from city_pricing
  const { data: availableCities } = useQuery({
    queryKey: ['city-pricing'],
    queryFn: async () => {
      const { data } = await supabase
        .from('city_pricing')
        .select('city')
        .eq('is_active', true)
        .order('city', { ascending: true })
      if (!data) return []
      return data.map((c: { city: string }) => c.city).filter(Boolean)
    },
  })

  // Fetch bundles based on role
  const { data: bundles, isLoading } = useQuery({
    queryKey: ['bundles', userId, role],
    queryFn: async () => {
      if (!userId) return []

      let query = supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false })

      // Vendors only see their own bundles
      if (isVendor) {
        query = query.eq('author_id', userId)
      }

      const { data } = await query
      return data as Bundle[]
    },
    enabled: !!userId,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bundles').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] })
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('bundles')
        .update({ is_published })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] })
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: typeof formData }) => {
      // Auto-generate slug from title
      const slug = generateSlug(data.title)

      const bundleData = {
        city: data.city,
        title: data.title,
        description: data.description,
        slug,
      }

      if (id) {
        // Update existing
        const { error } = await supabase
          .from('bundles')
          .update(bundleData)
          .eq('id', id)
        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('bundles')
          .insert({ ...bundleData, author_id: userId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] })
      setIsCreating(false)
      setEditingId(null)
      resetForm()
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

  const resetForm = () => {
    setFormData({
      city: '',
      title: '',
      description: '',
    })
  }

  const handleEdit = (bundle: Bundle) => {
    setEditingId(bundle.id)
    setFormData({
      city: bundle.city,
      title: bundle.title,
      description: bundle.description || '',
    })
  }

  const handleSave = (id?: string) => {
    saveMutation.mutate({ id, data: formData })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    resetForm()
  }

  if (roleLoading || isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
            Flashcard Csomagok
          </h1>
          <p className="mt-2 text-slate-600">
            {isSuperAdmin
              ? 'Összes csomag kezelése'
              : 'Saját csomagjaim kezelése'}
          </p>
        </div>
        <Button
          onClick={() => {
            console.log('Create button clicked!')
            setIsCreating(true)
          }}
          className="bg-french-red-500 hover:bg-french-red-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Új csomag létrehozása
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-6 border-french-blue-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-french-blue-500">
                {editingId ? 'Csomag szerkesztése' : 'Új csomag'}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSave(editingId || undefined)}
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

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Város *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-french-blue-500"
                >
                  <option value="">Válassz várost...</option>
                  {Array.isArray(availableCities) && availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Témakör címe *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="pl. Tömegközlekedés, Étterem, Szállodázás"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Leírás *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="A témakör részletes leírása..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bundles List */}
      {bundles && bundles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <Card
              key={bundle.id}
              className="overflow-hidden border-slate-200 transition-shadow hover:shadow-lg"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src={bundle.cover_image || '/images/bundle-fallback.jpg'}
                  alt={bundle.title}
                  fill
                  className="object-cover"
                />
                {!bundle.is_published && (
                  <div className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    Vázlat
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                {/* Title & Stats */}
                <div className="mb-3">
                  <h3 className="mb-1 font-playfair text-xl font-bold text-french-blue-500">
                    {bundle.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {bundle.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {bundle.total_cards} kártya
                    </span>
                    {bundle.difficulty_level && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                        {bundle.difficulty_level === 'beginner' && 'Kezdő'}
                        {bundle.difficulty_level === 'intermediate' && 'Középhaladó'}
                        {bundle.difficulty_level === 'advanced' && 'Haladó'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {bundle.short_description && (
                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {bundle.short_description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/bundles/${bundle.id}/cards`)}
                  >
                    <Package className="mr-1 h-3 w-3" />
                    Kártyák ({bundle.total_cards})
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: bundle.id,
                        is_published: !bundle.is_published,
                      })
                    }
                  >
                    {bundle.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleEdit(bundle)}
                    className="bg-french-blue-500 hover:bg-french-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Biztosan törli ezt a csomagot? Minden kártya is törlődik!')) {
                        deleteMutation.mutate(bundle.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">
              Még nincs csomag
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Hozz létre egy új flashcard csomagot a kezdéshez!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
