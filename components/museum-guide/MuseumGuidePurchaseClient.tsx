'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Landmark,
  Languages,
  Coins,
  Smartphone,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  Map,
} from 'lucide-react'

const PRICE_HUF = 4990
const PRICE_EUR = 12

const valueProps = [
  {
    icon: Languages,
    title: 'Magyar nyelvu',
    description: 'Az egyetlen magyar nyelven elerheto Louvre utikalauz.',
  },
  {
    icon: Coins,
    title: 'Sporolj penzt',
    description: 'Elo idegenvezetes 50-60€, ez mindossze ~12€.',
  },
  {
    icon: Smartphone,
    title: 'Interaktiv elmeny',
    description: 'Huzogathato kartyak, terkep, sztorik minden alkotashoz.',
  },
  {
    icon: Clock,
    title: 'Mindig elerheto',
    description: 'Hasznald barmikor, a sajat tempodban.',
  },
]

const includedFeatures = [
  '12-15 gondosan valogatott alkotas',
  'Reszletes sztorik es erdekessegek magyarul',
  'Beepitett Louvre terkep utvonallal',
  'Logikus utvonal — semmit nem hagysz ki',
  'Interaktiv, mobilon is tokeletes',
  'Korlátlan hasznalat, barmikor ujranézheto',
]

const sampleArtworks = [
  {
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: '1503-1519',
    gradient: 'linear-gradient(160deg, #E8DDD0 0%, #D4C9BC 40%, #C4B8A8 100%)',
  },
  {
    title: 'Szamothrake-i Nike',
    artist: 'Ismeretlen',
    year: 'Kr.e. ~190',
    gradient: 'linear-gradient(160deg, #D6DDE4 0%, #C4CDD6 40%, #B0BBC6 100%)',
  },
  {
    title: 'Miloi Venusz',
    artist: 'Alexandroszi Antiocheia',
    year: 'Kr.e. ~130-100',
    gradient: 'linear-gradient(160deg, #DDE4D6 0%, #C6D0BC 40%, #B4C0A8 100%)',
  },
]

export default function MuseumGuidePurchaseClient() {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setError('Kerlek, add meg a neved es email cimed!')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { data: purchase, error: insertError } = await supabase
        .from('museum_guide_purchases')
        .insert({
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone || null,
          amount: PRICE_EUR,
          payment_status: 'completed',
          notes: null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/museum-guide/purchase-success?order=${purchase.order_number}`)
    } catch (err: any) {
      setError(err.message || 'Hiba tortent a vasarlas soran.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block rounded-full bg-parisian-beige-100 px-4 py-1 text-sm font-medium text-parisian-beige-700">
          Digitalis Utikalauz
        </span>
        <h1 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl">
          Louvre Digitalis Utikalauz
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600">
          Az egyetlen magyar nyelvu interaktiv Louvre-kalauz. Fedezd fel a vilag leghiresebb
          muzeumat gondosan valogatott sztorikkal es egy logikus utvonallal.
        </p>
      </motion.div>

      {/* 2-column layout */}
      <div className="grid gap-10 lg:grid-cols-[1fr,400px]">
        {/* LEFT: Sales content */}
        <div>
          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="mb-6 font-playfair text-2xl font-bold text-parisian-grey-800">
              Miert erdemes?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {valueProps.map((prop, index) => (
                <div
                  key={prop.title}
                  className="flex items-start gap-4 rounded-xl border border-parisian-beige-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-parisian-beige-50">
                    <prop.icon className="h-5 w-5 text-parisian-beige-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-parisian-grey-800">{prop.title}</h3>
                    <p className="mt-1 text-sm text-parisian-grey-500">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="rounded-2xl border border-parisian-beige-200 bg-gradient-to-br from-white to-parisian-cream-50 p-6">
              <h2 className="mb-4 font-playfair text-xl font-bold text-parisian-grey-800">
                Osszehasonlitas
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                  <span className="text-sm text-red-700">Elo idegenvezetes (francia/angol)</span>
                  <span className="font-bold text-red-700">50-60 EUR</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-parisian-beige-50 p-3">
                  <span className="text-sm text-parisian-grey-600">Louvre belepo (18 ev felett)</span>
                  <span className="font-bold text-parisian-grey-700">22 EUR</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 border-2 border-green-200">
                  <span className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <Sparkles className="h-4 w-4" />
                    Digitalis Utikalauz (magyar)
                  </span>
                  <span className="font-bold text-green-700">{PRICE_HUF} Ft (~{PRICE_EUR} EUR)</span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-parisian-grey-500">
                Sporolj akár 40-50€-t, es meg magyarul is kapod!
              </p>
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="mb-6 font-playfair text-2xl font-bold text-parisian-grey-800">
              Mit tartalmaz?
            </h2>
            <ul className="mb-8 space-y-3">
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-parisian-grey-600">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Sample Artwork Preview */}
            <h3 className="mb-4 text-lg font-semibold text-parisian-grey-700">
              Pelda alkotasok a guide-bol:
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {sampleArtworks.map((artwork) => (
                <div
                  key={artwork.title}
                  className="overflow-hidden rounded-xl border border-parisian-beige-100 shadow-sm"
                >
                  <div
                    className="flex h-28 items-end p-3"
                    style={{ background: artwork.gradient }}
                  >
                    <Landmark className="h-6 w-6 text-white/30" />
                  </div>
                  <div className="bg-white p-3">
                    <p className="font-playfair font-bold text-parisian-grey-800 text-sm">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-parisian-grey-500">
                      {artwork.artist} &middot; {artwork.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Sticky Purchase Form */}
        <div>
          <div className="sticky top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border-2 border-parisian-beige-200 bg-white p-6 shadow-xl"
            >
              {/* Price display */}
              <div className="mb-6 border-b border-parisian-beige-100 pb-6 text-center">
                <p className="text-sm text-parisian-grey-500">Egyszeri vasarlas</p>
                <p className="font-playfair text-4xl font-bold text-parisian-grey-800">
                  {PRICE_HUF.toLocaleString('hu-HU')} Ft
                </p>
                <p className="text-sm text-parisian-grey-400">~{PRICE_EUR} EUR</p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Korlátlan hasznalat
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-playfair text-xl font-bold text-parisian-grey-800">
                  Megvasarlas
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Teljes nev *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kovacs Peter"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email cim *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pelda@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonszam (opcionalis)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+36 20 123 4567"
                  />
                </div>

                {/* Mock card form */}
                <div className="space-y-3 rounded-lg border border-parisian-beige-100 bg-parisian-cream-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-parisian-grey-500">
                    <CreditCard className="h-4 w-4" />
                    <span>Kartyaadatok (demo)</span>
                    <Lock className="ml-auto h-3 w-3" />
                  </div>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                    />
                    <Input
                      placeholder="CVC"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                    />
                  </div>
                </div>

                {/* Price summary */}
                <div className="rounded-lg bg-parisian-beige-50 p-4">
                  <div className="flex justify-between text-sm text-parisian-grey-600">
                    <span>Louvre Digitalis Utikalauz</span>
                    <span className="font-bold text-parisian-grey-800">{PRICE_HUF.toLocaleString('hu-HU')} Ft</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-parisian-grey-800 hover:bg-parisian-grey-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Feldolgozas...
                    </>
                  ) : (
                    <>
                      Megvasarlas — {PRICE_HUF.toLocaleString('hu-HU')} Ft
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-parisian-grey-400">
                  A vasarlas utan azonnal hozzafersz az utikalauzhoz.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
