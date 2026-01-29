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
  // Opcionális árképzési mezők program szinten
  price?: number
  duration?: number
  max_persons?: number
  // Kapcsolók, hogy melyik mező jelenjen meg
  show_price?: boolean
  show_duration?: boolean
  show_max_persons?: boolean
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
