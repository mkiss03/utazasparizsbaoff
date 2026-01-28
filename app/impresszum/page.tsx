import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { FileText, Mail, Phone, Building2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Impresszum | Utazás Párizsba - Párizsi Idegenvezetés',
  description: 'Jogi információk és kapcsolati adatok - Utazás Párizsba, Szeidl Viktória hivatalos idegenvezető Párizsban',
}

export const dynamic = 'force-dynamic'

export default async function ImpresszumPage() {
  const supabase = await createClient()

  // Fetch profile data for email and phone
  const { data: profile } = await supabase.from('profile').select('contact_email, contact_phone').single()

  // Fetch static texts for footer
  const { data: staticTextsData } = await supabase.from('site_text_content').select('*')
  const staticTexts: Record<string, string> = {}
  staticTextsData?.forEach((item: any) => {
    staticTexts[item.key] = item.value || ''
  })

  const contactEmail = profile?.contact_email || 'utazasparizsba@gmail.com'
  const contactPhone = profile?.contact_phone || '+33 7 53 14 50 35'

  return (
    <main className="relative min-h-screen bg-parisian-cream-50">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-4 py-2 text-sm font-semibold text-parisian-grey-700">
              <FileText className="mr-1 inline h-4 w-4" />
              Jogi Információk
            </div>
            <h1 className="mb-4 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl">
              Impresszum
            </h1>
            <p className="text-lg text-parisian-grey-600">
              Hivatalos adatok és kapcsolati információk
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Service Provider */}
            <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Building2 className="h-6 w-6 text-parisian-beige-500" />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-parisian-grey-800">
                  Szolgáltató
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-semibold text-parisian-grey-800">Név:</h3>
                  <p className="text-parisian-grey-600">Szeidl Viktória</p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold text-parisian-grey-800">Tevékenység:</h3>
                  <p className="text-parisian-grey-600">
                    Hivatalos idegenvezető és programszervező Párizsban
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold text-parisian-grey-800">Nyilvántartási szám:</h3>
                  <p className="font-mono text-parisian-grey-600">250065</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-1 font-semibold text-parisian-grey-800">SIRET:</h3>
                    <p className="font-mono text-parisian-grey-600">94822714500018</p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-parisian-grey-800">SIREN:</h3>
                    <p className="font-mono text-parisian-grey-600">948 227 145</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parisian-beige-100">
                  <Mail className="h-6 w-6 text-parisian-beige-500" />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-parisian-grey-800">
                  Kapcsolat
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <h3 className="mb-1 font-semibold text-parisian-grey-800">E-mail:</h3>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-parisian-beige-600 hover:text-parisian-beige-700 transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <h3 className="mb-1 font-semibold text-parisian-grey-800">Telefon:</h3>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, '')}`}
                      className="text-parisian-beige-600 hover:text-parisian-beige-700 transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-parisian-beige-500" />
                  <div>
                    <h3 className="mb-1 font-semibold text-parisian-grey-800">Helyszín:</h3>
                    <p className="text-parisian-grey-600">Párizs, Franciaország</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg">
              <h2 className="mb-6 font-playfair text-2xl font-bold text-parisian-grey-800">
                Szolgáltatások
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-parisian-beige-200 bg-parisian-cream-50 p-4">
                  <h3 className="mb-2 font-semibold text-parisian-grey-800">Városnéző séták</h3>
                  <p className="text-sm text-parisian-grey-600">
                    Egyéni és csoportos túrák Párizsban
                  </p>
                </div>

                <div className="rounded-xl border border-parisian-beige-200 bg-parisian-cream-50 p-4">
                  <h3 className="mb-2 font-semibold text-parisian-grey-800">Programszervezés</h3>
                  <p className="text-sm text-parisian-grey-600">
                    Személyre szabott programok
                  </p>
                </div>

                <div className="rounded-xl border border-parisian-beige-200 bg-parisian-cream-50 p-4">
                  <h3 className="mb-2 font-semibold text-parisian-grey-800">Transzferek</h3>
                  <p className="text-sm text-parisian-grey-600">
                    Repülőtéri és privát transzferek
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="rounded-2xl border-2 border-parisian-beige-200 bg-parisian-cream-50 p-8">
              <h2 className="mb-4 font-playfair text-xl font-bold text-parisian-grey-800">
                Jogi Nyilatkozat
              </h2>
              <div className="space-y-3 text-sm text-parisian-grey-700">
                <p>
                  Ez a weboldal Szeidl Viktória hivatalos idegenvezetői és programszervezői szolgáltatásainak
                  bemutatására szolgál.
                </p>
                <p>
                  Az oldalon található információk tájékoztató jellegűek. A szolgáltatások részleteiről
                  és árakról érdeklődni a fenti elérhetőségeken lehet.
                </p>
                <p className="font-semibold">
                  © {new Date().getFullYear()} Szeidl Viktória. Minden jog fenntartva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer staticTexts={staticTexts} />
    </main>
  )
}
