import Navigation from '@/components/Navigation'
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
                  egyéni vállalkozó (entrepreneur individuel, EI; SIRET: 94822714500018; nyilvántartási szám: 250065)
                  által nyújtott idegenvezetési és utazási tanácsadási szolgáltatások igénybevételének feltételeit.
                </p>

                <h3>2. A szolgáltatások köre</h3>
                <ul>
                  <li><strong>Párizsi városnézés</strong> - Személyre szabott túrák egyéni vagy csoportos formában</li>
                  <li><strong>Múzeumi programok</strong> - Szakvezetés a párizsi múzeumokban</li>
                  <li><strong>Utazási tanácsadás</strong> - Személyre szabott programjavaslat és útiterv (a szállást, a belépőjegyeket és a közlekedést az ügyfél maga foglalja és fizeti, közvetlenül a szolgáltatóknál)</li>
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

                <h4>3.3 Elállási jog</h4>
                <p>
                  A meghatározott napra és időpontra foglalt idegenvezetés szabadidős szolgáltatás, amelyre a francia
                  fogyasztóvédelmi törvénykönyv (Code de la consommation) L221-28. cikkének 12. pontja alapján a 14 napos
                  elállási jog nem vonatkozik. A lemondásra a 3.2 pont feltételei irányadók.
                </p>
                <p>
                  Utazási tanácsadás esetén a fogyasztót a szerződéskötéstől számított 14 napig elállási jog illeti meg.
                  Ha az ügyfél kifejezett kérésére a tanácsadás e határidő lejárta előtt teljes egészében teljesül, és az
                  ügyfél tudomásul vette, hogy ezzel elveszíti elállási jogát, az elállási jog a teljesítéssel megszűnik
                  (L221-28. cikk 1. pont).
                </p>

                <h3>4. Díjak és fizetés</h3>
                <p>
                  Az árak euróban (€) értendők és tartalmazzák az ÁFÁ-t. A fizetés készpénzben,
                  bankkártyával vagy előzetes átutalással történhet. Egyedi idegenvezetés vagy tanácsadás
                  esetén a szolgáltató előleget kérhet, amely kizárólag a saját díjára vonatkozik.
                </p>

                <h3>5. Felelősség</h3>
                <p>
                  A szolgáltató a jogszabályok szerint felel az általa nyújtott idegenvezetési és tanácsadási
                  szolgáltatás teljesítéséért. Nem felel azokért a károkért, amelyek az ügyfélnek, harmadik személynek
                  (így az ügyfél által közvetlenül igénybe vett szállás-, közlekedési vagy jegyszolgáltatónak) vagy
                  vis maiornak róhatók fel. Az ügyfél értéktárgyaiért a szolgáltató csak akkor felel, ha a kár az ő
                  hibájából következett be. Utasbiztosítás kötése ajánlott.
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
                  Hatályos: 2026. szeptember 30-tól
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
                  de guide touristique et de conseil aux voyageurs fournis par Szeidl Viktória, entrepreneur
                  individuel (EI) (SIRET : 94822714500018 ; numéro d'enregistrement : 250065).
                </p>

                <h3>2. Prestations proposées</h3>
                <ul>
                  <li><strong>Visites guidées de Paris</strong> - Tours personnalisés individuels ou en groupe</li>
                  <li><strong>Programmes muséaux</strong> - Visites guidées dans les musées parisiens</li>
                  <li><strong>Conseil en voyage</strong> - Suggestions de programme et d'itinéraire personnalisées (l'hébergement, les billets d'entrée et les transports sont réservés et réglés par le client directement auprès des prestataires)</li>
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

                <h4>3.3 Droit de rétractation</h4>
                <p>
                  Conformément à l'article L221-28 12° du Code de la consommation, le droit de rétractation ne
                  s'applique pas aux prestations de loisirs fournies à une date déterminée, telles que les visites
                  guidées réservées pour une date précise. Les conditions d'annulation de l'article 3.2 s'appliquent.
                </p>
                <p>
                  Pour les prestations de conseil en voyage, le consommateur dispose d'un délai de rétractation de
                  14 jours à compter de la conclusion du contrat. Ce droit ne peut plus être exercé lorsque la
                  prestation a été pleinement exécutée avant la fin de ce délai, à la demande expresse du
                  consommateur et après qu'il a reconnu perdre son droit de rétractation (article L221-28 1°).
                </p>

                <h3>4. Tarifs et paiement</h3>
                <p>
                  Les prix sont exprimés en euros (€) et incluent la TVA. Le paiement peut être effectué
                  en espèces, par carte bancaire ou par virement préalable. Pour les visites guidées ou
                  prestations de conseil personnalisées, un acompte portant exclusivement sur les honoraires
                  du prestataire peut être demandé.
                </p>

                <h3>5. Responsabilité</h3>
                <p>
                  Le prestataire est responsable, dans les conditions prévues par la loi, de la bonne exécution
                  des prestations de guide et de conseil qu'il fournit. Il n'est pas responsable des dommages
                  imputables au client, à un tiers (notamment les prestataires d'hébergement, de transport ou de
                  billetterie auxquels le client a recours directement) ou à un cas de force majeure. Il ne répond
                  des objets personnels du client qu'en cas de faute de sa part. Il est recommandé de souscrire
                  une assurance voyage.
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
                  En vigueur depuis le 30 septembre 2026
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
