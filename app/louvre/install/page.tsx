import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import InstallInstructions from '@/components/louvre/InstallInstructions'

export default function LouvreInstallPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/louvre" className="mb-6 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-louvre-navy-700">
          <ArrowLeft className="h-4 w-4" />
          Vissza
        </Link>
        <h1 className="mb-6 font-playfair text-2xl font-bold text-louvre-navy-700">
          Telepítési útmutató
        </h1>
        <InstallInstructions variant="inline" />
      </div>
    </main>
  )
}
