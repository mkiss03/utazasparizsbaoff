'use client'

import Link from 'next/link'
import { BoatTourSettings } from '@/lib/types/landing-page'
import ToggleField from '../fields/ToggleField'
import { ExternalLink } from 'lucide-react'

interface BoatTourEditorProps {
  settings: BoatTourSettings
  onChange: (updates: Partial<BoatTourSettings>) => void
}

export default function BoatTourEditor({ settings, onChange }: BoatTourEditorProps) {
  return (
    <div className="space-y-4">
      <ToggleField
        label="Szekció megjelenítése"
        checked={settings.visible}
        onChange={(checked) => onChange({ visible: checked })}
      />

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          A hajózás varázsló tartalma (lépések, árazás, stílus) a dedikált admin oldalon szerkeszthető.
        </p>
        <Link
          href="/admin/cruise-wizard"
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-3 w-3" />
          Hajózás Varázsló szerkesztése
        </Link>
      </div>
    </div>
  )
}
