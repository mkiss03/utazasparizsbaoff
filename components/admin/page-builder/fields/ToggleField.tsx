'use client'

import { Eye, EyeOff } from 'lucide-react'

interface ToggleFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export default function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-3">
        {checked ? (
          <Eye className="h-4 w-4 text-green-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-slate-400" />
        )}
        <div>
          <p className="text-sm font-semibold text-navy-500">{label}</p>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  )
}
