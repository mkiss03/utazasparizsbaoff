'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface WhatsAppFABProps {
  phoneNumber?: string
}

export default function WhatsAppFAB({
  phoneNumber = '+33612345678',
}: WhatsAppFABProps) {
  const handleClick = () => {
    const message = encodeURIComponent('Szia! Szeretnék többet megtudni a túrákról.')
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="group fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-2xl transition-all duration-300 hover:shadow-[#25D366]/50 md:h-20 md:w-20"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-8 w-8 text-white md:h-10 md:w-10" />

      {/* Ripple Effect */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-navy-500 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Írj WhatsApp-on!
        <div className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-navy-500" />
      </div>
    </motion.button>
  )
}
