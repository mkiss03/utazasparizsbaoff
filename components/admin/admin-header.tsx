'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Home } from 'lucide-react'
import Image from 'next/image'

export function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-champagne-300 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/images/logofix-removebg-preview.png"
              alt="Utazás Párizsba"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-navy-500">
            Utazás <span className="text-gold-400">Párizsba</span> Admin
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" title="Vissza a főoldalra">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Főoldal
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Kijelentkezés
          </Button>
        </div>
      </div>
    </header>
  )
}
