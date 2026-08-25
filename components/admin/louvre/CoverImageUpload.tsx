'use client'

import { useState } from 'react'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value: string
  onChange: (url: string) => void
}

export default function CoverImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `covers/${fileName}`

      const { error } = await supabase.storage.from('louvre-media').upload(filePath, file)
      if (error) throw error

      const { data } = supabase.storage.from('louvre-media').getPublicUrl(filePath)
      onChange(data.publicUrl)
    } catch (err) {
      console.error('Cover image upload error:', err)
      alert('Nem sikerült feltölteni a borítóképet.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">Borítókép</label>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Borítókép" className="h-24 w-24 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-louvre-gold-500 hover:text-louvre-gold-700">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
          <span className="text-[10px]">{uploading ? 'Töltés...' : 'Feltöltés'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
              e.target.value = ''
            }}
          />
        </label>
      )}
    </div>
  )
}
