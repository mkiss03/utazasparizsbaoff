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
    badgeText: 'Utazas Parizsba',
    ctaLink: '#services',
    floatingBadge1Title: 'Teljes koru szervezes',
    floatingBadge1Subtitle: 'Minden reszlet egy helyen',
    floatingBadge2Title: 'Tobb eves tapasztalat',
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
    sectionBadge: 'Rolam',
    offerCardsTitle: 'Amit kinalok',
    offerCard1Title: 'Szemelyre szabott elmenyek',
    offerCard1Description: 'Minden tura az erdeklodesedre es tempodra van szabva, legyen szo muveszetrol, gasztromiarol vagy tortenelmrol.',
    offerCard2Title: 'Helyi insider tudas',
    offerCard2Description: 'Megmutatom azokat a helyeket, amiket csak a helyiek ismernek -- autentikus kavezokat, rejtett udvarokat es varazslatos utcakat.',
    offerCard3Title: 'Gondtalan elmeny',
    offerCard3Description: 'Teljes koru szervezestol kezdve a praktikus tippekig -- minden reszletre figyelek, hogy te csak elvezd Parizst.',
    stat1Value: '10+',
    stat1Label: 'ev Parizsban',
    stat2Value: '1000+',
    stat2Label: 'elegedett vendeg',
    stat3Value: '',
    stat3Label: 'Licencelt idegenvezetes',
    quoteText: 'Parizs mindig jo otlet -- es szeretnem, ha a te parizsi elmenyeid felejthetetlenek lennenek.',
    quoteAuthor: '-- Viktoria',
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
    sectionBadge: 'Mit kinalunk',
    title: 'Szolgaltatasok',
    subtitle: 'Kattints a kartyakra a reszletes informaciokert',
    sectionBadgeBgColor: '#F5EDE4',
    sectionBadgeTextColor: '#4A4A4A',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
  },
  walkingTours: {
    visible: true,
    description: 'Setaturaink naptarbol foglalhatok. A reszletes beallitasok az Admin > Setaturak menuben erhetok el.',
  },
  flashcardsPromo: {
    visible: true,
    sectionBadge: 'Parizs Tematikus Csomagok',
    title: 'Varos Utmutato Flashcardok',
    subtitle: 'Sajatitsd el Parizst az interaktiv flashcard csomagjainkkal. Tanulj helyi kifejezeseket, metroterkepreket, kulturalis tippeket es meg sok mast!',
    cardTitle: 'Parizs',
    cardSubtitle: 'Nyelvtanulasi csomag',
    cardDescription: 'Fedezd fel az osszes Parizs-specifikus tanulasi temakorot. Demo kartyakat megtekinthetsz ingyenesen, az osszes tobbi utan pedig szukseges egy Varos Pass.',
    feature1: 'Tobb temakor',
    feature2: 'Demo kartyak mindenki szamara',
    feature3: 'Pass utan teljes hozzaferes',
    ctaText: 'Temakarak megtekintese',
    bottomTitle: 'Mas varosok erdekelnek?',
    bottomDescription: 'Fedezd fel a tanulasi csomagokat mas nagyvarosok szamara is.',
    bottomCtaText: 'Osszes varos megtekintese',
    headerGradientFrom: '#C4A882',
    headerGradientTo: '#B09672',
  },
  parisDistrictGuide: {
    visible: true,
    description: 'A Parizsi Keruleti Utmutato tartalma az Admin > Keruleti Utmutato menubol szerkesztheto.',
  },
  museumGuidePromo: {
    visible: true,
    sectionBadge: 'Digitalis Utikalauz',
    title: 'Louvre Digitalis Utikalauz',
    subtitle: 'Az egyetlen magyar nyelvu interaktiv Louvre-kalauz. Gondosan valogatott alkotasok, lenyugozo sztorik, utvonalterv -- mindezt a zsebedben.',
    valueProp1Title: 'Magyar nyelven',
    valueProp1Description: 'Az egyetlen magyar nyelven elerheto interaktiv Louvre utikalauz.',
    valueProp2Title: 'Sporolj penzt',
    valueProp2Description: 'Elo idegenvezetes 50-60€, a belepo mindossze 22€ -- a digitalis guide melle.',
    valueProp3Title: 'Interaktiv elmeny',
    valueProp3Description: 'Huzogathato kartyak, beepitett terkep, lenyugozo sztorik minden alkotashoz.',
    valueProp4Title: 'Mindig elerheto',
    valueProp4Description: 'Nincs idopont-egyeztetes -- hasznald barmikor, a sajat tempodban.',
    promoCardTitle: 'Fedezd fel a Louvre kincseit',
    promoCardSubtitle: 'Interaktiv kartyak, terkep, sztorik',
    promoCardDescription: '12-15 gondosan valogatott alkotas, mindegyikhez lenyugozo sztori es erdekes teny. Logikus utvonal a Louvre-ban, hogy semmit ne hagyj ki.',
    promoFeature1: 'Interaktiv, lapozgathato kartyak',
    promoFeature2: 'Beepitett Louvre terkep utvonallal',
    promoFeature3: 'Teljes egeszeben magyarul',
    promoCtaText: 'Kiprobalom ingyen',
    purchaseCtaText: 'Utikalauz megvasarlasa -- 4 990 Ft',
    purchaseNote: 'Egyszeri vasarlas, korlátlan hasznalat',
    promoHeaderGradientFrom: '#1a1a2e',
    promoHeaderGradientTo: '#2d2d44',
  },
  testimonials: {
    visible: true,
    // DB-sourced fields (site_text_content table) — empty so DB values show through
    title: '',
    subtitle: '',
    // Page builder only fields — keep defaults
    ctaText: 'Legyel Te is a kovetkezo elegedett vendegunk!',
    ctaButtonText: 'Foglalj most',
    titleColor: '#1F2937',
    subtitleColor: '#6B7280',
  },
  blog: {
    visible: true,
    title: 'Parizsi Naplo',
    subtitle: 'Fedezd fel a varos titkait, torteneteit es varazslatos pillanatait',
    readMoreText: 'Tovabb olvasom',
    viewAllButtonText: 'Osszes bejegyzes',
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
    title: 'Maradj Kapcsolatban',
    description: 'Iratkozz fel, hogy ne maradj le a legujabb parizsi programokrol, rejtett kincsekrol es exkluziv ajanlataokrol!',
    ctaButtonText: 'Feliratkozas',
    feature1: 'Exkluziv tura ajanlatok',
    feature2: 'Parizsi insider tippek',
    feature3: 'Havonta 1-2 email',
    sectionBgColor: '#FAF7F2',
    titleColor: '#0F172A',
  },
  boatTour: {
    visible: true,
    description: 'A hajozas varazslo tartalma az Admin > Hajozas Varazslo menubol szerkesztheto.',
  },
  footer: {
    visible: true,
    brandTitle: 'Utazas',
    brandHighlight: 'Parizsba',
    tagline: 'Hivatalos idegenvezetoe es utazasszervezoe Parizsban',
    description: 'Fedezze fel Parizs varazslatos titkait egy tapasztalt magyar idegenvezetoel.',
    registrationNumber: 'Nyilvantartasi szam: 250065',
    siret: 'SIRET: 94822714500018',
    siren: 'SIREN: 948 227 145',
    contactEmail: 'viktoria.szeidl@gmail.com',
    contactPhone: '+33 6 12 34 56 78',
    facebookUrl: '',
    servicesTitle: 'Szolgaltatasok:',
    service1: 'Varosnezo setak',
    service2: 'Programszervezes',
    service3: 'Transzferek',
    copyrightText: 'Szeidl Viktoria',
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
