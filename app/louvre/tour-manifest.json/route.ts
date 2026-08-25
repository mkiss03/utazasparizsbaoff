import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TourManifest } from '@/lib/louvre/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('louvre_manifest_versions')
    .select('version, title, data')
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Nincs publikált Louvre túra manifest.' },
      { status: 503 }
    )
  }

  const manifest: TourManifest = {
    version: data.version,
    title: data.title,
    ...(data.data as Omit<TourManifest, 'version' | 'title'>),
  }

  return NextResponse.json(manifest, {
    headers: {
      // A kliens (offline-manager / Service Worker) mindig friss verziót kér
      // le, hogy időben észlelje az admin által publikált frissítést.
      'Cache-Control': 'no-store',
    },
  })
}
