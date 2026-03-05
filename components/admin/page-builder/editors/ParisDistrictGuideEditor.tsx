'use client'

import Link from 'next/link'
import { ParisDistrictGuideSettings } from '@/lib/types/landing-page'
import ToggleField from '../fields/ToggleField'
import { ExternalLink } from 'lucide-react'

interface ParisDistrictGuideEditorProps {
  settings: ParisDistrictGuideSettings
  onChange: (updates: Partial<ParisDistrictGuideSettings>) => void
}

export default function ParisDistrictGuideEditor({ settings, onChange }: ParisDistrictGuideEditorProps) {
  return (
    <div className="space-y-4">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          A kerületi útmutató tartalma (kerületek, térkép, leírások) a dedikált admin oldalon szerkeszthető.
        </p>
        <Link
          href="/admin/paris-guide"
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-3 w-3" />
          Kerületi Útmutató szerkesztése
        </Link>
      </div>
    </div>
  )
}
