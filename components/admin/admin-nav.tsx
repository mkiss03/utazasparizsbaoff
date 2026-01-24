'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  FileText,
  PenTool,
  Mail,
  Package,
  ShoppingCart,
  DollarSign,
  Tag
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

type NavItem = {
  title: string
  href?: string
  icon?: LucideIcon
  type: 'item' | 'section'
}

const enableFlashcards = process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS === 'true'

const allNavItems: NavItem[] = [
  {
    title: 'Áttekintés',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    type: 'item',
  },
  {
    title: 'TARTALOM',
    type: 'section',
  },
  {
    title: 'Szolgáltatások',
    href: '/admin/services',
    icon: MapPin,
    type: 'item',
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: PenTool,
    type: 'item',
  },
  {
    title: 'Blog Kategóriák',
    href: '/admin/blog/categories',
    icon: Tag,
    type: 'item',
  },
  {
    title: 'Tartalom',
    href: '/admin/content',
    icon: FileText,
    type: 'item',
  },
  {
    title: 'FLASHCARDS',
    type: 'section',
  },
  {
    title: 'Csomagok',
    href: '/admin/bundles',
    icon: Package,
    type: 'item',
  },
  {
    title: 'Városi Árazás',
    href: '/admin/pricing',
    icon: DollarSign,
    type: 'item',
  },
  {
    title: 'Rendelések',
    href: '/admin/orders',
    icon: ShoppingCart,
    type: 'item',
  },
  {
    title: 'MARKETING',
    type: 'section',
  },
  {
    title: 'Feliratkozók',
    href: '/admin/subscribers',
    icon: Mail,
    type: 'item',
  },
]

// Filter out flashcard-related items if feature is disabled
const navItems: NavItem[] = enableFlashcards
  ? allNavItems
  : allNavItems.filter(item => {
      // Remove FLASHCARDS section and all its items
      if (item.title === 'FLASHCARDS') return false
      if (item.title === 'Csomagok') return false
      if (item.title === 'Városi Árazás') return false
      if (item.title === 'Rendelések') return false
      return true
    })

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r border-slate-200 bg-white p-4">
      <ul className="space-y-2">
        {navItems.map((item, index) => {
          if (item.type === 'section') {
            return (
              <li key={`section-${index}`} className="mt-6 mb-2 px-4 first:mt-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.title}
                </span>
              </li>
            )
          }

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <Link
                href={item.href!}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-french-blue-500 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
