'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Image, FileText, Euro } from 'lucide-react'
import type { Tour } from '@/lib/types/database'

export default function DashboardPage() {
  const supabase = createClient()

  const { data: tours } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .order('display_order')
      return data as Tour[]
    },
  })

  const { data: gallery } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order')
      return data
    },
  })

  const stats = [
    {
      title: 'Összes túra',
      value: tours?.length || 0,
      icon: MapPin,
      color: 'text-navy-500',
      bg: 'bg-navy-50',
    },
    {
      title: 'Kiemelt túrák',
      value: tours?.filter((t) => t.is_featured).length || 0,
      icon: Euro,
      color: 'text-gold-600',
      bg: 'bg-gold-50',
    },
    {
      title: 'Galéria képek',
      value: gallery?.length || 0,
      icon: Image,
      color: 'text-burgundy-500',
      bg: 'bg-burgundy-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Üdvözöljük az Admin felületen!
        </h1>
        <p className="mt-2 text-navy-400">
          Itt kezelheti a túrákat, tartalmat és képeket.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-navy-400">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-navy-500">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gyors műveletek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/admin/tours"
              className="flex items-center gap-3 rounded-lg border-2 border-champagne-300 p-4 transition-all hover:border-gold-400 hover:bg-gold-50"
            >
              <MapPin className="h-6 w-6 text-gold-500" />
              <div>
                <h3 className="font-semibold text-navy-500">Túrák kezelése</h3>
                <p className="text-sm text-navy-400">
                  Túrák hozzáadása, szerkesztése
                </p>
              </div>
            </a>
            <a
              href="/admin/content"
              className="flex items-center gap-3 rounded-lg border-2 border-champagne-300 p-4 transition-all hover:border-gold-400 hover:bg-gold-50"
            >
              <FileText className="h-6 w-6 text-gold-500" />
              <div>
                <h3 className="font-semibold text-navy-500">
                  Tartalom szerkesztése
                </h3>
                <p className="text-sm text-navy-400">
                  Hero, Rólam szekció frissítése
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
