'use client'

import { MapPointEditor } from '@/components/admin/MapPointEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminMapPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-parisian-grey-800">Térkép Szerkesztés</h1>
        <p className="mt-2 text-parisian-grey-600">
          Kezeld a metrótérkép interaktív pontjait. Az új pontok azonnal megjelennek a honlapon.
        </p>
      </div>

      {/* Map Editor Card */}
      <Card className="border-parisian-beige-200">
        <CardHeader>
          <CardTitle className="text-parisian-grey-800">Térkép Pontok</CardTitle>
        </CardHeader>
        <CardContent>
          <MapPointEditor />
        </CardContent>
      </Card>
    </div>
  )
}
