import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Same-origin proxy a "louvre-media" Supabase Storage bucket elé.
 *
 * Ok: az admin szerkesztőben feltöltött hangokat/borítóképeket a
 * Supabase Storage szolgálja ki egy MÁSIK domainről (*.supabase.co).
 * A /louvre alá regisztrált Service Worker viszont szándékosan csak
 * saját-origin kéréseket kezel (lásd public/louvre-sw.js), ezért a
 * cross-origin Storage URL-eket sosem tudta volna offline kiszolgálni,
 * még ha a letöltés lépésben be is kerültek a Cache Storage-ba. Ez a
 * proxy mindent ugyanarra a domainre hoz, így a meglévő cache-first
 * logika módosítás nélkül, egységesen működik rájuk is.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const objectPath = path.join('/')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    return new NextResponse('Missing Supabase configuration', { status: 500 })
  }

  const upstreamUrl = `${supabaseUrl}/storage/v1/object/public/louvre-media/${objectPath}`

  let upstream: Response
  try {
    upstream = await fetch(upstreamUrl, { cache: 'no-store' })
  } catch (err) {
    console.error('Louvre media proxy fetch error:', err)
    return new NextResponse('Upstream unreachable', { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse('Not found', { status: upstream.status === 200 ? 404 : upstream.status })
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
      // A fájlnevek időbélyeggel egyediek (lásd convertAndUploadLouvreAudio),
      // ezért nyugodtan örökre cache-elhető.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
