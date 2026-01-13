'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, Eye, EyeOff, PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/types/database'

export default function BlogPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      return data as Post[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-navy-500">
            Blog Kezelése
          </h1>
          <p className="mt-2 text-navy-400">
            Írj és kezelj blogbejegyzéseket a weboldaladon
          </p>
        </div>
        <Button onClick={() => router.push('/admin/blog/new')} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Új bejegyzés
        </Button>
      </div>

      {posts && posts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <PenTool className="mx-auto h-12 w-12 text-champagne-500" />
            <h3 className="mt-4 font-semibold text-navy-500">
              Még nincs blogbejegyzés
            </h3>
            <p className="mt-2 text-sm text-navy-400">
              Kezdj el írni és oszd meg a párizsi élményeidet!
            </p>
            <Button
              onClick={() => router.push('/admin/blog/new')}
              variant="secondary"
              className="mt-4"
            >
              Első bejegyzés létrehozása
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                {post.cover_image && (
                  <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-bold text-navy-500">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1 text-sm text-navy-400">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-navy-400">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {post.status === 'published' ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Publikálva</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600">Piszkozat</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Biztosan törölni szeretné ezt a bejegyzést?'
                        )
                      ) {
                        deleteMutation.mutate(post.id)
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
