'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Upload, ImageIcon, Trash2, Loader2 } from 'lucide-react'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  maxSizeMB?: number
  description?: string
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  bucket = 'profile-images',
  folder = 'page-builder',
  maxSizeMB = 2,
  description,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`A kep merete maximum ${maxSizeMB}MB lehet`)
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) {
        alert('Hiba a kep feltoltesekor: ' + uploadError.message)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      onChange(publicUrl)
    } catch (err) {
      alert('Hiba tortent a feltoltes soran.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200">
          <img
            src={value}
            alt={label}
            className="h-32 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-slate-400 hover:bg-slate-100 transition-colors">
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-500">Kep feltoltese (max {maxSizeMB}MB)</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="vagy ird be a kep URL-jet"
        className="text-xs"
      />
    </div>
  )
}
