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

// Desktop positions (horizontal S-curve)
export const stationsDesktop: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 10,
    y: 45,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 28,
    y: 35,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,
    y: 50,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 72,
    y: 40,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 90,
    y: 50,
  },
]

// Mobile positions (vertical winding line)
export const stationsMobile: MetroStation[] = [
  {
    id: '1',
    letter: 'A',
    title: 'App & Card',
    description: 'Use Bonjour RATP app or Navigo Easy card for seamless travel across Paris.',
    icon: 'Smartphone',
    x: 45,
    y: 10,
  },
  {
    id: '2',
    letter: 'F',
    title: 'Fares',
    description: 'Flat €2.55 fare covers all Metro & RER within Paris region. Single tickets available at machines.',
    icon: 'Banknote',
    x: 55,
    y: 26,
  },
  {
    id: '3',
    letter: 'N',
    title: 'Navigation',
    description: 'Follow line number and Terminus station signs. Paris Metro is color-coded for easy navigation.',
    icon: 'Navigation',
    x: 50,
    y: 45,
  },
  {
    id: '4',
    letter: 'W',
    title: 'Weekly Pass',
    description: '€32.40 Navigo (Mon-Sun) offers best value for tourists staying 4+ days in Paris.',
    icon: 'Calendar',
    x: 40,
    y: 64,
  },
  {
    id: '5',
    letter: 'Z',
    title: 'Zones & Airports',
    description: 'Line 14 connects to Orly, RER B serves CDG Airport. Check zone coverage for your pass.',
    icon: 'Plane',
    x: 50,
    y: 82,
  },
]
