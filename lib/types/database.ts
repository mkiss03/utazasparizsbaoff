export type UserRole = 'super_admin' | 'vendor' | 'customer'

export interface Profile {
  id: string
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_background_image?: string
  about_title: string
  about_description: string
  about_image?: string
  contact_email: string
  contact_phone: string
  contact_whatsapp: string
  newsletter_title?: string
  newsletter_description?: string
  newsletter_cta?: string
  role: UserRole
  is_approved: boolean
  vendor_bio?: string
  vendor_city?: string
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface Program {
  title: string
  description?: string
  items?: string[]
  // Program-specific pricing/info badges
  show_price?: boolean
  show_duration?: boolean
  show_group_size?: boolean
  custom_badge_text?: string  // e.g., "Kilométer alapú számlázás"
  // Optional custom values (if not set, uses service-level values)
  price?: number
  duration?: number
  group_size?: number
}

export interface Tour {
  id: string
  title: string
  slug: string
  short_description?: string
  full_description?: string
  image_url?: string
  price: number
  duration: number
  max_group_size: number
  features?: string[]
  is_featured: boolean
  display_order: number
  programs?: Program[]
  icon_name?: string
  color_gradient?: string
  created_at: string
  updated_at: string
}

// Service is just a Tour with additional service-specific fields populated
export type Service = Tour

export interface GalleryImage {
  id: string
  image_url: string
  caption?: string
  alt_text?: string
  display_order: number
  created_at: string
}

export type PostStatus = 'draft' | 'published'

export interface BlogCategory {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  category_id?: string
  tags?: string // Comma-separated hashtags (e.g., "#párizs, #utazás, #tippek")
  status: PostStatus
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
  is_active: boolean
}

export interface DiscoverItem {
  id: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
  category?: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
  unsubscribed_at?: string
  created_at: string
}

// ============================================
// MARKETPLACE TYPES (City Pass Model)
// ============================================

export interface Bundle {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  cover_image?: string
  city: string
  category?: string
  author_id: string
  is_published: boolean
  total_cards: number
  total_sales: number
  rating: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  estimated_time_minutes: number
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: string
  bundle_id: string
  question: string
  answer: string
  hint?: string
  image_url?: string
  card_order: number
  is_demo: boolean
  created_at: string
  updated_at: string
}

export interface CityPricing {
  city: string
  price: number
  duration_days: number
  currency: string
  is_active: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  bundle_id?: string | null
  city?: string
  vendor_id: string
  amount: number
  commission_amount: number
  vendor_amount: number
  status: 'pending' | 'completed' | 'refunded'
  payment_method: string
  created_at: string
}

export interface UserPurchase {
  id: string
  user_id: string
  city: string
  order_id: string
  purchased_at: string
  expires_at: string
  is_active: boolean
}

export interface CityPass {
  city: string
  purchased_at: string
  expires_at: string
  days_remaining: number
  is_expired: boolean
}

export interface VendorStats {
  total_bundles: number
  published_bundles: number
  total_sales: number
  total_revenue: number
  total_cards: number
  cities_covered: string[]
}

export interface GlobalStats {
  total_vendors: number
  total_bundles: number
  total_orders: number
  total_revenue: number
  total_commission: number
}

export interface Testimonial {
  id: string
  name: string
  message: string
  rating?: number
  date?: string
  avatar?: string
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

// ============================================
// DISTRICT GUIDE TYPES (Paris Arrondissements)
// ============================================

export type ContentLayout = 'standard' | 'rich_ticket' | 'rich_list'

export interface DistrictGuide {
  id: string
  district_number: number // 1-20
  title: string
  subtitle?: string
  description?: string
  highlights?: string[]
  content_layout: ContentLayout
  sort_order: number
  is_active: boolean

  // Rich content fields
  main_attraction?: string
  local_tips?: string
  best_for?: string[] // e.g., ['Turisták', 'Kultúra', 'Vásárlás']
  avoid_tips?: string

  // Visual customization
  accent_color?: string // Tailwind color name
  icon_name?: string // Lucide icon name

  // Media
  cover_image_url?: string
  gallery_images?: string[]

  // Timestamps
  created_at: string
  updated_at: string
}

// ============================================
// CRUISE WIZARD TYPES (Seine Boat Tour Modal)
// ============================================

export interface WizardStep {
  id: string
  title: string
  subtitle?: string
  description: string
  label: string // Timeline label (e.g., "Indulás")
  features?: WizardFeature[]
  ctaText: string
  ctaLink?: string
  order: number
}

export interface WizardFeature {
  icon: string // Lucide icon name
  text: string
  subtext?: string
}

export interface WizardButtonStyles {
  backgroundColor: string
  hoverBackgroundColor: string
  textColor: string
  borderRadius: number // 0-50 px
  shadow?: string
}

export interface WizardTypographyStyles {
  headingColor: string
  bodyTextColor: string
  stepCounterColor: string
  labelColor: string
  fontFamily?: string
}

export interface WizardTimelineStyles {
  lineColorActive: string
  lineColorInactive: string
  dotColorActive: string
  dotColorInactive: string
  dotSize: number
  boatIconColor: string
}

export interface WizardCardStyles {
  backgroundColor: string
  gradientEnabled: boolean
  gradientFrom?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  borderColor: string
  borderRadius: number
  shadowIntensity: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export interface WizardPricingStyles {
  adultPriceColor: string
  childPriceColor: string
  currencyColor: string
  dividerColor: string
}

export interface WizardStyles {
  card: WizardCardStyles
  button: WizardButtonStyles
  typography: WizardTypographyStyles
  timeline: WizardTimelineStyles
  pricing: WizardPricingStyles
  // Journey visualization (left panel)
  journeyPathColor: string
  journeyWaveColor: string
  journeyBoatBackground: string
}

export interface WizardPricing {
  adultPrice: number
  childPrice: number
  currency: string
  privacyNote: string
}

export interface WizardConfig {
  id: string
  name: string // Config name for admin reference
  steps: WizardStep[]
  styles: WizardStyles
  pricing: WizardPricing
  // FAB (Floating Action Button) settings
  fabText: string
  fabIcon: string
  fabPosition: 'bottom-left' | 'bottom-right'
  // Meta
  isActive: boolean
  created_at: string
  updated_at: string
}

// Default configuration factory
export const createDefaultWizardConfig = (): Omit<WizardConfig, 'id' | 'created_at' | 'updated_at'> => ({
  name: 'Seine Cruise Wizard',
  steps: [
    {
      id: 'step-1',
      title: 'Szajnai hajózás',
      subtitle: 'Szabadság és élmény',
      description: 'Felejtsd el a sorban állást! Párizsban élő idegenvezetőként olyan jegyet kínálok neked, ami nem korlátoz.',
      label: 'Indulás',
      ctaText: 'Induljunk',
      order: 1,
    },
    {
      id: 'step-2',
      title: 'Miért ez a legjobb választás?',
      description: 'Fedezd fel az előnyöket, amelyek miatt ez a jegy különleges.',
      label: 'Előnyök',
      features: [
        { icon: 'Calendar', text: 'Teljes rugalmasság', subtext: 'Nincs fix időpont' },
        { icon: 'Clock', text: '1 évig érvényes', subtext: 'Bármikor felhasználható' },
        { icon: 'QrCode', text: 'Azonnali digitális jegy', subtext: 'Nincs nyomtatás' },
        { icon: 'MapPin', text: 'Klasszikus útvonal', subtext: 'Eiffel, Louvre, Notre-Dame' },
      ],
      ctaText: 'Tovább',
      order: 2,
    },
    {
      id: 'step-3',
      title: 'Ez a jegy neked szól, ha...',
      description: 'Tökéletes választás, ha szereted a szabadságot.',
      label: 'Neked szól',
      features: [
        { icon: 'Calendar', text: 'Nem szereted a menetrendeket' },
        { icon: 'Sun', text: 'Csak akkor hajóznál, ha kisüt a nap' },
        { icon: 'Headphones', text: 'Szeretnéd megismerni Párizs titkait' },
      ],
      ctaText: 'Lássuk az árakat',
      order: 3,
    },
    {
      id: 'step-4',
      title: 'Árak és foglalás',
      description: 'Válaszd ki a neked megfelelő jegyet.',
      label: 'Jegyvétel',
      ctaText: 'Jegyet kérek',
      ctaLink: '#contact',
      order: 4,
    },
  ],
  styles: {
    card: {
      backgroundColor: '#FAF7F2',
      gradientEnabled: false,
      borderColor: '#e7e5e4',
      borderRadius: 24,
      shadowIntensity: '2xl',
    },
    button: {
      backgroundColor: '#0f172a',
      hoverBackgroundColor: '#334155',
      textColor: '#ffffff',
      borderRadius: 9999,
    },
    typography: {
      headingColor: '#0f172a',
      bodyTextColor: '#475569',
      stepCounterColor: '#64748b',
      labelColor: '#64748b',
    },
    timeline: {
      lineColorActive: '#0f172a',
      lineColorInactive: '#e2e8f0',
      dotColorActive: '#0f172a',
      dotColorInactive: '#cbd5e1',
      dotSize: 12,
      boatIconColor: '#0f172a',
    },
    pricing: {
      adultPriceColor: '#0f172a',
      childPriceColor: '#334155',
      currencyColor: '#64748b',
      dividerColor: '#e2e8f0',
    },
    journeyPathColor: '#94a3b8',
    journeyWaveColor: '#475569',
    journeyBoatBackground: '#0f172a',
  },
  pricing: {
    adultPrice: 17,
    childPrice: 8,
    currency: '€',
    privacyNote: 'A megrendeléssel elfogadod az adatvédelmi tájékoztatómat.',
  },
  fabText: 'Hajózás Párizsban',
  fabIcon: 'Ship',
  fabPosition: 'bottom-left',
  isActive: true,
})
