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

// ============================================
// PARIS DISTRICT GUIDE CONFIG TYPES
// ============================================

export type DistrictLayoutType = 'standard' | 'rich_ticket' | 'rich_list'

export interface DistrictContent {
  districtNumber: number // 1-20
  isActive: boolean
  title: string // e.g., "1. Kerület - A Louvre"
  subtitle?: string
  description: string
  highlights?: string[]
  mainAttraction?: string
  localTips?: string
  bestFor?: string[]
  avoidTips?: string
  layoutType: DistrictLayoutType
  sortOrder: number
  iconName?: string
  accentColor?: string
}

export interface MapStyles {
  baseColor: string // Default fill for inactive districts
  hoverColor: string // Fill on hover
  activeColor: string // Highlighted/selected district
  strokeColor: string // Borders between districts
  strokeWidth: number
  labelColor: string // District number labels
}

export interface CardStyles {
  backgroundColor: string
  headerGradientFrom: string
  headerGradientTo: string
  titleColor: string
  subtitleColor: string
  bodyTextColor: string
  accentColor: string // Icons, checkmarks
  borderColor: string
  borderRadius: number
  shadowIntensity: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export interface TimelineStyles {
  lineColor: string
  lineColorActive: string
  dotColorActive: string
  dotColorInactive: string
  dotSize: number
  labelColorActive: string
  labelColorInactive: string
  pinColor: string
}

export interface ParisGuideStyles {
  map: MapStyles
  card: CardStyles
  timeline: TimelineStyles
  sectionBackground: string
  headingColor: string
  subheadingColor: string
}

export interface ParisGuideGlobalContent {
  mainTitle: string
  subtitle: string
  timelineTitle: string
  mapTitle: string
  legendActiveText: string
  legendVisitedText: string
  legendInactiveText: string
}

export interface ParisGuideConfig {
  id: string
  name: string
  globalContent: ParisGuideGlobalContent
  districts: DistrictContent[]
  styles: ParisGuideStyles
  isActive: boolean
  created_at: string
  updated_at: string
}

// ============================================
// WALKING TOUR TYPES (Bookable Tour Events)
// ============================================

export type WalkingTourStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type BookingPaymentStatus = 'pending' | 'completed' | 'refunded'
export type BookingStatus = 'confirmed' | 'cancelled_by_user' | 'cancelled_by_admin'

export interface WalkingTour {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  tour_date: string
  start_time: string
  duration_minutes: number
  meeting_point: string
  meeting_point_url?: string
  price_per_person: number
  min_participants: number
  max_participants: number
  current_bookings: number
  image_url?: string
  highlights?: string[]
  status: WalkingTourStatus
  cancellation_reason?: string
  created_at: string
  updated_at: string
}

export interface WalkingTourBooking {
  id: string
  walking_tour_id: string
  order_number: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  num_participants: number
  total_amount: number
  payment_status: BookingPaymentStatus
  payment_method: string
  booking_status: BookingStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface WalkingTourBookingWithTour extends WalkingTourBooking {
  walking_tours?: Pick<WalkingTour, 'title' | 'tour_date' | 'start_time'>
}

// ============================================
// MUSEUM GUIDE TYPES (Louvre Interactive Guide)
// ============================================

export type MuseumWing = 'Denon' | 'Sully' | 'Richelieu'

export interface MuseumGuideArtwork {
  id: string
  title: string
  artist: string
  year: string
  wing: MuseumWing
  floor: string
  room: string
  story: string
  fun_fact?: string
  image_url?: string
  gradient: string
  map_position_x: number
  map_position_y: number
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export const GRADIENT_PRESETS = [
  { label: 'Meleg bézs', value: 'linear-gradient(160deg, #E8DDD0 0%, #D4C9BC 40%, #C4B8A8 100%)' },
  { label: 'Hűvös kék-szürke', value: 'linear-gradient(160deg, #D6DDE4 0%, #C4CDD6 40%, #B0BBC6 100%)' },
  { label: 'Zsálya zöld', value: 'linear-gradient(160deg, #DDE4D6 0%, #C6D0BC 40%, #B4C0A8 100%)' },
  { label: 'Halvány rózsaszín', value: 'linear-gradient(160deg, #E4D6DD 0%, #D0BCC6 40%, #C0A8B4 100%)' },
  { label: 'Meleg homok', value: 'linear-gradient(160deg, #E4DED6 0%, #D0C8BC 40%, #C0B6A8 100%)' },
  { label: 'Puha zöldeskék', value: 'linear-gradient(160deg, #D6E0E4 0%, #BCD0D4 40%, #A8C0C4 100%)' },
  { label: 'Levendula', value: 'linear-gradient(160deg, #DDD6E4 0%, #C6BCD0 40%, #B0A8C0 100%)' },
  { label: 'Arany homok', value: 'linear-gradient(160deg, #E8E0D0 0%, #D8CDB8 40%, #C8BAA0 100%)' },
] as const

// ============================================
// MUSEUM GUIDE PURCHASE TYPES
// ============================================

export type MuseumGuidePurchaseStatus = 'pending' | 'completed' | 'refunded'

export interface MuseumGuidePurchase {
  id: string
  order_number: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  amount: number
  payment_status: MuseumGuidePurchaseStatus
  access_token: string
  notes?: string
  created_at: string
  updated_at: string
}

// ============================================
// LOUVRE TOUR TYPES (Guided Museum Tour)
// ============================================

export type LouvreTourStatus = 'draft' | 'published'

export interface LouvreTour {
  id: string
  title: string
  slug: string
  subtitle?: string
  duration_text: string
  summary_text?: string
  tips?: string
  image_url?: string
  status: LouvreTourStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface LouvreTourStop {
  id: string
  tour_id: string
  stop_number: number
  title: string
  location_wing: string
  location_floor: string
  location_rooms: string
  duration_minutes: number
  main_artwork?: string
  description: string
  story: string
  fun_fact?: string
  image_url?: string
  is_demo: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Louvre Tour purchase tracking
export type LouvreTourPurchaseStatus = 'pending' | 'completed' | 'refunded'

export interface LouvreTourPurchase {
  id: string
  order_number: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  amount: number
  payment_status: LouvreTourPurchaseStatus
  access_token: string
  notes?: string
  created_at: string
  updated_at: string
}

// ============================================
// WALKING TOUR CALENDAR SETTINGS
// ============================================

export interface WalkingTourCalendarSettings {
  // Section header
  sectionBadgeText: string
  sectionBadgeBgColor: string
  sectionBadgeTextColor: string
  sectionTitle: string
  sectionSubtitle: string
  sectionTitleColor: string
  sectionSubtitleColor: string

  // Calendar header
  headerBgFrom: string
  headerBgTo: string
  headerTextColor: string
  headerNavColor: string

  // Day of week headers
  dayHeaderBgColor: string
  dayHeaderTextColor: string

  // Regular day cells
  dayTextColor: string
  pastDayTextColor: string

  // Today highlight
  todayBgColor: string
  todayTextColor: string

  // Tour day cells
  tourDayBgColor: string
  tourDayBorderColor: string
  tourDayBorderWidth: number

  // Tour badges
  tourBadgeBgColor: string
  tourBadgeTextColor: string
  fullBadgeBgColor: string
  fullBadgeTextColor: string
  showTimeOnBadge: boolean

  // Legend
  showLegend: boolean
  legendTourLabel: string
  legendFullLabel: string

  // Modal
  modalHeaderBgFrom: string
  modalHeaderBgTo: string
  modalHeaderTextColor: string
  modalAccentColor: string
  bookButtonBgColor: string
  bookButtonTextColor: string
}

export const defaultCalendarSettings: WalkingTourCalendarSettings = {
  sectionBadgeText: 'Fedezd fel velünk',
  sectionBadgeBgColor: '#FAF4E8',
  sectionBadgeTextColor: '#C2AF90',
  sectionTitle: 'Közelgő Sétatúrák',
  sectionSubtitle: 'Csatlakozz egyedülálló, magyar nyelvű sétáinkhoz és fedezd fel Párizs rejtett kincseit',
  sectionTitleColor: '#1A1A1A',
  sectionSubtitleColor: '#4D4D4D',

  headerBgFrom: '#1A1A1A',
  headerBgTo: '#333333',
  headerTextColor: '#FFFFFF',
  headerNavColor: '#F5EDD9',

  dayHeaderBgColor: '#FFFEF9',
  dayHeaderTextColor: '#4D4D4D',

  dayTextColor: '#333333',
  pastDayTextColor: '#999999',

  todayBgColor: '#1A1A1A',
  todayTextColor: '#FFFFFF',

  tourDayBgColor: '#FFF8EB',
  tourDayBorderColor: '#D4A574',
  tourDayBorderWidth: 2,

  tourBadgeBgColor: '#D4A574',
  tourBadgeTextColor: '#FFFFFF',
  fullBadgeBgColor: '#FEE2E2',
  fullBadgeTextColor: '#DC2626',
  showTimeOnBadge: true,

  showLegend: true,
  legendTourLabel: 'Van túra',
  legendFullLabel: 'Betelt',

  modalHeaderBgFrom: '#1A1A1A',
  modalHeaderBgTo: '#333333',
  modalHeaderTextColor: '#FFFFFF',
  modalAccentColor: '#D4C49E',
  bookButtonBgColor: '#D4A574',
  bookButtonTextColor: '#FFFFFF',
}

// ============================================
// PARIS DISTRICT GUIDE CONFIG TYPES
// ============================================

export const createDefaultParisGuideConfig = (): Omit<ParisGuideConfig, 'id' | 'created_at' | 'updated_at'> => ({
  name: 'Paris District Guide - Default',
  globalContent: {
    mainTitle: 'Fedezd fel Párizs kerületeit',
    subtitle: 'Minden kerületnek megvan a saját karaktere. Kattints a térképre vagy navigálj az idővonalon!',
    timelineTitle: 'Felfedezési útvonal',
    mapTitle: 'Párizs Kerületei',
    legendActiveText: 'Aktív',
    legendVisitedText: 'Megtekintett',
    legendInactiveText: 'Nem aktív',
  },
  districts: [
    {
      districtNumber: 1,
      isActive: true,
      title: '1. kerület - Louvre és Châtelet',
      subtitle: 'A királyi Párizs',
      description: 'A Louvre, Tuileriák kertje és a Palais Royal otthona. Párizs történelmi szíve, ahol a királyok éltek.',
      highlights: ['Louvre Múzeum', 'Tuileriák kertje', 'Palais Royal', 'Place Vendôme'],
      mainAttraction: 'A Louvre - a világ legnagyobb múzeuma',
      localTips: 'Kerüld a főbejáratot! A Carrousel du Louvre bejárat sokkal rövidebb sorokat jelent.',
      bestFor: ['Művészet', 'Történelem', 'Luxus vásárlás'],
      layoutType: 'rich_ticket',
      sortOrder: 1,
      iconName: 'Ticket',
    },
    {
      districtNumber: 4,
      isActive: true,
      title: '4. kerület - Notre-Dame és Marais',
      subtitle: 'A szív és a lélek',
      description: 'Notre-Dame, Hôtel de Ville, és a Marais negyed. A párizsi romantika és történelem epicentruma.',
      highlights: ['Notre-Dame', 'Marais', 'Place des Vosges', 'Île de la Cité'],
      mainAttraction: 'Notre-Dame katedrális (felújítás alatt)',
      localTips: 'A falafel a Rue des Rosiers-n kötelező! Vasárnap délelőtt a legnyugisabb.',
      bestFor: ['Történelem', 'Gasztronómia', 'Séta'],
      layoutType: 'standard',
      sortOrder: 2,
      iconName: 'MapPin',
    },
    {
      districtNumber: 7,
      isActive: true,
      title: '7. kerület - Eiffel-torony',
      subtitle: 'Az ikonikus negyed',
      description: 'Az Eiffel-torony, Invalidusok és az Orsay Múzeum. A legtöbb turista itt kezdi a párizsi kalandját.',
      highlights: ['Eiffel-torony', "Musée d'Orsay", 'Invalidusok', 'Champ de Mars'],
      mainAttraction: 'Az Eiffel-torony - Párizs ikonikus szimbóluma',
      localTips: 'A legjobb kilátás a Trocadéróról van. Kerüld a csúcsidőt (10-14 óra)!',
      bestFor: ['Turisták', 'Romantika', 'Fotózás'],
      layoutType: 'rich_ticket',
      sortOrder: 3,
      iconName: 'Star',
    },
    {
      districtNumber: 18,
      isActive: true,
      title: '18. kerület - Montmartre',
      subtitle: 'Bohém Párizs',
      description: 'A Sacré-Cœur bazilika, művészek tere és a Moulin Rouge otthona. A legikonikusabb negyed a művészet szerelmeseinek.',
      highlights: ['Sacré-Cœur', 'Place du Tertre', 'Moulin Rouge', 'Montmartre szőlőskert'],
      mainAttraction: 'Sacré-Cœur bazilika és a páratlan kilátás',
      localTips: 'Reggel érkezz, mielőtt megérkeznek a turistacsoportok. A funiculaire megspórolja a lépcsőzést!',
      bestFor: ['Művészet', 'Romantika', 'Kilátás'],
      layoutType: 'rich_ticket',
      sortOrder: 4,
      iconName: 'Sparkles',
    },
  ],
  styles: {
    map: {
      baseColor: '#ffffff',
      hoverColor: '#f5f5f4',
      activeColor: '#1e293b',
      strokeColor: '#cbd5e1',
      strokeWidth: 1,
      labelColor: '#64748b',
    },
    card: {
      backgroundColor: '#ffffff',
      headerGradientFrom: '#1e293b',
      headerGradientTo: '#334155',
      titleColor: '#ffffff',
      subtitleColor: '#cbd5e1',
      bodyTextColor: '#475569',
      accentColor: '#1e293b',
      borderColor: '#e7e5e4',
      borderRadius: 16,
      shadowIntensity: 'lg',
    },
    timeline: {
      lineColor: '#e7e5e4',
      lineColorActive: '#a8a29e',
      dotColorActive: '#1e293b',
      dotColorInactive: '#e7e5e4',
      dotSize: 16,
      labelColorActive: '#1e293b',
      labelColorInactive: '#94a3b8',
      pinColor: '#1e293b',
    },
    sectionBackground: '#FAF7F2',
    headingColor: '#0f172a',
    subheadingColor: '#64748b',
  },
  isActive: true,
})
