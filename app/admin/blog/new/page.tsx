'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import type { Post, BlogCategory } from '@/lib/types/database'

export default function NewBlogPostPage() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    is_published: false,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')
      return data as BlogCategory[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Post> & { is_published: boolean }) => {
      const postData = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      }

      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.push('/admin/blog')
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

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    })
  }

  const handleSave = (publish: boolean) => {
    if (!formData.title || !formData.content) {
      alert('A cím és a tartalom kötelező!')
      return
    }

    saveMutation.mutate({
      ...formData,
      is_published: publish,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-playfair text-4xl font-bold text-navy-500">
            Új blogbejegyzés
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => handleSave(false)}
            variant="outline"
            disabled={saveMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Mentés piszkozatként
          </Button>
          <Button
            onClick={() => handleSave(true)}
            variant="secondary"
            disabled={saveMutation.isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            Publikálás
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tartalom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Cím *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Add meg a bejegyzés címét"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-slug-automatikusan-general"
                />
                <p className="text-xs text-navy-400">
                  Ez lesz az URL: /blog/{formData.slug || 'url-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Tartalom *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                  placeholder="Kezdj el írni egy izgalmas történetet Párizsról..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kategória</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategória</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Válassz kategóriát...</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kivonat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Rövid leírás</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={4}
                  placeholder="1-2 mondatos összefoglaló..."
                />
                <p className="text-xs text-navy-400">
                  Ez jelenik meg a bloglistán és a közösségi médiában
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Borítókép</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image">Kép URL</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) =>
                    setFormData({ ...formData, cover_image: e.target.value })
                  }
                  placeholder="https://..."
                />
                <p className="text-xs text-navy-400">
                  Töltsd fel a képet a Képek menüben, majd másold be az URL-t
                </p>
              </div>
              {formData.cover_image && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.cover_image}
                    alt="Előnézet"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
