import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ExperienceSuccessPage() {
  return (
    <>
      <NavigationWrapper />
      <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-32 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-[#1F2937] mb-3">
            Köszönjük a foglalást!
          </h1>
          <p className="text-slate-500 mb-6 leading-relaxed">
            A fizetés sikeresen megtörtént. Hamarosan felvesszük Önnel a kapcsolatot az időpont egyeztetése érdekében.
          </p>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-8 flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#C4A882] flex-shrink-0" />
            <p className="text-sm text-slate-600 text-left">
              Visszaigazoló emailt küldtünk a megadott email-címre. Kérjük, ellenőrizze levelesládáját (és a spam mappát).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/elmenyek"
              className="bg-[#1F2937] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#374151] transition-colors"
            >
              Vissza az élményekhez
            </Link>
            <Link
              href="/"
              className="border border-slate-200 text-slate-600 font-semibold px-6 py-3 rounded-full hover:bg-slate-50 transition-colors"
            >
              Főoldal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
