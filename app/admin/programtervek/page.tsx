'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { listTripPlans } from '@/lib/actions/trip-plans'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import type { TripPlan } from '@/lib/planner/trip-plan-types'

export default function TripPlansListPage() {
  const [plans, setPlans] = useState<TripPlan[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTripPlans(mockDestinationId)
      .then((result) => {
        setPlans(result.plans)
        if (result.error) setError(result.error)
      })
      .catch((err) => {
        setPlans([])
        setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
      })
  }, [])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-parisian-grey-800">Programtervek</h1>
          <p className="mt-1 font-montserrat text-sm text-parisian-grey-500">
            Kézzel összeállított, napra bontott programterv egy adott foglaláshoz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/programtervek/kerdesek"
            className="rounded-full border-2 border-parisian-beige-300 px-5 py-2.5 font-montserrat text-sm font-semibold text-parisian-grey-700 hover:border-parisian-beige-400"
          >
            Kérdéssor szerkesztése
          </Link>
          <Link
            href="/admin/programtervek/utmutato"
            className="rounded-full border-2 border-parisian-beige-300 px-5 py-2.5 font-montserrat text-sm font-semibold text-parisian-grey-700 hover:border-parisian-beige-400"
          >
            Repülő + szállás útmutató
          </Link>
          <Link
            href="/admin/programtervek/new"
            className="flex items-center gap-2 rounded-full bg-parisian-beige-400 px-5 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-parisian-beige-500"
          >
            <Plus className="h-4 w-4" />
            Új programterv
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border-2 border-french-red-200 bg-french-red-50 px-4 py-3 font-montserrat text-sm text-french-red-600">
          {error}
        </div>
      )}

      {plans === null && <p className="font-montserrat text-sm text-parisian-grey-500">Betöltés...</p>}

      {plans && plans.length === 0 && !error && (
        <div className="rounded-2xl border-2 border-dashed border-parisian-beige-300 p-10 text-center">
          <p className="font-montserrat text-sm text-parisian-grey-500">
            Még nincs egy programterv sem -- kattints az "Új programterv" gombra az elsőhöz.
          </p>
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/admin/programtervek/${plan.id}`}
              className="flex items-center justify-between rounded-2xl border-2 border-parisian-beige-200 bg-white p-5 transition-colors hover:border-parisian-beige-400"
            >
              <div>
                <p className="font-montserrat text-base font-semibold text-parisian-grey-800">
                  {plan.isTemplate ? plan.templateTitle || 'Névtelen sablon' : plan.guestName || 'Névtelen vendég'}
                </p>
                <p className="mt-0.5 font-montserrat text-sm text-parisian-grey-500">
                  {plan.dateRangeLabel} · {plan.days.length} nap
                  {plan.accommodation ? ` · ${plan.accommodation}` : ''}
                  {plan.guestEmail ? ` · ${plan.guestEmail}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {plan.headcount && (
                  <span className="flex items-center gap-1 font-montserrat text-xs text-parisian-grey-400">
                    <Users className="h-3.5 w-3.5" />
                    {plan.headcount}
                  </span>
                )}
                {!plan.isTemplate && !plan.isPublished && plan.guestEmail && (
                  <span className="rounded-full bg-french-red-50 px-3 py-1 font-montserrat text-xs font-semibold text-french-red-600">
                    Új igénylés
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 font-montserrat text-xs font-semibold ${
                    plan.isTemplate ? 'bg-french-blue-50 text-french-blue-600' : 'bg-parisian-beige-100 text-parisian-grey-500'
                  }`}
                >
                  {plan.isTemplate ? 'Sablon' : 'Egyedi'}
                </span>
                <span
                  className={`rounded-full px-3 py-1 font-montserrat text-xs font-semibold ${
                    plan.isPublished
                      ? 'bg-green-50 text-green-700'
                      : 'bg-parisian-beige-100 text-parisian-grey-500'
                  }`}
                >
                  {plan.isPublished ? 'Közzétéve' : 'Vázlat'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
