// ============================================
// LANDING PAGE SETTINGS — Visual Page Builder
// ============================================

// === HERO SECTION ===
export interface HeroSectionSettings {
  visible: boolean
  badgeText: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
  floatingBadge1Title: string
  floatingBadge1Subtitle: string
  floatingBadge2Title: string
  badgeBgColor: string
  badgeTextColor: string
  ctaBgColor: string
  ctaTextColor: string
}

// === ABOUT SECTION ===
export interface AboutSectionSettings {
  visible: boolean
  sectionBadge: string
  title: string
  description: string
  aboutImage: string
  offerCardsTitle: string
  offerCard1Title: string
  offerCard1Description: string
  offerCard2Title: string
  offerCard2Description: string
  offerCard3Title: string
  offerCard3Description: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
  quoteText: string
  quoteAuthor: string
  sectionBadgeBgColor: string
  sectionBadgeTextColor: string
  titleColor: string
  statValueColor: string
}

// === SERVICES SECTION ===
export interface ServicesSectionSettings {
  visible: boolean
  sectionBadge: string
  title: string
  subtitle: string
  groupBookingTitle: string
  groupBookingDescription: string
  groupBookingButtonText: string
  customOfferText: string
  customOfferButtonText: string
  sectionBadgeBgColor: string
  sectionBadgeTextColor: string
  titleColor: string
  subtitleColor: string
}

// === WALKING TOURS SECTION ===
export interface WalkingToursSettings {
  visible: boolean
  description: string
}

// === PARIS DISTRICT GUIDE SECTION ===
export interface ParisDistrictGuideSettings {
  visible: boolean
  description: string
}

// === LOUVRE TOUR SECTION ===
export interface LouvreTourSectionSettings {
  visible: boolean
  sectionBadge: string
  sectionBadgeBgColor: string
  sectionBadgeTextColor: string
  title: string
  subtitle: string
  titleColor: string
  subtitleColor: string
  accentColor: string
  timelineColor: string
  cardBgColor: string
  wingBadgeBgColor: string
  wingBadgeTextColor: string
}

// === BOAT TOUR MODAL ===
export interface BoatTourSettings {
  visible: boolean
  description: string
}

// === FLASHCARDS PROMO SECTION ===
export interface FlashcardsPromoSettings {
  visible: boolean
  sectionBadge: string
  title: string
  subtitle: string
  cardTitle: string
  cardSubtitle: string
  cardDescription: string
  feature1: string
  feature2: string
  feature3: string
  ctaText: string
  bottomTitle: string
  bottomDescription: string
  bottomCtaText: string
  headerGradientFrom: string
  headerGradientTo: string
}

// === MUSEUM GUIDE PROMO SECTION ===
export interface MuseumGuidePromoSettings {
  visible: boolean
  sectionBadge: string
  title: string
  subtitle: string
  valueProp1Title: string
  valueProp1Description: string
  valueProp2Title: string
  valueProp2Description: string
  valueProp3Title: string
  valueProp3Description: string
  valueProp4Title: string
  valueProp4Description: string
  promoCardTitle: string
  promoCardSubtitle: string
  promoCardDescription: string
  promoFeature1: string
  promoFeature2: string
  promoFeature3: string
  promoCtaText: string
  purchaseCtaText: string
  purchaseNote: string
  promoHeaderGradientFrom: string
  promoHeaderGradientTo: string
}

// === TESTIMONIALS SECTION ===
export interface TestimonialsSectionSettings {
  visible: boolean
  title: string
  subtitle: string
  ctaText: string
  ctaButtonText: string
  titleColor: string
  subtitleColor: string
}

// === BLOG SECTION ===
export interface BlogSectionSettings {
  visible: boolean
  title: string
  subtitle: string
  readMoreText: string
  viewAllButtonText: string
  titleColor: string
  subtitleColor: string
}

// === CONTACT SECTION ===
export interface ContactSectionSettings {
  visible: boolean
  title: string
  subtitle: string
  locationLabel: string
  locationValue: string
  availabilityTitle: string
  formTitle: string
  formNameLabel: string
  formEmailLabel: string
  formMessageLabel: string
  formButtonText: string
  formButtonSending: string
  quoteText: string
  quoteAuthor: string
  titleColor: string
}

// === NEWSLETTER SECTION ===
export interface NewsletterSectionSettings {
  visible: boolean
  title: string
  description: string
  ctaButtonText: string
  feature1: string
  feature2: string
  feature3: string
  sectionBgColor: string
  titleColor: string
}

// === FOOTER ===
export interface FooterSettings {
  visible: boolean
  brandTitle: string
  brandHighlight: string
  tagline: string
  description: string
  registrationNumber: string
  siret: string
  siren: string
  contactEmail: string
  contactPhone: string
  facebookUrl: string
  servicesTitle: string
  service1: string
  service2: string
  service3: string
  copyrightText: string
  bgColor: string
  accentColor: string
}

// === MASTER SETTINGS ===
export interface LandingPageSettings {
  hero: HeroSectionSettings
  about: AboutSectionSettings
  services: ServicesSectionSettings
  walkingTours: WalkingToursSettings
  louvreTour: LouvreTourSectionSettings
  flashcardsPromo: FlashcardsPromoSettings
  parisDistrictGuide: ParisDistrictGuideSettings
  museumGuidePromo: MuseumGuidePromoSettings
  testimonials: TestimonialsSectionSettings
  blog: BlogSectionSettings
  contact: ContactSectionSettings
  newsletter: NewsletterSectionSettings
  footer: FooterSettings
  boatTour: BoatTourSettings
}

// ============================================
// DEFAULT VALUES (current hardcoded values)
// ============================================

export const defaultLandingPageSettings: LandingPageSettings = {
  hero: {
    visible: true,
    // DB-sourced fields (profile table) — empty so DB values show through
    headline: '',
    subheadline: '',
    ctaText: '',
    backgroundImage: '',
    // Page builder only fields — keep defaults
    badgeText: 'Utazás Párizsba',
    ctaLink: '#services',
    floatingBadge1Title: 'Teljes körű szervezés',
    floatingBadge1Subtitle: 'Minden részlet egy helyen',
    floatingBadge2Title: 'Több éves tapasztalat',
    badgeBgColor: '#F5EDE4',
    badgeTextColor: '#4A4A4A',
    ctaBgColor: '#C4A882',
    ctaTextColor: '#FFFFFF',
  },
  about: {
    visible: true,
    // DB-sourced fields (profile table) — empty so DB values show through
    title: '',
    description: '',
    aboutImage: '',
    // Page builder only fields — keep defaults (no DB source for these)
    sectionBadge: 'Rólam',
    offerCardsTitle: 'Amit kínálok',
    offerCard1Title: 'Személyre szabott élmények',
    offerCard1Description: 'Minden túra az érdeklődésedre és tempódra van szabva, legyen szó művészetről, gasztronómiáról vagy történelemről.',
    offerCard2Title: 'Helyi insider tudás',
    offerCard2Description: 'Megmutatom azokat a helyeket, amiket csak a helyiek ismernek – autentikus kávézókat, rejtett udvarokat és varázslatos utcákat.',
    offerCard3Title: 'Gondtalan élmény',
    offerCard3Description: 'Teljes körű szervezéstől kezdve a praktikus tippekig – minden részletre figyelek, hogy te csak élvezd Párizst.',
    stat1Value: '10+',
    stat1Label: 'év Párizsban',
    stat2Value: '1000+',
    stat2Label: 'elégedett vendég',
    stat3Value: '⭐',
    stat3Label: 'Licencelt idegenvezetés',
    quoteText: 'Párizs mindig jó ötlet – és szeretném, ha a te párizsi élményeid felejthetetlenek lennének.',
    quoteAuthor: '— Viktória',
    sectionBadgeBgColor: '#F5EDE4',
    sectionBadgeTextColor: '#4A4A4A',
    titleColor: '#1F2937',
    statValueColor: '#C4A882',
  },
  services: {
    visible: true,
    // DB-sourced fields (site_text_content table) — empty so DB values show through
    groupBookingTitle: '',
    groupBookingDescription: '',
    groupBookingButtonText: '',
    customOfferText: '',
    customOfferButtonText: '',
    // Page builder only fields — keep defaults
    sectionBadge: 'Mit kínálunk',
    title: 'Szolgáltatások',
    subtitle: 'Kattints a kártyákra a részletes információkért',
    sectionBadgeBgColor: '#F5EDE4',
    sectionBadgeTextColor: '#4A4A4A',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
  },
  walkingTours: {
    visible: true,
    description: 'Sétatúráink naptárból foglalhatók. A részletes beállítások az Admin > Sétatúrák menüben érhetők el.',
  },
  louvreTour: {
    visible: true,
    sectionBadge: 'Múzeumi Túra',
    sectionBadgeBgColor: '#EDE9FE',
    sectionBadgeTextColor: '#7C3AED',
    title: 'Louvre – Mesterművek időutazása',
    subtitle: 'Fedezd fel a világ legnagyobb múzeumát egy gondosan megtervezett, 3 órás útvonallal',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
    accentColor: '#7C3AED',
    timelineColor: '#7C3AED',
    cardBgColor: '#FFFFFF',
    wingBadgeBgColor: '#F3F4F6',
    wingBadgeTextColor: '#4B5563',
  },
  flashcardsPromo: {
    visible: true,
    sectionBadge: 'Párizs Tematikus Csomagok',
    title: 'Város Útmutató Flashcardok',
    subtitle: 'Sajátítsd el Párizst az interaktív flashcard csomagjainkkal. Tanulj helyi kifejezéseket, metrótérkép-reket, kulturális tippeket és még sok mást!',
    cardTitle: 'Párizs',
    cardSubtitle: 'Nyelvtanulási csomag',
    cardDescription: 'Fedezd fel az összes Párizs-specifikus tanulási témakört. Demo kártyákat megtekinthetsz ingyenesen, az összes többi után pedig szükséges egy Város Pass.',
    feature1: 'Több témakör',
    feature2: 'Demo kártyák mindenki számára',
    feature3: 'Pass után teljes hozzáférés',
    ctaText: 'Témakörök megtekintése',
    bottomTitle: 'Más városok érdekelnek?',
    bottomDescription: 'Fedezd fel a tanulási csomagokat más nagyvárosok számára is.',
    bottomCtaText: 'Összes város megtekintése',
    headerGradientFrom: '#C4A882',
    headerGradientTo: '#B09672',
  },
  parisDistrictGuide: {
    visible: true,
    description: 'A Párizsi Kerületi Útmutató tartalma az Admin > Kerületi Útmutató menüből szerkeszthető.',
  },
  museumGuidePromo: {
    visible: true,
    sectionBadge: 'Digitális Útikalauz',
    title: 'Louvre Digitális Útikalauz',
    subtitle: 'Az egyetlen magyar nyelvű interaktív Louvre-kalauz. Gondosan válogatott alkotások, lenyűgöző sztorik, útvonalterv – mindezt a zsebedben.',
    valueProp1Title: 'Magyar nyelven',
    valueProp1Description: 'Az egyetlen magyar nyelven elérhető interaktív Louvre útikalauz.',
    valueProp2Title: 'Spórolj pénzt',
    valueProp2Description: 'Élő idegenvezetés 50-60€, a belépő mindössze 22€ – a digitális guide mellé.',
    valueProp3Title: 'Interaktív élmény',
    valueProp3Description: 'Húzogatható kártyák, beépített térkép, lenyűgöző sztorik minden alkotáshoz.',
    valueProp4Title: 'Mindig elérhető',
    valueProp4Description: 'Nincs időpont-egyeztetés – használd bármikor, a saját tempódban.',
    promoCardTitle: 'Fedezd fel a Louvre kincseit',
    promoCardSubtitle: 'Interaktív kártyák, térkép, sztorik',
    promoCardDescription: '12-15 gondosan válogatott alkotás, mindegyikhez lenyűgöző sztori és érdekes tény. Logikus útvonal a Louvre-ban, hogy semmit ne hagyj ki.',
    promoFeature1: 'Interaktív, lapozgatható kártyák',
    promoFeature2: 'Beépített Louvre térkép útvonallal',
    promoFeature3: 'Teljes egészében magyarul',
    promoCtaText: 'Kipróbálom ingyen',
    purchaseCtaText: 'Útikalauz megvásárlása – 4 990 Ft',
    purchaseNote: 'Egyszeri vásárlás, korlátlan használat',
    promoHeaderGradientFrom: '#1a1a2e',
    promoHeaderGradientTo: '#2d2d44',
  },
  testimonials: {
    visible: true,
    // DB-sourced fields (site_text_content table) — empty so DB values show through
    title: '',
    subtitle: '',
    // Page builder only fields — keep defaults
    ctaText: 'Legyél Te is a következő elégedett vendégünk!',
    ctaButtonText: 'Foglalj most',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
  },
  blog: {
    visible: true,
    title: 'Párizsi Napló',
    subtitle: 'Fedezd fel a város titkait, történeteit és varázslatos pillanatait',
    readMoreText: 'Tovább olvasom',
    viewAllButtonText: 'Összes bejegyzés',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
  },
  contact: {
    visible: true,
    // DB-sourced fields (site_text_content table) — empty so DB values show through
    title: '',
    subtitle: '',
    locationLabel: '',
    locationValue: '',
    availabilityTitle: '',
    formTitle: '',
    formNameLabel: '',
    formEmailLabel: '',
    formMessageLabel: '',
    formButtonText: '',
    formButtonSending: '',
    quoteText: '',
    quoteAuthor: '',
    // Page builder only fields — keep defaults
    titleColor: '#1F2937',
  },
  newsletter: {
    visible: true,
    title: 'Személyes üzenet Párizsból',
    description: 'Havonta egy levélnyi inspiráció: elfeledett legendák, rejtett kincsek és a város örök lüktetése. Iratkozz fel hírlevelünkre, hogy ne maradj le a legújabb párizsi programokról és exkluzív ajánlatokról!',
    ctaButtonText: 'Feliratkozás',
    feature1: 'Exkluzív túra ajánlatok',
    feature2: 'Párizsi insider tippek',
    feature3: 'Havonta 1-2 email',
    sectionBgColor: '#FAF7F2',
    titleColor: '#0F172A',
  },
  boatTour: {
    visible: true,
    description: 'A hajózás varázsló tartalma az Admin > Hajózás Varázsló menüből szerkeszthető.',
  },
  footer: {
    visible: true,
    brandTitle: 'Utazás',
    brandHighlight: 'Párizsba',
    tagline: 'Hivatalos idegenvezető és utazásszervező Párizsban',
    description: 'Párizs ahogy kevesen ismerik – élményekkel, titkokkal és tapasztalt magyar nyelvű idegenvezetővel',
    registrationNumber: 'Nyilvántartási szám: 250065',
    siret: 'SIRET: 94822714500018',
    siren: 'SIREN: 948 227 145',
    contactEmail: 'utazasparizsba@gmail.com',
    contactPhone: '+33 7 53 14 50 35',
    facebookUrl: '',
    servicesTitle: 'Szolgáltatások:',
    service1: 'Városnéző séták',
    service2: 'Utazástervezés',
    service3: 'Transzferszolgáltatás',
    copyrightText: 'Szeidl Viktória',
    bgColor: '#1F2937',
    accentColor: '#C4A882',
  },
}

// ============================================
// SECTION METADATA (for the editor UI)
// ============================================

export const SECTION_META = [
  { key: 'hero', label: 'Hero szekció', icon: 'Image' },
  { key: 'about', label: 'Rólam', icon: 'User' },
  { key: 'services', label: 'Szolgáltatások', icon: 'Briefcase' },
  { key: 'walkingTours', label: 'Sétatúrák', icon: 'Footprints' },
  { key: 'louvreTour', label: 'Louvre Túra', icon: 'Landmark' },
  { key: 'flashcardsPromo', label: 'Flashcards Promo', icon: 'BookOpen' },
  { key: 'parisDistrictGuide', label: 'Kerületi Útmutató', icon: 'Map' },
  { key: 'museumGuidePromo', label: 'Múzeum Guide Promo', icon: 'Landmark' },
  { key: 'testimonials', label: 'Vélemények', icon: 'Star' },
  { key: 'blog', label: 'Blog', icon: 'FileText' },
  { key: 'contact', label: 'Kapcsolat', icon: 'Mail' },
  { key: 'newsletter', label: 'Hírlevél', icon: 'Bell' },
  { key: 'footer', label: 'Lábléc', icon: 'LayoutTemplate' },
  { key: 'boatTour', label: 'Hajózás', icon: 'Ship' },
] as const
