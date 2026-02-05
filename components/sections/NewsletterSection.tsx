'use client'

import { motion } from 'framer-motion'
import NewsletterForm from '@/components/NewsletterForm'
import { Mail, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterSection() {
  const [content, setContent] = useState({
    title: 'Maradj Kapcsolatban',
    description: 'Iratkozz fel, hogy ne maradj le a legújabb párizsi programokról, rejtett kincsekről és exkluzív ajánlatokról!'
  })

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile')
        .select('newsletter_title, newsletter_description')
        .single()

      if (data && !error) {
        setContent({
          title: data.newsletter_title || 'Maradj Kapcsolatban',
          description: data.newsletter_description || 'Iratkozz fel, hogy ne maradj le a legújabb párizsi programokról, rejtett kincsekről és exkluzív ajánlatokról!'
        })
      }
    }

    fetchContent()
  }, [])

  return (
    <section id="newsletter" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-parisian-gold-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-french-blue-600 opacity-20 blur-3xl" />

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
              <span>Exkluzív túra ajánlatok</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-parisian-beige-500" />
              <span>Párizsi insider tippek</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-parisian-beige-500" />
              <span>Havonta 1-2 email</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Form */}
        <NewsletterForm />
      </div>
    </section>
  )
}
