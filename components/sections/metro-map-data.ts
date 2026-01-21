export interface MetroStation {
  id: string
  letter: string
  title: string
  description: string
  icon: string
  // Position as percentage (0-100) for absolute positioning
  x: number // left position %
  y: number // top position %
}

// Desktop positions (horizontal smooth arc matching Paris map)
// Positions from West to East (La Défense → République → Nation area)
export const stationsDesktop: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 15,  // Western Paris (La Défense area)
    y: 48,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 32,  // Northwest (Opera/Louvre area)
    y: 38,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,  // Center (Châtelet/République area)
    y: 33,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 68,  // Northeast (Gare de l'Est/Gare du Nord area)
    y: 38,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 85,  // Eastern Paris (Nation/CDG direction)
    y: 48,
  },
]

// Mobile positions (vertical smooth curve)
export const stationsMobile: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 50,
    y: 12,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 60,
    y: 28,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,
    y: 48,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 40,
    y: 68,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 50,
    y: 88,
  },
]
