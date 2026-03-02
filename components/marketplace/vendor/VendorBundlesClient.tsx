'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import Link from 'next/link'
import { Loader2, Plus, Package, ChevronRight, Send } from 'lucide-react'
import type { Bundle, BundleStatus } from '@/lib/types/database'

const statusStyles: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  submitted_for_review: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  published: 'bg-blue-50 text-blue-700',
}
const statusLabels: Record<string, string> = {
  draft: 'Piszkozat',
  submitted_for_review: 'Elbírálás alatt',
  approved: 'Jóváhagyva',
  rejected: 'Elutasítva',
  published: 'Publikálva',
}

export default function VendorBundlesClient() {
  const { userId } = useUserRole()
  const [loading, setLoading] = useState(true)
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('bundles')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (data) setBundles(data as Bundle[])
      setLoading(false)
    }
    fetch()
  }, [userId])

  const handleSubmitForReview = async (bundleId: string) => {
    setSubmitting(bundleId)
    const supabase = createClient()
    const { error } = await supabase
      .from('bundles')
      .update({
        status: 'submitted_for_review' as BundleStatus,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', bundleId)

    if (!error) {
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId
            ? { ...b, status: 'submitted_for_review' as BundleStatus, submitted_at: new Date().toISOString() }
            : b
        )
      )
      // Update onboarding step to 4
      await supabase
        .from('profiles')
        .update({ onboarding_step: 4 })
        .eq('id', userId!)
    }
    setSubmitting(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Csomagjaim</h1>
          <p className="mt-1 text-sm text-slate-500">{bundles.length} csomag</p>
        </div>
        <Link
          href="/marketplace/vendor/bundles/new"
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Új csomag
        </Link>
      </div>

      {bundles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Még nincs csomagod.</p>
          <Link
            href="/marketplace/vendor/bundles/new"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Hozd létre az elsőt <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/marketplace/vendor/bundles/${bundle.id}/edit`}
                    className="text-sm font-semibold text-slate-800 hover:text-slate-600 truncate"
                  >
                    {bundle.title}
                  </Link>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${statusStyles[bundle.status] || statusStyles.draft}`}>
                    {statusLabels[bundle.status] || bundle.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {bundle.city} — {bundle.total_cards} kártya
                </p>
                {bundle.status === 'rejected' && bundle.rejection_reason && (
                  <p className="mt-1 text-xs text-red-500">
                    Elutasítás oka: {bundle.rejection_reason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {bundle.status === 'draft' && bundle.total_cards >= 5 && (
                  <button
                    onClick={() => handleSubmitForReview(bundle.id)}
                    disabled={submitting === bundle.id}
                    className="flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-60 transition-colors"
                  >
                    {submitting === bundle.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                    Benyújtás
                  </button>
                )}
                <Link
                  href={`/marketplace/vendor/bundles/${bundle.id}/cards`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Kártyák
                </Link>
                <Link
                  href={`/marketplace/vendor/bundles/${bundle.id}/edit`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Szerkesztés
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
