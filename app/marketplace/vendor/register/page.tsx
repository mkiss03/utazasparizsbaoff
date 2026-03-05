import VendorRegistrationForm from '@/components/marketplace/VendorRegistrationForm'
import { Store } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Eladó regisztráció — Piactér',
}

export default function VendorRegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Eladó regisztráció</h1>
        <p className="mt-2 text-sm text-slate-500">
          Hozd létre eladói fiókodat és kezdj el kártyacsomagokat értékesíteni.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <VendorRegistrationForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Már van fiókod?{' '}
        <Link href="/marketplace/login" className="font-medium text-slate-700 hover:text-slate-900">
          Bejelentkezés
        </Link>
      </p>
    </div>
  )
}
