'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, Headphones, CheckCircle2, Sparkles, Calendar, PenTool, ArrowRight } from 'lucide-react'

interface Lead {
  id: string
  email: string
  source: string
  created_at: string
}

interface EventRow {
  event_type: string
  client_id: string
}

export default function LouvreAdminPage() {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setIsLoading(true)
    const [leadsRes, eventsRes] = await Promise.all([
      supabase.from('louvre_leads').select('*').order('created_at', { ascending: false }),
      supabase.from('louvre_events').select('event_type, client_id'),
    ])
    setLeads((leadsRes.data as Lead[]) || [])
    setEvents((eventsRes.data as EventRow[]) || [])
    setIsLoading(false)
  }

  const uniqueClients = (type: string) => new Set(events.filter((e) => e.event_type === type).map((e) => e.client_id)).size
  const started = uniqueClients('tour_started')
  const completed = uniqueClients('tour_completed')
  const bonusUnlocked = uniqueClients('bonus_unlocked')

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Louvre Audio Túra</h1>
          <p className="mt-2 text-slate-600">
            Fázis 1 -- ingyenes 3 állomásos mini túra piacmérés. A voucher/Stripe alapú fizetős
            verzió még hátravan, de a tartalom mostantól a Túra szerkesztőben kódolás nélkül
            karbantartható.
          </p>
        </div>
        <Link
          href="/admin/louvre/editor"
          className="flex items-center gap-2 rounded-full bg-louvre-navy-700 px-5 py-3 text-sm font-semibold text-white hover:bg-louvre-navy-500"
        >
          <PenTool className="h-4 w-4" />
          Túra szerkesztő megnyitása
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <StatCard icon={<Mail className="h-10 w-10 text-french-blue-200" />} label="Feliratkozók" value={leads.length} />
        <StatCard icon={<Headphones className="h-10 w-10 text-french-blue-200" />} label="Túrát elkezdte" value={started} />
        <StatCard icon={<CheckCircle2 className="h-10 w-10 text-green-200" />} label="Mind a 3 állomást teljesítette" value={completed} />
        <StatCard icon={<Sparkles className="h-10 w-10 text-amber-200" />} label="Bónuszsávot feloldotta" value={bonusUnlocked} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feliratkozók ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="py-8 text-center text-slate-500">Még nincs feliratkozó.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Forrás</th>
                    <th className="px-3 py-2">
                      <Calendar className="inline h-3.5 w-3.5" /> Dátum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-800">{lead.email}</td>
                      <td className="px-3 py-2 text-slate-500">{lead.source}</td>
                      <td className="px-3 py-2 text-slate-500">{formatDate(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-bold text-french-blue-500">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
