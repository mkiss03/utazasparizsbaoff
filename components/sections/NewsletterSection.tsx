'use client'

import { motion } from 'framer-motion'
import NewsletterForm from '@/components/NewsletterForm'
import { Mail, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { NewsletterSectionSettings } from '@/lib/types/landing-page'

interface NewsletterSectionProps {
  pageSettings?: NewsletterSectionSettings
}

export default function NewsletterSection({ pageSettings: ps }: NewsletterSectionProps = {}) {
  const [content, setContent] = useState({
    title: ps?.title || 'Személyes üzenet Párizsból',
    description: ps?.description || 'Havonta egy levélnyi inspiráció: elfeledett legendák, rejtett kincsek és a város örök lüktetése. Iratkozz fel hírlevelünkre, hogy ne maradj le a legújabb párizsi programokról és exkluzív ajánlatokról!'
  })

  const feature1 = ps?.feature1 || 'Exkluzív túra ajánlatok'
  const feature2 = ps?.feature2 || 'Párizsi insider tippek'
  const feature3 = ps?.feature3 || 'Havonta 1-2 email'

  useEffect(() => {
    if (ps?.title || ps?.description) return // Skip fetch if pageSettings provided
    const fetchContent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile')
        .select('newsletter_title, newsletter_description')
        .single()

      if (data && !error) {
        setContent({
          title: data.newsletter_title || 'Személyes üzenet Párizsból',
          description: data.newsletter_description || 'Havonta egy levélnyi inspiráció: elfeledett legendák, rejtett kincsek és a város örök lüktetése. Iratkozz fel hírlevelünkre, hogy ne maradj le a legújabb párizsi programokról és exkluzív ajánlatokról!'
        })
      }
    }

    fetchContent()
  }, [])

  return (
    <section id="newsletter" className="relative overflow-hidden bg-[#FAF7F2] py-20 md:py-32">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-parisian-beige-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-parisian-beige-400 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Icon & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            viewport={{ once: true }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-parisian-beige-400/20"
          >
            <Mail className="h-10 w-10 text-parisian-beige-600" />
          </motion.div>

          <h2 className="mb-4 font-playfair text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-700">
            {content.description}
          </p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-600"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-parisian-beige-500" />
              <span>{feature1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-parisian-beige-500" />
              <span>{feature2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-parisian-beige-500" />
              <span>{feature3}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Form */}
        <NewsletterForm />
      </div>
    </section>
  )
}
