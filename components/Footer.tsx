'use client'

import { motion } from 'framer-motion'
import { Facebook, Heart, Mail, Phone, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
  staticTexts?: Record<string, string>
}

export default function Footer({ staticTexts = {} }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const description = staticTexts.footer_description || 'Fedezze fel Párizs varázslatos titkait egy tapasztalt magyar idegenvezetővel.'
  const copyright = staticTexts.footer_copyright || 'Szeidl Viktória. Készült'
  const servicesTitle = staticTexts.footer_services_title || 'Szolgáltatások:'
  const service1 = staticTexts.footer_service_1 || 'Városnéző séták'
  const service2 = staticTexts.footer_service_2 || 'Programszervezés'
  const service3 = staticTexts.footer_service_3 || 'Transzferek'
  const contactEmail = staticTexts.footer_contact_email || 'viktoria.szeidl@gmail.com'
  const contactPhone = staticTexts.footer_contact_phone || '+33 6 12 34 56 78'

  return (
    <footer className="relative overflow-hidden bg-parisian-grey-800 py-12 sm:py-16 text-white">
      {/* Background Decoration */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-parisian-beige-400 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                <Image
                  src="/images/logofix-removebg-preview.png"
                  alt="Utazás Párizsba"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold">
                Utazás <span className="text-parisian-beige-400">Párizsba</span>
              </h3>
            </div>
            <p className="mb-4 text-sm text-white/90 font-semibold">
              Hivatalos idegenvezető és programszervező Párizsban
            </p>
            <p className="text-sm text-white/70">
              {description}
            </p>

            {/* Legal Info */}
            <div className="mt-6 space-y-1 text-xs text-white/60">
              <p>Nyilvántartási szám: 250065</p>
              <p>SIRET: 94822714500018</p>
              <p>SIREN: 948 227 145</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 font-playfair text-xl font-semibold">Gyors Linkek</h4>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <a href="/" className="text-white/80 transition-colors hover:text-white">
                  Kezdőlap
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="/#about" className="text-white/80 transition-colors hover:text-white">
                  Rólam
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="/blog" className="text-white/80 transition-colors hover:text-white">
                  Blog
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="/#contact" className="text-white/80 transition-colors hover:text-white">
                  Kapcsolat
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/impresszum" className="text-white/80 transition-colors hover:text-white inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Impresszum
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/aszf" className="text-white/80 transition-colors hover:text-white inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  ÁSZF
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 font-playfair text-xl font-semibold">Kapcsolat</h4>

            {/* Contact Info */}
            <div className="mb-6 space-y-3">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">{contactEmail}</span>
              </a>
              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">{contactPhone}</span>
              </a>
            </div>

            {/* Services */}
            <div className="mb-6">
              <h5 className="mb-2 text-sm font-semibold text-white/90">{servicesTitle}</h5>
              <ul className="space-y-1 text-xs text-white/70">
                <li>• {service1}</li>
                <li>• {service2}</li>
                <li>• {service3}</li>
              </ul>
            </div>

            {/* Facebook */}
            <div className="flex gap-4">
              <motion.a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-parisian-beige-400"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-white/20 pt-8 text-center"
        >
          <p className="flex items-center justify-center gap-2 text-sm text-white/70">
            © {currentYear} {copyright}{' '}
            <Heart className="h-4 w-4 fill-parisian-beige-400 text-parisian-beige-400" /> -tel Párizsban
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
