'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { sendContactEmail } from '@/lib/actions/contact'

interface ContactSectionProps {
  email?: string
  phone?: string
  whatsapp?: string
}

export default function ContactSection({
  email = 'viktoria@parizstourist.com',
  phone = '+33 6 12 34 56 78',
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: '' })

    const result = await sendContactEmail(formData)

    setIsLoading(false)

    if (result.success) {
      setStatus({
        type: 'success',
        message: result.message || 'Köszönjük az üzenetet!'
      })
      // Reset form on success
      setFormData({ name: '', email: '', message: '' })
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Hiba történt az üzenet küldése során.'
      })
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: MapPin,
      label: 'Helyszín',
      value: 'Párizs, Franciaország',
      href: '#',
    },
  ]

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-white to-parisian-cream-50 py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-parisian-beige-300 opacity-5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Lépjen kapcsolatba
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            Készen áll felfedezni Párizst? Vegye fel velem a kapcsolatot, és tervezzük meg együtt az Ön álomtúráját!
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-8 font-playfair text-3xl font-bold text-parisian-grey-800">
              Elérhetőségek
            </h3>

            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="flex items-center gap-4 rounded-2xl border-2 border-parisian-beige-200 bg-white p-6 transition-all duration-300 hover:border-parisian-beige-300 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-parisian-beige-400">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-parisian-grey-600">{item.label}</p>
                      <p className="text-lg font-bold text-parisian-grey-800">{item.value}</p>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            {/* Decorative Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 rounded-3xl border-l-4 border-parisian-beige-400 bg-parisian-cream-100/80 p-6 backdrop-blur-sm"
            >
              <p className="italic text-parisian-grey-700">
                &ldquo;Párizs mindig jó ötlet. Különösen akkor, ha egy tapasztalt idegenvezetővel fedezi fel.&rdquo;
              </p>
              <p className="mt-2 font-semibold text-parisian-grey-800">- Viktória</p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-parisian-beige-200 bg-white p-8 shadow-lg">
              <h3 className="mb-6 font-playfair text-2xl font-bold text-parisian-grey-800">
                Küldjön üzenetet
              </h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-parisian-grey-700">
                    Név
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-parisian-beige-200 bg-white px-4 py-3 transition-all duration-300 focus:border-parisian-beige-400 focus:outline-none focus:ring-2 focus:ring-parisian-beige-400/20"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-parisian-grey-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border-2 border-parisian-beige-200 bg-white px-4 py-3 transition-all duration-300 focus:border-parisian-beige-400 focus:outline-none focus:ring-2 focus:ring-parisian-beige-400/20"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-parisian-grey-700">
                    Üzenet
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-xl border-2 border-parisian-beige-200 bg-white px-4 py-3 transition-all duration-300 focus:border-parisian-beige-400 focus:outline-none focus:ring-2 focus:ring-parisian-beige-400/20"
                    required
                  />
                </div>

                {/* Status Messages */}
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 rounded-xl border-2 p-4 ${
                      status.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{status.message}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? 'cursor-not-allowed bg-parisian-beige-300'
                      : 'bg-parisian-beige-400 hover:bg-parisian-beige-500'
                  }`}
                >
                  {isLoading ? 'Küldés...' : 'Üzenet küldése'}
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
