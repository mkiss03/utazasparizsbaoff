'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, XCircle, Package, AlertCircle, Eye } from 'lucide-react'
import type { Bundle, BundleStatus } from '@/lib/types/database'

interface BundleWithVendor extends Bundle {
  vendor_name?: string
  card_count?: number
}

export default function BundleApprovalsClient() {
  const [loading, setLoading] = useState(true)
  const [bundles, setBundles] = useState<BundleWithVendor[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBundles = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('bundles')
        .select('*, profiles(vendor_display_name)')
        .in('status', ['submitted_for_review', 'approved', 'rejected'])
        .order('submitted_at', { ascending: false })

      if (data) {
        setBundles(
          data.map((b: any) => ({
            ...b,
            vendor_name: b.profiles?.vendor_display_name || 'Névtelen',
          }))
        )
      }
      setLoading(false)
    }
    fetchBundles()
  }, [])

  const handleApprove = async (bundleId: string) => {
    setActionLoading(bundleId)
    const supabase = createClient()
    const { error } = await supabase
      .from('bundles')
      .update({
        status: 'approved' as BundleStatus,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq('id', bundleId)

    if (!error) {
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId
            ? { ...b, status: 'approved' as BundleStatus, approved_at: new Date().toISOString(), rejection_reason: undefined }
            : b
        )
      )
    }
    setActionLoading(null)
  }

  const handlePublish = async (bundleId: string) => {
    setActionLoading(bundleId)
    const supabase = createClient()
    const { error } = await supabase
      .from('bundles')
      .update({
        status: 'published' as BundleStatus,
        is_published: true,
      })
      .eq('id', bundleId)

    if (!error) {
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId ? { ...b, status: 'published' as BundleStatus, is_published: true } : b
        )
      )
    }
    setActionLoading(null)
  }

  const handleReject = async (bundleId: string) => {
    if (!rejectionReason.trim()) return
    setActionLoading(bundleId)
    const supabase = createClient()
    const { error } = await supabase
      .from('bundles')
      .update({
        status: 'rejected' as BundleStatus,
        rejection_reason: rejectionReason,
      })
      .eq('id', bundleId)

    if (!error) {
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId
            ? { ...b, status: 'rejected' as BundleStatus, rejection_reason: rejectionReason }
            : b
        )
      )
      setRejectingId(null)
      setRejectionReason('')
    }
    setActionLoading(null)
  }

  const statusStyles: Record<string, string> = {
    submitted_for_review: 'bg-amber-50 text-amber-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    published: 'bg-blue-50 text-blue-700',
  }
  const statusLabels: Record<string, string> = {
    submitted_for_review: 'Elbírálás alatt',
    approved: 'Jóváhagyva',
    rejected: 'Elutasítva',
    published: 'Publikálva',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const pendingCount = bundles.filter((b) => b.status === 'submitted_for_review').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Csomag jóváhagyás</h1>
          <p className="mt-1 text-sm text-slate-500">{bundles.length} benyújtott csomag</p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
            {pendingCount} elbírálásra vár
          </span>
        )}
      </div>

      {bundles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Nincs benyújtott csomag.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{bundle.title}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[bundle.status] || ''}`}>
                      {statusLabels[bundle.status] || bundle.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {bundle.vendor_name} — {bundle.city} — {bundle.total_cards} kártya
                  </p>
                  {bundle.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{bundle.description}</p>
                  )}
                  {bundle.rejection_reason && bundle.status === 'rejected' && (
                    <div className="mt-2 flex items-start gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {bundle.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <a
                    href={`/admin/bundles/${bundle.id}/cards`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    Kártyák
                  </a>

                  {bundle.status === 'submitted_for_review' && (
                    <>
                      <button
                        onClick={() => handleApprove(bundle.id)}
                        disabled={actionLoading === bundle.id}
                        className="flex items-center gap-1 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-60 transition-colors"
                      >
                        {actionLoading === bundle.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Jóváhagyás
                      </button>
                      <button
                        onClick={() => setRejectingId(bundle.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-3 w-3" />
                        Elutasítás
                      </button>
                    </>
                  )}

                  {bundle.status === 'approved' && (
                    <button
                      onClick={() => handlePublish(bundle.id)}
                      disabled={actionLoading === bundle.id}
                      className="flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === bundle.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                      Publikálás
                    </button>
                  )}
                </div>
              </div>

              {/* Rejection dialog */}
              {rejectingId === bundle.id && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Elutasítás oka</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
                    placeholder="Írd le, miért utasítod el..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReject(bundle.id)}
                      disabled={!rejectionReason.trim() || actionLoading === bundle.id}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60 transition-colors"
                    >
                      Elutasítás véglegesítése
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null)
                        setRejectionReason('')
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Mégse
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
