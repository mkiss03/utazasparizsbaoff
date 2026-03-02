'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, XCircle, Clock, Users, AlertCircle } from 'lucide-react'
import type { VendorProfile } from '@/lib/types/database'

type TabFilter = 'pending' | 'approved' | 'rejected' | 'all'

export default function VendorsManagementClient() {
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [tab, setTab] = useState<TabFilter>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchVendors = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'vendor')
        .order('vendor_applied_at', { ascending: false })

      if (data) setVendors(data as unknown as VendorProfile[])
      setLoading(false)
    }
    fetchVendors()
  }, [])

  const handleApprove = async (vendorId: string) => {
    setActionLoading(vendorId)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        is_approved: true,
        vendor_approved_at: new Date().toISOString(),
        vendor_rejection_reason: null,
        onboarding_step: 1, // Move to profile completion step
      })
      .eq('id', vendorId)

    if (!error) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, is_approved: true, vendor_approved_at: new Date().toISOString(), vendor_rejection_reason: undefined, onboarding_step: 1 as const }
            : v
        )
      )
    }
    setActionLoading(null)
  }

  const handleReject = async (vendorId: string) => {
    if (!rejectionReason.trim()) return
    setActionLoading(vendorId)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        is_approved: false,
        vendor_rejection_reason: rejectionReason,
      })
      .eq('id', vendorId)

    if (!error) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, is_approved: false, vendor_rejection_reason: rejectionReason }
            : v
        )
      )
      setRejectingId(null)
      setRejectionReason('')
    }
    setActionLoading(null)
  }

  const handleCommissionChange = async (vendorId: string, rate: number) => {
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ commission_rate: rate })
      .eq('id', vendorId)

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, commission_rate: rate } : v))
    )
  }

  const filteredVendors = vendors.filter((v) => {
    if (tab === 'pending') return !v.is_approved && !v.vendor_rejection_reason
    if (tab === 'approved') return v.is_approved
    if (tab === 'rejected') return !v.is_approved && !!v.vendor_rejection_reason
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const pendingCount = vendors.filter((v) => !v.is_approved && !v.vendor_rejection_reason).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Eladók kezelése</h1>
          <p className="mt-1 text-sm text-slate-500">{vendors.length} eladó összesen</p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
            <Clock className="h-3 w-3" />
            {pendingCount} jóváhagyásra vár
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-lg bg-slate-100 p-1 w-fit">
        {[
          { key: 'pending' as TabFilter, label: 'Függőben' },
          { key: 'approved' as TabFilter, label: 'Jóváhagyott' },
          { key: 'rejected' as TabFilter, label: 'Elutasított' },
          { key: 'all' as TabFilter, label: 'Mind' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredVendors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Nincs eladó ebben a kategóriában.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {vendor.vendor_display_name || 'Névtelen'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {vendor.vendor_city || '—'} — Jelentkezve: {vendor.vendor_applied_at ? new Date(vendor.vendor_applied_at).toLocaleDateString('hu-HU') : '—'}
                  </p>
                  {vendor.vendor_bio && (
                    <p className="text-xs text-slate-500 mt-2">{vendor.vendor_bio}</p>
                  )}
                  {vendor.vendor_application_text && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      &ldquo;{vendor.vendor_application_text}&rdquo;
                    </p>
                  )}
                  {vendor.vendor_rejection_reason && !vendor.is_approved && (
                    <div className="mt-2 flex items-start gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {vendor.vendor_rejection_reason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {/* Commission rate */}
                  {vendor.is_approved && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Jutalék:</span>
                      <select
                        value={vendor.commission_rate}
                        onChange={(e) => handleCommissionChange(vendor.id, Number(e.target.value))}
                        className="rounded border border-slate-200 px-1.5 py-0.5 text-xs"
                      >
                        {[5, 10, 15, 20, 25, 30].map((r) => (
                          <option key={r} value={r}>{r}%</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!vendor.is_approved && !vendor.vendor_rejection_reason && (
                    <>
                      <button
                        onClick={() => handleApprove(vendor.id)}
                        disabled={actionLoading === vendor.id}
                        className="flex items-center gap-1 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-60 transition-colors"
                      >
                        {actionLoading === vendor.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Jóváhagyás
                      </button>
                      <button
                        onClick={() => setRejectingId(vendor.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-3 w-3" />
                        Elutasítás
                      </button>
                    </>
                  )}

                  {vendor.is_approved && (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Aktív
                    </span>
                  )}
                </div>
              </div>

              {/* Rejection dialog */}
              {rejectingId === vendor.id && (
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
                      onClick={() => handleReject(vendor.id)}
                      disabled={!rejectionReason.trim() || actionLoading === vendor.id}
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
