import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
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
import type { Profile, Post } from '@/lib/types/database'
import { defaultLandingPageSettings, type LandingPageSettings } from '@/lib/types/landing-page'

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
    for (const key of Object.keys(defaultLandingPageSettings)) {
      if (saved[key]) {
        merged[key] = { ...(defaultLandingPageSettings as any)[key], ...saved[key] }
      }
    }
    pageSettings = merged as LandingPageSettings
  }

  const profileData = profile as Profile | null
  const postsData = (posts as Post[]) || []
  const testimonialsData = testimonials || []

  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      {pageSettings.hero.visible && (
        <HeroSection
          headline={profileData?.hero_title}
          subheadline={profileData?.hero_subtitle}
          ctaText={profileData?.hero_cta_text}
          backgroundImage={profileData?.hero_background_image}
          pageSettings={pageSettings.hero}
        />
      )}
      {pageSettings.about.visible && (
        <AboutSection
          title={profileData?.about_title}
          description={profileData?.about_description}
          image={profileData?.about_image}
          pageSettings={pageSettings.about}
        />
      )}
      {pageSettings.services.visible && (
        <ServicesSection
          groupBookingTitle={textsMap.services_group_booking_title}
          groupBookingDescription={textsMap.services_group_booking_description}
          groupBookingButtonText={textsMap.services_group_booking_button}
          customOfferText={textsMap.services_custom_offer_text}
          customOfferButtonText={textsMap.services_custom_offer_button}
          pageSettings={pageSettings.services}
        />
      )}
      {pageSettings.walkingTours.visible && (
        <WalkingToursSection tours={upcomingWalkingTours || []} calendarSettings={calendarSettings?.settings || null} />
      )}
      {pageSettings.louvreTour.visible && (
        <LouvreToursSection pageSettings={pageSettings.louvreTour} />
      )}
      {process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS === 'true' && pageSettings.flashcardsPromo.visible && (
        <ParisFlashcardsPromoSection pageSettings={pageSettings.flashcardsPromo} />
      )}
      {pageSettings.parisDistrictGuide.visible && <ParisDistrictGuide />}
      {pageSettings.museumGuidePromo.visible && (
        <MuseumGuidePromoSection pageSettings={pageSettings.museumGuidePromo} />
      )}
      {pageSettings.testimonials.visible && (
        <TestimonialsSection
          title={textsMap.testimonials_title}
          subtitle={textsMap.testimonials_subtitle}
          testimonials={testimonialsData}
          pageSettings={pageSettings.testimonials}
        />
      )}
      {pageSettings.blog.visible && (
        <BlogSection posts={postsData} pageSettings={pageSettings.blog} />
      )}
      {pageSettings.contact.visible && (
        <ContactSection
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
      )}
      {pageSettings.newsletter.visible && (
        <NewsletterSection pageSettings={pageSettings.newsletter} />
      )}
      {pageSettings.footer.visible && (
        <Footer staticTexts={textsMap} pageSettings={pageSettings.footer} />
      )}
      {pageSettings.boatTour.visible && <BoatTourModal />}
    </main>
  )
}
