/**
 * Points of Interest Data for Interactive Map
 * Positions are in percentages (0-100) relative to the full map image size
 */

export interface MapPoint {
  id: string;
  type: 'transport' | 'ticket' | 'info' | 'survival' | 'apps' | 'situations';
  title: string;
  content: string;
  color: string; // Tailwind color class for icon background
  x: number; // Position as percentage (0-100) of image width
  y: number; // Position as percentage (0-100) of image height
}

export const mapPoints: MapPoint[] = [
  {
    id: 'point-1',
    type: 'transport',
    title: 'Mivel lehet utazni?',
    content: 'Párizs közlekedési lehetőségei: metró, busz, villamos, RER és még sok más! Ismerd meg az összes opciót.',
    color: 'bg-french-blue-600', // Navy Blue (Brand Primary)
    x: 30,
    y: 35,
  },
  {
    id: 'point-2',
    type: 'ticket',
    title: 'Jegyek - amit turistaként érdemes tudni',
    content: 'Milyen jegyet vegyél? Navigo, T+ vagy mobilapp? Minden lényeges információ a jegyvásárlásról.',
    color: 'bg-parisian-gold-500', // Gold/Ochre (Brand Secondary)
    x: 50,
    y: 50,
  },
  {
    id: 'point-3',
    type: 'info',
    title: 'Hasznos tudnivalók',
    content: 'Tájékozódás, átszállás, üzemidő és egyéb fontos információk a párizsi közlekedésről.',
    color: 'bg-green-700', // Deep Green (Sage/Forest)
    x: 70,
    y: 35,
  },
  {
    id: 'point-4',
    type: 'survival',
    title: 'Kis párizsi túlélőtippek',
    content: 'Praktikus tanácsok a helyi közlekedéshez: mit kerülj, mire figyelj, hogyan spórolj időt.',
    color: 'bg-orange-600', // Terra Cotta / Burnt Orange
    x: 25,
    y: 60,
  },
  {
    id: 'point-5',
    type: 'apps',
    title: 'Ajánlott appok',
    content: 'A legjobb mobilalkalmazások, amelyek megkönnyítik a párizsi közlekedést.',
    color: 'bg-slate-700', // Slate / Dark Grey
    x: 60,
    y: 65,
  },
  {
    id: 'point-6',
    type: 'situations',
    title: 'Valós Szituációk',
    content: 'Példák, történetek és konkrét helyzetek, amikkel találkozhatsz a párizsi közlekedésben.',
    color: 'bg-blue-600', // Royal Blue
    x: 45,
    y: 80,
  },
];
