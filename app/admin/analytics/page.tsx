'use client'

import { useState, useEffect } from 'react'

const POSTHOG_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL ||
  'https://eu.posthog.com/shared_dashboard/phc_WAvtcYyssmgrZfDSgraIuvNTsQoTV3wFxrDe73MQMTm'

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

      {/* PostHog Embedded Dashboard */}
      <iframe
        src={POSTHOG_DASHBOARD_URL}
        className="w-full h-[85vh] border-0 rounded-xl shadow-sm"
        title="PostHog Dashboard"
        allow="clipboard-write"
        loading="lazy"
      />
    </div>
  )
}
