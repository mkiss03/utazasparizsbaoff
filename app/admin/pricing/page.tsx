'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react'
import type { CityPricing } from '@/lib/types/database'

export default function CityPricingPage() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { isSuperAdmin, isLoading: roleLoading } = useUserRole()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCity, setEditingCity] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    city: '',
    price: 25.00,
    duration_days: 7,
    currency: 'EUR',
    description: '',
    is_active: true,
  })

  // Fetch city pricing
  const { data: cityPricing, isLoading } = useQuery({
    queryKey: ['city-pricing'],
    queryFn: async () => {
      const { data } = await supabase
        .from('city_pricing')
        .select('*')
        .order('city', { ascending: true })
      return data as CityPricing[]
    },
    enabled: isSuperAdmin,
  })

  const deleteMutation = useMutation({
    mutationFn: async (city: string) => {
      const { error } = await supabase.from('city_pricing').delete().eq('city', city)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city-pricing'] })
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ city, is_active }: { city: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('city_pricing')
        .update({ is_active })
        .eq('city', city)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city-pricing'] })
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ originalCity, data }: { originalCity?: string; data: typeof formData }) => {
      if (originalCity && originalCity !== data.city) {
        // City name changed - need to delete old and insert new (PK constraint)
        const { error: deleteError } = await supabase
          .from('city_pricing')
          .delete()
          .eq('city', originalCity)
        if (deleteError) throw deleteError

        const { error: insertError } = await supabase
          .from('city_pricing')
          .insert(data)
        if (insertError) throw insertError
      } else if (originalCity) {
        // Update existing
        const { error } = await supabase
          .from('city_pricing')
          .update(data)
          .eq('city', originalCity)
        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('city_pricing')
          .insert(data)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city-pricing'] })
      setIsCreating(false)
      setEditingCity(null)
      resetForm()
    },
  })

  const resetForm = () => {
    setFormData({
      city: '',
      price: 25.00,
      duration_days: 7,
      currency: 'EUR',
      description: '',
      is_active: true,
    })
  }

  const handleEdit = (pricing: CityPricing) => {
    setEditingCity(pricing.city)
    setFormData({
      city: pricing.city,
      price: pricing.price,
      duration_days: pricing.duration_days,
      currency: pricing.currency,
      description: pricing.description || '',
      is_active: pricing.is_active,
    })
  }

  const handleSave = (originalCity?: string) => {
    saveMutation.mutate({ originalCity, data: formData })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingCity(null)
    resetForm()
  }

  // Authorization check
  if (roleLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <Card className="border-french-red-200">
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-bold text-french-red-500">Hozzáférés megtagadva</h2>
            <p className="mt-2 text-slate-600">
              Csak super adminok kezelhetik a városi árazást.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
            Városi Árazás
          </h1>
          <p className="mt-2 text-slate-600">
            Állítsd be az árakat és időtartamokat a városi hozzáférési csomagokhoz
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-french-red-500 hover:bg-french-red-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Új város hozzáadása
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingCity) && (
        <Card className="mb-6 border-french-blue-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-french-blue-500">
                {editingCity ? 'Árazás szerkesztése' : 'Új város árazása'}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSave(editingCity || undefined)}
                  disabled={saveMutation.isPending}
                  className="bg-french-red-500 hover:bg-french-red-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Mentés
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Mégse
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Város neve *
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Paris"
                  disabled={!!editingCity}
                />
                {editingCity && (
                  <p className="mt-1 text-xs text-slate-500">
                    A város nevét nem lehet módosítani meglévő bejegyzésnél
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Ár *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="25.00"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Időtartam (napok) *
                </label>
                <Input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 7 }))}
                  placeholder="7"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pénznem
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="HUF">HUF (Ft)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Leírás
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Teljes hozzáférés minden [Város] tartalomhoz 7 napig"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Aktív (látható a vásárlóknak)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* City Pricing Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : cityPricing && cityPricing.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Város
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Ár
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Időtartam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Leírás
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                      Státusz
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                      Műveletek
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {cityPricing.map((pricing) => (
                    <tr key={pricing.city} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-french-blue-500" />
                          <span className="font-semibold text-slate-900">
                            {pricing.city}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-semibold text-french-red-500">
                          {pricing.currency === 'EUR' && '€'}
                          {pricing.currency === 'USD' && '$'}
                          {pricing.currency === 'GBP' && '£'}
                          {pricing.currency === 'HUF' && 'Ft'}
                          {pricing.price ? pricing.price.toFixed(2) : '0.00'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {pricing.duration_days} nap
                      </td>
                      <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-600">
                        {pricing.description || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {pricing.is_active ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            Aktív
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                            Inaktív
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleActiveMutation.mutate({
                                city: pricing.city,
                                is_active: !pricing.is_active,
                              })
                            }
                          >
                            {pricing.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleEdit(pricing)}
                            className="bg-french-blue-500 hover:bg-french-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (
                                confirm(
                                  `Biztosan törli ${pricing.city} árazását? Ez megakadályozza a város vásárlását!`
                                )
                              ) {
                                deleteMutation.mutate(pricing.city)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-500">
              Még nincs városi árazás
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Adj hozzá egy várost és állítsd be az árát!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
