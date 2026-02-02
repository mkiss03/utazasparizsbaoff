/**
 * Metro Station Marker Data for Draggable Map
 * Positions are in percentages (0-100) relative to the full map image size
 */

export interface MetroMarker {
  id: string;
  name: string;
  description: string;
  x: number; // Position as percentage (0-100) of image width
  y: number; // Position as percentage (0-100) of image height
}

export const metroMarkers: MetroMarker[] = [
  {
    id: 'station-1',
    name: 'Louvre-Rivoli',
    description: 'Közel a Louvre Múzeumhoz',
    x: 25,
    y: 35,
  },
  {
    id: 'station-2',
    name: 'Trocadéro',
    description: 'Eiffel-torony kilátás',
    x: 45,
    y: 55,
  },
  {
    id: 'station-3',
    name: 'Champs-Élysées',
    description: 'Diadalív és bevásárlás',
    x: 65,
    y: 30,
  },
  {
    id: 'station-4',
    name: 'Montmartre',
    description: 'Sacré-Cœur bazilika',
    x: 50,
    y: 20,
  },
  {
    id: 'station-5',
    name: 'Saint-Michel',
    description: 'Latin negyed',
    x: 35,
    y: 70,
  },
];
