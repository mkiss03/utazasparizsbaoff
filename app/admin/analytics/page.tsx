'use client'

import { useState, useEffect } from 'react'

const POSTHOG_DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL || ''
const POSTHOG_PROJECT_URL = 'https://eu.posthog.com'

export default function AnalyticsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analitika</h1>
          <p className="text-sm text-slate-500 mt-1">
            PostHog valós idejű elemzések
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={POSTHOG_PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            PostHog megnyitása
          </a>
          <div className="text-sm text-slate-400">
            {currentTime.toLocaleDateString('hu-HU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            {currentTime.toLocaleTimeString('hu-HU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {POSTHOG_DASHBOARD_URL ? (
        /* Embedded PostHog Dashboard */
        <iframe
          src={POSTHOG_DASHBOARD_URL}
          className="w-full h-[85vh] border-0 rounded-xl shadow-sm"
          title="PostHog Dashboard"
          allow="clipboard-write"
          loading="lazy"
        />
      ) : (
        /* Setup instructions when no shared dashboard is configured */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                PostHog Dashboard Beágyazása
              </h2>
              <p className="text-slate-600">
                A PostHog dashboard beágyazásához hozz létre egy megosztott dashboard-ot a PostHog-ban.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 text-left space-y-4">
              <h3 className="font-medium text-slate-900">Lépések:</h3>
              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Nyisd meg a <a href={POSTHOG_PROJECT_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PostHog dashboard-ot</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Menj a <strong>Dashboards</strong> menüpontra és válassz vagy hozz létre egy dashboard-ot</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Kattints a <strong>Share / Export</strong> gombra (jobb felül)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Kapcsold be a <strong>&quot;Share as embedded iframe&quot;</strong> opciót</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <span>Másold ki a kapott URL-t</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                  <span>A Vercel-en add hozzá: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_POSTHOG_DASHBOARD_URL</code> = a kimásolt URL</span>
                </li>
              </ol>
            </div>

            <a
              href={POSTHOG_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Megnyitás PostHog-ban
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
