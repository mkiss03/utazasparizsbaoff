'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { ArrowLeft, Save, Eye, EyeOff, FileText } from 'lucide-react'
import type { Post, BlogCategory, PostStatus } from '@/lib/types/database'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const supabase = createClient()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    status: 'draft' as PostStatus,
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

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()
      return data as Post
    },
  })

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image: post.cover_image || '',
        category_id: post.category_id || '',
        status: post.status || 'draft',
        is_published: post.is_published,
      })
    }
  }, [post])

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Post> & { status: PostStatus }) => {
      const isPublishing = data.status === 'published'
      const postData = {
        ...data,
        is_published: isPublishing,
        published_at:
          isPublishing && !post?.published_at
            ? new Date().toISOString()
            : post?.published_at,
      }

      const { error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      router.push('/admin/blog')
    },
  })

  const handleSaveDraft = () => {
    if (!formData.title || !formData.content) {
      alert('A cím és a tartalom kötelező!')
      return
    }

    updateMutation.mutate({
      ...formData,
      status: 'draft',
    })
  }

  const handlePublish = () => {
    if (!formData.title || !formData.content) {
      alert('A cím és a tartalom kötelező!')
      return
    }

    updateMutation.mutate({
      ...formData,
      status: 'published',
    })
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-playfair text-4xl font-bold text-navy-500">
            Bejegyzés szerkesztése
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            disabled={updateMutation.isPending}
          >
            <FileText className="mr-2 h-4 w-4" />
            Mentés piszkozatként
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-parisian-beige-400 hover:bg-parisian-beige-500"
            disabled={updateMutation.isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            Publikálás
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
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
                />
                <p className="text-xs text-navy-400">
                  URL: /blog/{formData.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Tartalom *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Részletek</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="excerpt">Kivonat</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={4}
                  placeholder="Rövid leírás a bejegyzésről..."
                />
                <p className="text-xs text-navy-400">
                  Jelenik meg a blog listában és a keresési találatokban
                </p>
              </div>

              <div className="rounded-lg border border-parisian-beige-200 bg-parisian-cream-50 p-4">
                <p className="text-sm font-semibold text-parisian-grey-800">
                  Státusz: {formData.status === 'published' ? (
                    <span className="text-green-600">Publikálva</span>
                  ) : (
                    <span className="text-orange-600">Piszkozat</span>
                  )}
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
                />
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
