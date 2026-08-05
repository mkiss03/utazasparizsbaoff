import {
  Camera,
  Car,
  Check,
  Coffee,
  Coins,
  Compass,
  Gem,
  Heart,
  HelpCircle,
  Landmark,
  LifeBuoy,
  Palette,
  PartyPopper,
  PlaneTakeoff,
  TrainFront,
  TreePine,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

/** Az editor property panel egy sima szöveges ikon-nevet ment (pl. "heart") -- ez fordítja React komponenssé. */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  'plane-takeoff': PlaneTakeoff,
  compass: Compass,
  'life-buoy': LifeBuoy,
  car: Car,
  'train-front': TrainFront,
  users: Users,
  'help-circle': HelpCircle,
  wallet: Wallet,
  coins: Coins,
  gem: Gem,
  heart: Heart,
  'party-popper': PartyPopper,
  user: User,
  palette: Palette,
  'utensils-crossed': UtensilsCrossed,
  landmark: Landmark,
  camera: Camera,
  'tree-pine': TreePine,
  coffee: Coffee,
  check: Check,
}

export function resolveIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null
  return ICON_REGISTRY[name] ?? null
}
