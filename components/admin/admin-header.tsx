'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Home, Menu } from 'lucide-react'
import Image from 'next/image'

interface Props {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-champagne-300 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Menü megnyitása"
            className="rounded-lg p-2 text-navy-500 hover:bg-champagne-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative h-9 w-9 flex-shrink-0 sm:h-10 sm:w-10">
            <Image
              src="/images/logofix-removebg-preview2.png"
              alt="Utazás Párizsba"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="truncate font-playfair text-base font-bold text-navy-500 sm:text-2xl">
            <span className="hidden sm:inline">Utazás </span>
            <span className="text-gold-400">Párizsba</span> Admin
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/" title="Vissza a főoldalra">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Főoldal</span>
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Kijelentkezés</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
