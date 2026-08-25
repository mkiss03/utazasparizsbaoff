'use client'

import { useState } from 'react'
import { AdminHeader } from './admin-header'
import { AdminNav } from './admin-nav'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-champagne-50">
      <AdminHeader onMenuClick={() => setNavOpen((v) => !v)} />
      <div className="flex">
        <AdminNav open={navOpen} onNavigate={() => setNavOpen(false)} />
        {navOpen && (
          <button
            aria-label="Menü bezárása"
            onClick={() => setNavOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          />
        )}
        <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
