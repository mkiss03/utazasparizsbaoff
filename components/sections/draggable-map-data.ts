/**
 * Points of Interest Data for Interactive Map
 * Positions are in percentages (0-100) relative to the full map image size
 */

export interface MapPoint {
  id: string;
  type: 'metro' | 'ticket' | 'navigation' | 'info';
  title: string;
  content: string;
  x: number; // Position as percentage (0-100) of image width
  y: number; // Position as percentage (0-100) of image height
}

export const mapPoints: MapPoint[] = [
  {
    id: 'point-1',
    type: 'metro',
    title: 'Metróvonalak',
    content: 'Párizs metróhálózata sűrű és gyors, 16 vonal köti össze a város minden részét. A metró a legegyszerűbb módja annak, hogy gyorsan eljuss a híres látnivalókhoz. A járatok gyakran közlekednek, és a hálózat jól kiépített.',
    x: 50,
    y: 45,
  },
  {
    id: 'point-2',
    type: 'ticket',
    title: 'Jegyek és Bérletek',
    content: 'Milyen jegyet vegyél? A T+ gyűjtőjegy egyszeri utakra ideális, míg a Navigo bérlet hosszabb tartózkodásra ajánlott. A jegyek válthatók automatákból és pénztárakból egyaránt. Figyelem: őrizd meg a jegyed az út végéig!',
    x: 25,
    y: 50,
  },
  {
    id: 'point-3',
    type: 'navigation',
    title: 'Tájékozódás',
    content: 'A párizsi metrótérképek egyszerűen érthetőek, színkódolt vonalakkal. Minden állomáson találsz térképeket és digitális információs táblákat. Használd a mobilalkalmazásokat valós idejű frissítésekhez!',
    x: 70,
    y: 35,
  },
  {
    id: 'point-4',
    type: 'metro',
    title: 'Fő Csomópontok',
    content: 'A legnagyobb átszállóállomások: Châtelet-Les Halles, Gare du Nord, és Montparnasse. Ezeken az állomásokon több vonal is keresztezi egymást, így könnyen válthatunk irányokat.',
    x: 45,
    y: 65,
  },
];
