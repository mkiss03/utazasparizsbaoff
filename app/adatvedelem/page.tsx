import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Adatvédelmi Nyilatkozat | Utazás Párizsba',
  description: 'Adatvédelmi tájékoztató és felhasználási feltételek',
}

export const dynamic = 'force-dynamic'

export default async function AdatvedelemPage() {
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
              Adatvédelmi Nyilatkozat
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
              A személyes adataid védelme fontos számunkra
            </p>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-parisian-grey-800 prose-p:text-parisian-grey-700 prose-a:text-french-blue-500 hover:prose-a:text-french-blue-600">

                <h2>1. Adatkezelő adatai</h2>
                <p>
                  <strong>Név:</strong> Szeidl Viktória<br/>
                  <strong>Székhely:</strong> Párizs, Franciaország<br/>
                  <strong>Email:</strong> utazasparizsba@gmail.com<br/>
                  <strong>SIRET:</strong> 94822714500018<br/>
                  <strong>SIREN:</strong> 948 227 145<br/>
                  <strong>Nyilvántartási szám:</strong> 250065
                </p>

                <h2>2. Kezelt személyes adatok</h2>
                <p>Weboldalunkon az alábbi személyes adatokat kezeljük:</p>
                <ul>
                  <li><strong>Kapcsolatfelvételnél:</strong> név, email cím, üzenet tartalma</li>
                  <li><strong>Hírlevél feliratkozásnál:</strong> email cím, név (opcionális)</li>
                  <li><strong>Technikai adatok:</strong> IP-cím, böngésző típusa, látogatás időpontja</li>
                </ul>

                <h2>3. Adatkezelés célja és jogalapja</h2>

                <h3>3.1 Kapcsolatfelvétel</h3>
                <p>
                  <strong>Cél:</strong> Megkeresésére válaszadás, szolgáltatásaink bemutatása<br/>
                  <strong>Jogalap:</strong> Hozzájárulás (GDPR 6. cikk (1) bekezdés a) pont)<br/>
                  <strong>Időtartam:</strong> A válaszadást követő 30 nap vagy törléskérésig
                </p>

                <h3>3.2 Hírlevél</h3>
                <p>
                  <strong>Cél:</strong> Párizs-ról szóló tippek, ajánlatok küldése<br/>
                  <strong>Jogalap:</strong> Hozzájárulás (GDPR 6. cikk (1) bekezdés a) pont)<br/>
                  <strong>Időtartam:</strong> A leiratkozásig, de legfeljebb 3 év inaktivitás után törlésre kerül
                </p>

                <h3>3.3 Technikai adatok</h3>
                <p>
                  <strong>Cél:</strong> Weboldal működésének biztosítása, statisztika készítése<br/>
                  <strong>Jogalap:</strong> Jogos érdek (GDPR 6. cikk (1) bekezdés f) pont)<br/>
                  <strong>Időtartam:</strong> Látogatás befejezése után 90 nap
                </p>

                <h2>4. Adattovábbítás, adatfeldolgozók</h2>
                <p>Az adatkezelés során az alábbi szolgáltatókat vesszük igénybe:</p>
                <ul>
                  <li><strong>Supabase:</strong> Adatbázis tárhely (székhelye: USA, GDPR kompatibilis)</li>
                  <li><strong>Vercel:</strong> Webtárhely szolgáltatás (székhelye: USA, GDPR kompatibilis)</li>
                  <li><strong>Resend:</strong> Email küldés (GDPR kompatibilis)</li>
                </ul>
                <p>
                  Harmadik félnek az Ön adatait <strong>nem adjuk át</strong>, kivéve jogszabályi kötelezettség esetén.
                </p>

                <h2>5. Adatbiztonság</h2>
                <p>
                  Az Ön adatainak védelme érdekében technikai és szervezési intézkedéseket alkalmazunk:
                </p>
                <ul>
                  <li>SSL titkosítás minden adatátvitelnél</li>
                  <li>Biztonságos adatbázis hozzáférés-kezelés</li>
                  <li>Rendszeres biztonsági mentések</li>
                  <li>Hozzáférés korlátozása csak arra jogosult személyek számára</li>
                </ul>

                <h2>6. Az Ön jogai</h2>
                <p>A GDPR alapján az alábbi jogokkal rendelkezik:</p>
                <ul>
                  <li><strong>Hozzáférés joga:</strong> Tájékoztatást kérhet, hogy mely adatait kezeljük</li>
                  <li><strong>Helyesbítés joga:</strong> Kérheti pontatlan adatai javítását</li>
                  <li><strong>Törlés joga:</strong> Kérheti adatainak törlését ("elfeledtetéshez való jog")</li>
                  <li><strong>Korlátozás joga:</strong> Kérheti adatkezelés korlátozását</li>
                  <li><strong>Tiltakozás joga:</strong> Tiltakozhat adatai kezelése ellen</li>
                  <li><strong>Adathordozhatóság joga:</strong> Kérheti adatainak átadását strukturált formában</li>
                  <li><strong>Panasz joga:</strong> Panaszt tehet a felügyeleti hatóságnál (Franciaországban: CNIL)</li>
                </ul>

                <p>
                  Jogai gyakorlásához írjon nekünk az <strong>utazasparizsba@gmail.com</strong> címre.
                  Kérését 30 napon belül teljesítjük.
                </p>

                <h2>7. Sütik (Cookies)</h2>
                <p>
                  Weboldalunk <strong>csak szükséges sütiket</strong> használ a működéshez (pl. munkamenet azonosítás).
                  Marketing vagy elemző sütiket nem alkalmazunk.
                </p>

                <h2>8. Változások</h2>
                <p>
                  Fenntartjuk a jogot, hogy jelen adatvédelmi nyilatkozatot bármikor módosítsuk.
                  A változásokról az oldalon tájékoztatást adunk. A nyilatkozat utolsó frissítésének dátuma: <strong>2026. január 26.</strong>
                </p>

                <h2>9. Kapcsolat</h2>
                <p>
                  Adatvédelemmel kapcsolatos kérdésekben írjon nekünk:<br/>
                  <strong>Email:</strong> utazasparizsba@gmail.com<br/>
                  <strong>Telefon:</strong> +33 7 53 14 50 35
                </p>

                <div className="mt-12 rounded-2xl border-l-4 border-parisian-beige-400 bg-parisian-cream-50 p-6">
                  <p className="text-sm italic text-parisian-grey-600">
                    Ez az adatvédelmi nyilatkozat az EU Általános Adatvédelmi Rendelet (GDPR) és a francia adatvédelmi jogszabályok előírásainak megfelelően készült.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer staticTexts={staticTexts} />
    </>
  )
}
