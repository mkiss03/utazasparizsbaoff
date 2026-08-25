'use client'

import { useState } from 'react'
import { Music, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { convertAndUploadLouvreAudio } from '@/lib/actions/louvre-admin'

interface Props {
  src: string
  duration: number
  pathHint: string
  onChange: (src: string, duration: number) => void
}

export default function AudioUploadField({ src, duration, pathHint, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pathHint', pathHint || 'audio')

      const result = await convertAndUploadLouvreAudio(formData)
      if (!result.success) {
        setError(result.error)
        return
      }
      onChange(result.data.url, result.data.duration)
    } catch (err) {
      console.error(err)
      setError('Váratlan hiba történt a feltöltés közben.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-louvre-navy-700">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
          {uploading ? 'Konvertálás (WAV -> AAC)...' : src ? 'Hangfájl cseréje' : 'WAV feltöltése'}
          <input
            type="file"
            accept=".wav,audio/wav,audio/x-wav"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {src && !uploading && (
          <span className="flex items-center gap-1 text-xs text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {duration}s
          </span>
        )}
      </div>

      {src && <audio controls src={src} className="h-8 w-full" />}

      {error && (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {!src && !uploading && (
        <p className="text-xs text-slate-400">48 kHz, mono WAV ajánlott -- a szerver automatikusan AAC (.m4a) formátumra konvertálja.</p>
      )}
    </div>
  )
}
