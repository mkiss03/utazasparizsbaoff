'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Loader2, ShoppingCart } from 'lucide-react'
import type { Order } from '@/lib/types/database'

export default function VendorOrdersClient() {
  const { userId } = useUserRole()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<(Order & { bundle_title?: string })[]>([])

  useEffect(() => {
    if (!userId) return
    const fetchOrders = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*, bundles(title)')
        .eq('vendor_id', userId)
        .order('created_at', { ascending: false })

      if (data) {
        setOrders(
          data.map((o: any) => ({
            ...o,
            bundle_title: o.bundles?.title,
          }))
        )
      }
      setLoading(false)
    }
    fetchOrders()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Rendelések</h1>
      <p className="mt-1 text-sm text-slate-500 mb-6">{orders.length} rendelés</p>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Még nincs rendelésed.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {order.order_number}
                </p>
                <p className="text-xs text-slate-400">
                  {order.bundle_title || 'N/A'} — {new Date(order.created_at).toLocaleDateString('hu-HU')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  €{Number(order.vendor_amount).toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">
                  Jutalék: €{Number(order.commission_amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
