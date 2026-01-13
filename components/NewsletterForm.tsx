'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle } from 'lucide-react'
import { subscribeToNewsletter } from '@/lib/actions/newsletter'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Kérjük, adjon meg egy érvényes email címet.')
      return
    }

    setStatus('loading')

    const result = await subscribeToNewsletter(email)

    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Köszönjük! Sikeresen feliratkozott.')
      setEmail('')
    } else {
      setStatus('error')
      setMessage(result.error || 'Hiba történt. Kérjük, próbálja újra később.')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mx-auto max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email cím..."
              disabled={status === 'loading' || status === 'success'}
              className="w-full rounded-full border-2 border-white/30 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-white/60 backdrop-blur-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:bg-white/5"
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            whileHover={{ scale: status === 'loading' || status === 'success' ? 1 : 1.05 }}
            whileTap={{ scale: status === 'loading' || status === 'success' ? 1 : 0.95 }}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-parisian-beige-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-white/50"
          >
            {status === 'loading' ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-parisian-beige-500 border-t-transparent" />
                <span>Küldés...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Feliratkozott!</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Feliratkozás</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Status Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-center text-sm font-medium ${
              status === 'error' ? 'text-red-100' : 'text-white'
            }`}
          >
            {message}
          </motion.p>
        )}
      </form>

      {/* Privacy Note */}
      <p className="mt-4 text-center text-xs text-white/70">
        Feliratkozással elfogadja az{' '}
        <a href="/privacy" className="underline hover:text-white">
          adatvédelmi nyilatkozatunkat
        </a>
        . Bármikor leiratkozhat.
      </p>
    </motion.div>
  )
}
