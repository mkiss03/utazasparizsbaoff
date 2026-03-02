'use client'

import VendorSidebar from '@/components/marketplace/vendor/VendorSidebar'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Loader2 } from 'lucide-react'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { role, isLoading, isVendor, isSuperAdmin } = useUserRole()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!isVendor && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">Hozzáférés megtagadva</p>
          <p className="mt-1 text-sm text-slate-500">Ez az oldal csak eladók számára érhető el.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <VendorSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}
