'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Trash2 } from 'lucide-react'
import type { GalleryImage } from '@/lib/types/database'

export default function GalleryPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order')
      return data as GalleryImage[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Képgaléria
        </h1>
        <Button variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Kép feltöltése
        </Button>
      </div>

      <div className="rounded-lg border-2 border-dashed border-champagne-400 bg-champagne-50 p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-champagne-500" />
        <h3 className="mt-4 font-semibold text-navy-500">
          Képfeltöltés hamarosan elérhető
        </h3>
        <p className="mt-2 text-sm text-navy-400">
          A képfeltöltés funkció fejlesztés alatt áll. Addig használja a Supabase Storage-ot.
        </p>
      </div>

      {images && images.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-square bg-champagne-100">
                {image.image_url && (
                  <img
                    src={image.image_url}
                    alt={image.alt_text || ''}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 text-sm text-navy-400">
                    {image.caption || 'Nincs leírás'}
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm('Biztosan törli ezt a képet?')) {
                        deleteMutation.mutate(image.id)
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
