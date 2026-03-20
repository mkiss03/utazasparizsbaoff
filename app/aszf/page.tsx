import Navigation from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { FileText } from 'lucide-react'
import { useState } from 'react'

export const metadata = {
  title: 'Általános Szerződési Feltételek | Utazás Párizsba',
  description: 'ÁSZF és szolgáltatási feltételek - Magyar és Francia',
}

export const dynamic = 'force-dynamic'

export default async function ASZFPage() {
  const supabase = await createClient()
  const { data: staticTextsData } = await supabase.from('site_text_content').select('*')
  const staticTexts: Record<string, string> = {}
  staticTextsData?.forEach((item: any) => {
    staticTexts[item.key] = item.value || ''
  })

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-parisian-cream-50 to-white pt-24">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-parisian-beige-400 to-parisian-beige-500 shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
              Általános Szerződési Feltételek
            </h1>
            <p className="text-lg text-parisian-grey-600 mb-2">
              Conditions Générales de Vente et de Prestation de Services
            </p>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-5xl">
            {/* Hungarian Version */}
            <div className="mb-12 rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-parisian-grey-800 prose-p:text-parisian-grey-700 prose-a:text-french-blue-500 hover:prose-a:text-french-blue-600">

                <h2>🇭🇺 Magyar verzió</h2>

                <h3>1. Általános rendelkezések</h3>
                <p>
                  Jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) tartalmazzák Szeidl Viktória
                  (székhely: Párizs, Franciaország; SIRET: 94822714500018; nyilvántartási szám: 250065)
                  által nyújtott idegenvezetési és utazásszervezői szolgáltatások igénybevételének feltételeit.
                </p>

                <h3>2. A szolgáltatások köre</h3>
                <ul>
                  <li><strong>Párizsi városnézés</strong> - Személyre szabott túrák egyéni vagy csoportos formában</li>
                  <li><strong>Múzeumi programok</strong> - Szakvezetés a párizsi múzeumokban</li>
                  <li><strong>Programszervezés</strong> - Komplex utazási programok összeállítása</li>
                  <li><strong>Transzfer szolgáltatás</strong> - Repülőtéri és egyéb közlekedési szolgáltatások</li>
                </ul>

                <h3>3. Foglalás és lemondás</h3>
                <h4>3.1 Foglalás</h4>
                <p>
                  A foglalás emailben vagy telefonon történik. A foglalás akkor válik érvényessé, amikor
                  a szolgáltató írásban visszaigazolja azt.
                </p>

                <h4>3.2 Lemondási feltételek</h4>
                <ul>
                  <li><strong>7 napnál korábbi lemondás:</strong> Teljes visszatérítés</li>
                  <li><strong>3-7 nap között:</strong> 50% visszatérítés</li>
                  <li><strong>3 napon belül:</strong> Nincs visszatérítés</li>
                  <li><strong>Vis maior esetén:</strong> Teljes visszatérítés vagy új időpont egyeztetése</li>
                </ul>

                <h3>4. Díjak és fizetés</h3>
                <p>
                  Az árak euróban (€) értendők és tartalmazzák az ÁFÁ-t. A fizetés készpénzben,
                  bankkártyával vagy előzetes átutalással történhet. Egyedi programok esetén
                  előleg fizetése szükséges.
                </p>

                <h3>5. Felelősség</h3>
                <p>
                  A szolgáltató nem vállal felelősséget a szolgáltatás igénybevétele során bekövetkező
                  balesetekért, elveszett vagy megrongálódott tárgyakért. Ajánljuk megfelelő utasbiztosítás kötését.
                </p>

                <h3>6. Adatvédelem</h3>
                <p>
                  A foglalás során megadott személyes adatok kezelése az{' '}
                  <a href="/adatvedelem">Adatvédelmi Nyilatkozatban</a> foglaltak szerint történik.
                </p>

                <h3>7. Vis maior</h3>
                <p>
                  Előre nem látható körülmények (időjárás, sztrájk, pandémia, stb.) esetén a szolgáltató
                  fenntartja a jogot a program módosítására vagy lemondására. Ilyen esetben új időpont
                  egyeztetése vagy teljes visszatérítés biztosított.
                </p>

                <h3>8. Jogviták rendezése</h3>
                <p>
                  Jelen ÁSZF-re a francia jog az irányadó. Vitás kérdések esetén a felek elsősorban
                  békés megegyezésre törekednek. Ennek sikertelensége esetén a francia bíróságok illetékesek.
                </p>

                <h3>9. Kapcsolat</h3>
                <p>
                  <strong>Email:</strong> utazasparizsba@gmail.com<br/>
                  <strong>Telefon:</strong> +33 7 53 14 50 35
                </p>

                <p className="text-sm italic mt-8">
                  Hatályos: 2026. január 26-tól
                </p>
              </div>
            </div>

            {/* French Version */}
            <div className="rounded-3xl border-2 border-french-blue-200 bg-white p-8 shadow-lg md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-parisian-grey-800 prose-p:text-parisian-grey-700 prose-a:text-french-blue-500 hover:prose-a:text-french-blue-600">

                <h2>🇫🇷 Version française</h2>

                <h3>1. Dispositions générales</h3>
                <p>
                  Les présentes Conditions Générales de Vente (ci-après : CGV) régissent les services
                  de guide touristique et d'organisation de programmes fournis par Szeidl Viktória
                  (siège social : Paris, France ; SIRET : 94822714500018 ; numéro d'enregistrement : 250065).
                </p>

                <h3>2. Prestations proposées</h3>
                <ul>
                  <li><strong>Visites guidées de Paris</strong> - Tours personnalisés individuels ou en groupe</li>
                  <li><strong>Programmes muséaux</strong> - Visites guidées dans les musées parisiens</li>
                  <li><strong>Organisation de programmes</strong> - Conception de programmes de voyage complets</li>
                  <li><strong>Service de transfert</strong> - Services de transport aéroport et autres</li>
                </ul>

                <h3>3. Réservation et annulation</h3>
                <h4>3.1 Réservation</h4>
                <p>
                  La réservation s'effectue par email ou téléphone. La réservation devient valide
                  lorsque le prestataire la confirme par écrit.
                </p>

                <h4>3.2 Conditions d'annulation</h4>
                <ul>
                  <li><strong>Annulation plus de 7 jours à l'avance :</strong> Remboursement intégral</li>
                  <li><strong>Entre 3 et 7 jours :</strong> Remboursement de 50%</li>
                  <li><strong>Moins de 3 jours :</strong> Pas de remboursement</li>
                  <li><strong>En cas de force majeure :</strong> Remboursement intégral ou report de la date</li>
                </ul>

                <h3>4. Tarifs et paiement</h3>
                <p>
                  Les prix sont exprimés en euros (€) et incluent la TVA. Le paiement peut être effectué
                  en espèces, par carte bancaire ou par virement préalable. Pour les programmes personnalisés,
                  un acompte est requis.
                </p>

                <h3>5. Responsabilité</h3>
                <p>
                  Le prestataire n'est pas responsable des accidents survenus pendant le service,
                  ni des objets perdus ou endommagés. Il est recommandé de souscrire une assurance voyage appropriée.
                </p>

                <h3>6. Protection des données</h3>
                <p>
                  Le traitement des données personnelles fournies lors de la réservation est conforme
                  à la{' '}
                  <a href="/adatvedelem">Politique de Confidentialité</a>.
                </p>

                <h3>7. Force majeure</h3>
                <p>
                  En cas de circonstances imprévisibles (météo, grève, pandémie, etc.), le prestataire
                  se réserve le droit de modifier ou d'annuler le programme. Dans ce cas, un report
                  ou un remboursement intégral sera proposé.
                </p>

                <h3>8. Règlement des litiges</h3>
                <p>
                  Les présentes CGV sont régies par le droit français. En cas de litige, les parties
                  s'efforceront d'abord de parvenir à un règlement amiable. À défaut, les tribunaux
                  français seront compétents.
                </p>

                <h3>9. Contact</h3>
                <p>
                  <strong>Email :</strong> utazasparizsba@gmail.com<br/>
                  <strong>Téléphone :</strong> +33 7 53 14 50 35
                </p>

                <p className="text-sm italic mt-8">
                  En vigueur depuis le 26 janvier 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer staticTexts={staticTexts} />
    </>
  )
}
