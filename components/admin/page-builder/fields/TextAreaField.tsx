'use client'

import { Label } from '@/components/ui/label'

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  rows?: number
  id?: string
}

export default function TextAreaField({ label, value, onChange, placeholder, description, rows = 3, id }: TextAreaFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="flex w-full rounded-lg border-2 border-champagne-400 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-navy-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  )
}
