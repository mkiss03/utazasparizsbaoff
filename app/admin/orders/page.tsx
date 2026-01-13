'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, DollarSign, Package, User, Calendar } from 'lucide-react'
import type { Order } from '@/lib/types/database'

export default function OrdersPage() {
  const supabase = createClient()
  const { userId, isSuperAdmin, isVendor } = useUserRole()

  // Fetch orders based on role
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return []

      let query = supabase
        .from('orders')
        .select('*, bundles(title), profiles(email)')
        .order('created_at', { ascending: false })

      // Vendors only see their own orders
      if (isVendor) {
        query = query.eq('vendor_id', userId)
      }

      const { data } = await query
      return data as (Order & { bundles: { title: string }, profiles: { email: string } })[]
    },
    enabled: !!userId,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const totalRevenue = orders?.reduce((sum, order) => {
    if (isSuperAdmin) {
      return sum + Number(order.commission_amount)
    } else if (isVendor) {
      return sum + Number(order.vendor_amount)
    }
    return sum
  }, 0) || 0

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
          Rendelések
        </h1>
        <p className="mt-2 text-slate-600">
          {isSuperAdmin
            ? 'Összes rendelés megtekintése'
            : 'Saját csomagjaimhoz tartozó rendelések'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Összes rendelés</p>
                <p className="mt-2 text-3xl font-bold text-french-blue-500">
                  {orders?.length || 0}
                </p>
              </div>
              <ShoppingCart className="h-12 w-12 text-french-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  {isSuperAdmin ? 'Jutalék' : 'Bevétel'}
                </p>
                <p className="mt-2 text-3xl font-bold text-french-red-500">
                  €{totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-french-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Mai rendelések</p>
                <p className="mt-2 text-3xl font-bold text-slate-700">
                  {orders?.filter(o => {
                    const today = new Date().toDateString()
                    return new Date(o.created_at).toDateString() === today
                  }).length || 0}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-slate-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-french-blue-500">
                        #{order.order_number}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'completed' ? 'Teljesítve' :
                         order.status === 'pending' ? 'Függőben' : 'Visszatérítve'}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span>{order.bundles?.title || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{order.profiles?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span>€{Number(order.amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      {isSuperAdmin ? 'Jutalék' : 'Te kapsz'}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-french-blue-500">
                      €{(isSuperAdmin ? Number(order.commission_amount) : Number(order.vendor_amount)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">
              Még nincs rendelés
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              A rendelések itt jelennek majd meg
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
