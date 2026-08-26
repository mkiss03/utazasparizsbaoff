import VouchersAdmin from '@/components/admin/louvre/VouchersAdmin'

export default function LouvreVouchersPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Louvre voucherek</h1>
        <p className="mt-2 text-slate-600">
          Kódok kézi kiadása fizetős checkout előtt -- generálj kódot, küldd el a vevőnek, ő aktiválja a
          telefonján. Az aktiválás/lejárat/eszközcsere logika már most éles, csak a Stripe/Barion fizetés és a
          nyilvános beváltó felület nincs még rákötve a látogatói alkalmazásra.
        </p>
      </div>
      <VouchersAdmin />
    </div>
  )
}
