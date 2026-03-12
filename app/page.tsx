import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/NavigationWrapper'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ParisFlashcardsPromoSection from '@/components/sections/ParisFlashcardsPromoSection'
import ParisDistrictGuide from '@/components/sections/ParisDistrictGuide'
import MuseumGuidePromoSection from '@/components/sections/MuseumGuidePromoSection'
import WalkingToursSection from '@/components/sections/WalkingToursSection'
import LouvreToursSection from '@/components/sections/LouvreToursSection'
import BlogSection from '@/components/sections/BlogSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import NewsletterSection from '@/components/sections/NewsletterSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import BoatTourModal from '@/components/BoatTourModal'
import type { Profile, Post, LouvreTour } from '@/lib/types/database'
import { defaultLandingPageSettings, DEFAULT_SECTION_ORDER, type LandingPageSettings } from '@/lib/types/landing-page'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient()

  // Fetch data from Supabase
  const { data: profile } = await supabase.from('profile').select('*').single()

  // Fetch latest 3 published blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  // Fetch static texts
  const { data: staticTexts } = await supabase.from('site_text_content').select('*')
  const textsMap: Record<string, string> = {}
  staticTexts?.forEach((item: any) => {
    textsMap[item.key] = item.value || ''
  })

  // Fetch all upcoming walking tours for calendar
  const today = new Date().toISOString().split('T')[0]
  const { data: upcomingWalkingTours } = await supabase
    .from('walking_tours')
    .select('*')
    .eq('status', 'published')
    .gte('tour_date', today)
    .order('tour_date', { ascending: true })

  // Fetch calendar settings
  const { data: calendarSettings } = await supabase
    .from('walking_tour_calendar_settings')
    .select('settings')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch published interactive tours (louvre_tours)
  const { data: publishedTours } = await supabase
    .from('louvre_tours')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  // Fetch first published bundle slug for the flashcards promo section
  const { data: firstBundle } = await supabase
    .from('bundles')
    .select('slug')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  // Fetch landing page settings (page builder)
  const { data: landingPageRow } = await supabase
    .from('landing_page_settings')
    .select('settings')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Merge saved settings with defaults
  let pageSettings = defaultLandingPageSettings
  if (landingPageRow?.settings) {
    const saved = landingPageRow.settings as any
    const merged = { ...defaultLandingPageSettings } as any
    // Handle sectionOrder (array) separately
    if (Array.isArray(saved.sectionOrder)) {
      merged.sectionOrder = saved.sectionOrder
    }
    for (const key of Object.keys(defaultLandingPageSettings)) {
      if (key === 'sectionOrder') continue // already handled
      if (saved[key]) {
        merged[key] = { ...(defaultLandingPageSettings as any)[key], ...saved[key] }
      }
    }
    pageSettings = merged as LandingPageSettings
  }

  const profileData = profile as Profile | null
  const postsData = (posts as Post[]) || []
  const testimonialsData = testimonials || []
  const toursData = (publishedTours as LouvreTour[]) || []
  const sectionOrder = pageSettings.sectionOrder || DEFAULT_SECTION_ORDER

  // Section renderer — maps each key to its component
  function renderSection(key: string) {
    const ps = pageSettings as any
    if (!ps[key]?.visible) return null

    switch (key) {
      case 'hero':
        return (
          <HeroSection
            key={key}
            headline={profileData?.hero_title}
            subheadline={profileData?.hero_subtitle}
            ctaText={profileData?.hero_cta_text}
            backgroundImage={profileData?.hero_background_image}
            pageSettings={pageSettings.hero}
          />
        )
      case 'about':
        return (
          <AboutSection
            key={key}
            title={profileData?.about_title}
            description={profileData?.about_description}
            image={profileData?.about_image}
            pageSettings={pageSettings.about}
          />
        )
      case 'services':
        return (
          <ServicesSection
            key={key}
            groupBookingTitle={textsMap.services_group_booking_title}
            groupBookingDescription={textsMap.services_group_booking_description}
            groupBookingButtonText={textsMap.services_group_booking_button}
            customOfferText={textsMap.services_custom_offer_text}
            customOfferButtonText={textsMap.services_custom_offer_button}
            pageSettings={pageSettings.services}
          />
        )
      case 'walkingTours':
        return (
          <WalkingToursSection key={key} tours={upcomingWalkingTours || []} calendarSettings={calendarSettings?.settings || null} />
        )
      case 'louvreTour':
        return (
          <LouvreToursSection key={key} tours={toursData} pageSettings={pageSettings.louvreTour} />
        )
      case 'flashcardsPromo':
        return (
          <ParisFlashcardsPromoSection key={key} pageSettings={pageSettings.flashcardsPromo} bundleSlug={firstBundle?.slug} />
        )
      case 'parisDistrictGuide':
        return <ParisDistrictGuide key={key} />
      case 'museumGuidePromo':
        return (
          <MuseumGuidePromoSection key={key} pageSettings={pageSettings.museumGuidePromo} />
        )
      case 'testimonials':
        return (
          <TestimonialsSection
            key={key}
            title={textsMap.testimonials_title}
            subtitle={textsMap.testimonials_subtitle}
            testimonials={testimonialsData}
            pageSettings={pageSettings.testimonials}
          />
        )
      case 'blog':
        return (
          <BlogSection key={key} posts={postsData} pageSettings={pageSettings.blog} />
        )
      case 'contact':
        return (
          <ContactSection
            key={key}
            email={profileData?.contact_email}
            phone={profileData?.contact_phone}
            title={textsMap.contact_title}
            subtitle={textsMap.contact_subtitle}
            locationLabel={textsMap.contact_location_label}
            locationValue={textsMap.contact_location_value}
            availabilityTitle={textsMap.contact_availability_title}
            formTitle={textsMap.contact_form_title}
            formNameLabel={textsMap.contact_form_name_label}
            formEmailLabel={textsMap.contact_form_email_label}
            formMessageLabel={textsMap.contact_form_message_label}
            formButtonText={textsMap.contact_form_button_text}
            formButtonSending={textsMap.contact_form_button_sending}
            quoteText={textsMap.contact_quote_text}
            quoteAuthor={textsMap.contact_quote_author}
            pageSettings={pageSettings.contact}
          />
        )
      case 'newsletter':
        return (
          <NewsletterSection key={key} pageSettings={pageSettings.newsletter} />
        )
      case 'footer':
        return (
          <Footer key={key} staticTexts={textsMap} pageSettings={pageSettings.footer} />
        )
      case 'boatTour':
        return <BoatTourModal key={key} />
      default:
        return null
    }
  }

  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      {sectionOrder.map((key) => renderSection(key))}
    </main>
  )
}
