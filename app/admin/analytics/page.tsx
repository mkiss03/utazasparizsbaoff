'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  TrendingUp,
  ExternalLink,
  Eye,
  ShoppingCart,
  Globe,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

export default function AnalyticsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: 'Heti látogatók',
      value: '—',
      change: '',
      icon: Users,
      description: 'PostHog csatlakoztatás után elérhető',
    },
    {
      label: 'Oldalmegtekintések',
      value: '—',
      change: '',
      icon: Eye,
      description: 'PostHog csatlakoztatás után elérhető',
    },
    {
      label: 'Eladott jegyek',
      value: '—',
      change: '',
      icon: ShoppingCart,
      description: 'PostHog csatlakoztatás után elérhető',
    },
    {
      label: 'Átlagos munkamenet',
      value: '—',
      change: '',
      icon: Clock,
      description: 'PostHog csatlakoztatás után elérhető',
    },
  ]

  const topPages = [
    { path: '/', label: 'Főoldal' },
    { path: '/galeria', label: 'Galéria' },
    { path: '/blog', label: 'Blog' },
    { path: '/pricing', label: 'Árak' },
    { path: '/bundles', label: 'Csomagok' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analitika</h1>
          <p className="text-sm text-slate-500 mt-1">
            Valós idejű látogatottsági adatok
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

      {/* Live Visitors Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 p-6"
        style={{ backgroundColor: '#FAF7F2' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Jelenleg az oldalon
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-900">—</span>
              <span className="text-sm text-slate-400">aktív látogató</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/5">
            <Globe className="w-10 h-10 text-slate-400" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          A valós idejű adatok a PostHog csatlakoztatása után jelennek meg.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                {stat.change && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Legnépszerűbb oldalak</h2>
          </div>
          <div className="space-y-3">
            {topPages.map((page, idx) => (
              <div
                key={page.path}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5">
                    {idx + 1}.
                  </span>
                  <span className="text-sm text-slate-700">{page.label}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{page.path}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            A részletes adatok a PostHog dashboardon érhetők el.
          </p>
        </motion.div>

        {/* PostHog Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
          style={{ backgroundColor: '#FAF7F2' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-900">PostHog Dashboard</h2>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              A teljes analitikai eszköztár elérhető a PostHog felületen:
            </p>
            <ul className="text-sm text-slate-500 space-y-1.5 mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Valós idejű felhasználói munkamenetek
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Konverziós tölcsérek és útvonalak
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Session replay felvételek
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Heatmap elemzések
              </li>
            </ul>
          </div>
          <a
            href="https://eu.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Részletes PostHog Elemzés
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
