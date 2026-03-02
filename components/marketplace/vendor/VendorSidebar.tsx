'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, User } from 'lucide-react'

const vendorNavItems = [
  { name: 'Dashboard', href: '/marketplace/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Csomagjaim', href: '/marketplace/vendor/bundles', icon: Package },
  { name: 'Rendelések', href: '/marketplace/vendor/orders', icon: ShoppingCart },
  { name: 'Profil', href: '/marketplace/vendor/profile', icon: User },
]

export default function VendorSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 border-r border-slate-200 bg-white">
      <nav className="p-4 space-y-1">
        {vendorNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
