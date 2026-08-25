import ManifestEditor from '@/components/admin/louvre/ManifestEditor'

export default function LouvreEditorPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl font-bold text-french-blue-500">Louvre túra szerkesztő</h1>
        <p className="mt-2 text-slate-600">
          Állomások, szegmensek, hangfájlok és a bónuszsáv szerkesztése. A „Piszkozat mentése” új verziót hoz
          létre anélkül, hogy élesítené; az „Élesítés” azonnal ezt teszi a látogatók által letöltött verzióvá.
        </p>
      </div>
      <ManifestEditor />
    </div>
  )
}
