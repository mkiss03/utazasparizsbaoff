'use client'

import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Trash2, ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import type { GalleryImage } from '@/lib/types/database'

const MAX_PHOTOS = 20
const MAX_FILE_SIZE_MB = 2
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const BUCKET = 'gallery'

export default function GalleryPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order')
      return (data as GalleryImage[]) ?? []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      // Remove from storage
      const pathInBucket = image.image_url.split(`/storage/v1/object/public/${BUCKET}/`)[1]
      if (pathInBucket) {
        await supabase.storage.from(BUCKET).remove([pathInBucket])
      }
      // Remove from DB
      const { error } = await supabase.from('gallery').delete().eq('id', image.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  })

  const uploadFiles = async (files: FileList | File[]) => {
    setUploadError(null)
    setUploadSuccess(false)
    const fileArray = Array.from(files)
    const currentCount = images?.length ?? 0

    // Validations
    for (const file of fileArray) {
      if (!ACCEPTED.includes(file.type)) {
        setUploadError(`"${file.name}" — csak JPG, PNG vagy WebP fájl engedélyezett`)
        return
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`"${file.name}" — maximum ${MAX_FILE_SIZE_MB}MB engedélyezett (ez: ${(file.size / 1024 / 1024).toFixed(1)}MB)`)
        return
      }
    }

    if (currentCount + fileArray.length > MAX_PHOTOS) {
      setUploadError(`Legfeljebb ${MAX_PHOTOS} fotó töltható fel. Jelenleg: ${currentCount}, feltölteni kívánt: ${fileArray.length}`)
      return
    }

    setUploading(true)
    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filename = `${Date.now()}_${i}.${ext}`

        const { error: storageError } = await supabase.storage
          .from(BUCKET)
          .upload(filename, file, { cacheControl: '3600', upsert: false })

        if (storageError) {
          setUploadError(`Feltöltési hiba: ${storageError.message}`)
          setUploading(false)
          return
        }

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)
        const { error: dbError } = await supabase.from('gallery').insert({
          image_url: urlData.publicUrl,
          caption: '',
          alt_text: `Párizsi pillanat`,
          display_order: (currentCount + i + 1) * 10,
        })

        if (dbError) {
          setUploadError(`Adatbázis hiba: ${dbError.message}`)
          setUploading(false)
          return
        }
      }
      setUploadSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err) {
      setUploadError('Ismeretlen hiba történt')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files)
  }

  const count = images?.length ?? 0
  const canUpload = count < MAX_PHOTOS

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-navy-500">Képgaléria</h1>
          <p className="mt-1 text-sm text-slate-500">
            Maximum {MAX_PHOTOS} fotó, max {MAX_FILE_SIZE_MB}MB/kép — JPG, PNG, WebP
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`rounded-full px-4 py-1.5 text-sm font-semibold ${count >= MAX_PHOTOS ? 'bg-red-100 text-red-600' : count >= MAX_PHOTOS * 0.8 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {count} / {MAX_PHOTOS} kép
          </div>
          {canUpload && (
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Feltöltés...' : 'Kép feltöltése'}
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {/* Status messages */}
      {uploadError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Feltöltési hiba</p>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <p className="font-semibold text-green-700">Sikeresen feltöltve!</p>
        </div>
      )}

      {/* Drop zone */}
      {canUpload && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? 'border-champagne-500 bg-champagne-100' : 'border-champagne-300 bg-champagne-50 hover:border-champagne-400'}`}
        >
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-champagne-400" />
          <p className="font-semibold text-slate-600">
            {uploading ? 'Feltöltés folyamatban...' : 'Kattints vagy húzd ide a képeket'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Max {MAX_FILE_SIZE_MB}MB/kép · JPG, PNG, WebP · Maradék: {MAX_PHOTOS - count} hely
          </p>
        </div>
      )}

      {count >= MAX_PHOTOS && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Elérted a {MAX_PHOTOS} képes limitet. Törölj fotókat, hogy újakat tölthess fel.
          </p>
        </div>
      )}

      {/* Gallery grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1,2,3,4].map((i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden">
              <div className="relative aspect-square bg-champagne-100">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <button
                    onClick={() => { if (window.confirm('Biztosan törli ezt a képet?')) deleteMutation.mutate(image) }}
                    className="scale-0 rounded-full bg-red-500 p-2 text-white transition-transform group-hover:scale-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="truncate text-xs text-slate-400">{image.caption || 'Nincs leírás'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>Még nincs feltöltött kép</p>
        </div>
      )}
    </div>
  )
}
