'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  id?: string
}

export default function TextField({ label, value, onChange, placeholder, description, id }: TextFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  )
}
