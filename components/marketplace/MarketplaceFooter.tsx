'use client'

import { Store } from 'lucide-react'
import Link from 'next/link'

export default function MarketplaceFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-slate-500">
            <Store className="h-4 w-4" />
            <span className="text-sm">Piactér — Utazás Párizsba</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/marketplace" className="hover:text-slate-600 transition-colors">
              Csomagok
            </Link>
            <Link href="/marketplace/vendor/register" className="hover:text-slate-600 transition-colors">
              Eladónak lenni
            </Link>
            <Link href="/" target="_blank" className="hover:text-slate-600 transition-colors">
              Főoldal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
