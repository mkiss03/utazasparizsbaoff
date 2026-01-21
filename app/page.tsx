import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ParisFlashcardsPromoSection from '@/components/sections/ParisFlashcardsPromoSection'
import MetroGuideSection from '@/components/sections/MetroGuideSection'
import BlogSection from '@/components/sections/BlogSection'
import NewsletterSection from '@/components/sections/NewsletterSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import type { Profile, Post } from '@/lib/types/database'

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

  // Fetch static texts
  const { data: staticTexts } = await supabase.from('site_text_content').select('*')
  const textsMap: Record<string, string> = {}
  staticTexts?.forEach((item: any) => {
    textsMap[item.key] = item.value || ''
  })

  const profileData = profile as Profile | null
  const postsData = (posts as Post[]) || []

  return (
    <main className="relative bg-parisian-cream-50">
      <Navigation />
      <HeroSection
        headline={profileData?.hero_title}
        subheadline={profileData?.hero_subtitle}
        ctaText={profileData?.hero_cta_text}
        backgroundImage={profileData?.hero_background_image}
      />
      <AboutSection
        title={profileData?.about_title}
        description={profileData?.about_description}
        image={profileData?.about_image}
      />
      <ServicesSection />
      {process.env.NEXT_PUBLIC_ENABLE_FLASHCARDS === 'true' && (
        <ParisFlashcardsPromoSection />
      )}
      <MetroGuideSection />
      <BlogSection posts={postsData} />
      <ContactSection
        email={profileData?.contact_email}
        phone={profileData?.contact_phone}
        title={textsMap.contact_title}
        subtitle={textsMap.contact_subtitle}
        locationLabel={textsMap.contact_location_label}
        locationValue={textsMap.contact_location_value}
      />
      <NewsletterSection />
      <Footer staticTexts={textsMap} />
    </main>
  )
}
