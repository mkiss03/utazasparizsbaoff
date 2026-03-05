'use client'

import Link from 'next/link'
import { WalkingToursSettings } from '@/lib/types/landing-page'
import ToggleField from '../fields/ToggleField'
import { ExternalLink } from 'lucide-react'

interface WalkingToursEditorProps {
  settings: WalkingToursSettings
  onChange: (updates: Partial<WalkingToursSettings>) => void
}

export default function WalkingToursEditor({ settings, onChange }: WalkingToursEditorProps) {
  return (
    <div className="space-y-4">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          A sétatúrák tartalma (túrák, naptár, beállítások) a dedikált admin oldalon szerkeszthető.
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          <Link
            href="/admin/walking-tours"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-3 w-3" />
            Sétatúrák kezelése
          </Link>
          <Link
            href="/admin/walking-tours/calendar-settings"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-3 w-3" />
            Naptár beállítások
          </Link>
        </div>
      </div>
    </div>
  )
}
