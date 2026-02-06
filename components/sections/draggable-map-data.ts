/**
 * Map Point type matching the Supabase `map_points` table schema.
 */
export interface MapPoint {
  id: string;
  title: string;
  x: number;
  y: number;
  type: 'transport' | 'ticket' | 'info' | 'survival' | 'apps' | 'situations' | 'situation' | 'metro' | 'safety' | 'app';
  color: string;
  question: string;
  answer: string;
  details: string;
  // Rich content sections (newline-separated for lists)
  pros?: string;        // "Előnyök" - each line is a list item
  usage_steps?: string; // "Hogyan használd" - each line is a numbered step
  tip?: string;         // "Viktória titkos tippje" - single text block
}

/**
 * Fallback points used when the database is empty or unavailable.
 */
export const fallbackMapPoints: MapPoint[] = [
  {
    id: 'point-1',
    type: 'transport',
    title: 'Mivel lehet utazni?',
    color: 'bg-french-blue-600',
    x: 30,
    y: 35,
    question: 'Mivel lehet utazni Párizsban?',
    answer: 'Metró, RER, busz, villamos, bicikli és roller – kombinálhatod őket, hogy bárhova eljuss.',
    details: '',
  },
  {
    id: 'point-2',
    type: 'ticket',
    title: 'Jegyek',
    color: 'bg-parisian-gold-500',
    x: 35,
    y: 55,
    question: 'Melyik jegyet vegyem Párizsban?',
    answer: 'A T+ jegy egyetlen útra jó. Ha több napot töltesz itt, a Navigo bérlet sokkal kifizetődőbb!',
    details: '',
  },
  {
    id: 'point-3',
    type: 'info',
    title: 'Hasznos tudnivalók',
    color: 'bg-green-700',
    x: 70,
    y: 35,
    question: 'Mire figyeljek a párizsi közlekedésben?',
    answer: '"Correspondance" = átszállás, "Sortie" = kijárat. Minden vonal más színű.',
    details: '',
  },
  {
    id: 'point-4',
    type: 'survival',
    title: 'Túlélőtippek',
    color: 'bg-orange-600',
    x: 25,
    y: 60,
    question: 'Mik a legfontosabb túlélőtippek?',
    answer: 'Csúcsidőben (8-9h, 17-19h) tömeg van. Vigyázz a táskádra és tartsd jobbra a mozgólépcsőn!',
    details: '',
  },
  {
    id: 'point-5',
    type: 'apps',
    title: 'Ajánlott appok',
    color: 'bg-slate-700',
    x: 60,
    y: 65,
    question: 'Milyen appokat használjak?',
    answer: 'Citymapper, Google Maps offline, Boomerang (RATP) – ezek a legfontosabbak.',
    details: '',
  },
  {
    id: 'point-6',
    type: 'situations',
    title: 'Valós Szituációk',
    color: 'bg-blue-600',
    x: 45,
    y: 80,
    question: 'Milyen valós helyzetekkel találkozhatok?',
    answer: 'Sztrájk, eltévedés, tömeg – ne aggódj, mindenki átéli! Az appok segítenek B tervet találni.',
    details: '',
  },
];
