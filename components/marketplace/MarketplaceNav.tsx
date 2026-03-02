'use client'

import Link from 'next/link'
import { Store, LogIn, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useUserRole } from '@/lib/hooks/useUserRole'

export default function MarketplaceNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role, userId, isVendor, isSuperAdmin } = useUserRole()
  const isLoggedIn = !!userId

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + title */}
          <Link href="/marketplace" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-800">
              Piactér
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/marketplace" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Böngészés
            </Link>
            {(isVendor || isSuperAdmin) && isLoggedIn && (
              <Link
                href="/marketplace/vendor/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <>
                <Link
                  href="/marketplace/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Bejelentkezés
                </Link>
                <Link
                  href="/marketplace/vendor/register"
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Eladó regisztráció
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Link
                href="/"
                target="_blank"
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Vissza a főoldalra
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden space-y-3">
          <Link
            href="/marketplace"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-slate-600"
          >
            Böngészés
          </Link>
          {(isVendor || isSuperAdmin) && isLoggedIn && (
            <Link
              href="/marketplace/vendor/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-600"
            >
              Dashboard
            </Link>
          )}
          {!isLoggedIn && (
            <>
              <Link
                href="/marketplace/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-600"
              >
                Bejelentkezés
              </Link>
              <Link
                href="/marketplace/vendor/register"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-800"
              >
                Eladó regisztráció
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
