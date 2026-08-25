'use client'

import { useEffect, useState } from 'react'
import { Share, Plus, MoreVertical, Download, X } from 'lucide-react'

type Platform = 'ios' | 'android' | 'other'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  if (isIOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'other'
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

interface Props {
  variant?: 'inline' | 'banner'
}

export default function InstallInstructions({ variant = 'inline' }: Props) {
  const [platform, setPlatform] = useState<Platform>('other')
  const [standalone, setStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    setPlatform(detectPlatform())
    setStandalone(isStandalone())

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (standalone || dismissed) return null

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return
    // @ts-expect-error -- a beforeinstallprompt esemény prompt() metódusa nincs a lib.dom típusokban
    deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  const wrapperClass =
    variant === 'banner'
      ? 'rounded-xl border border-louvre-gold-300 bg-louvre-navy-50 p-4 text-sm'
      : 'rounded-xl border border-slate-200 bg-white p-6'

  return (
    <div className={wrapperClass}>
      {variant === 'banner' && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Bezárás"
          className="float-right text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <h3 className="mb-2 flex items-center gap-2 font-playfair text-lg font-bold text-louvre-navy-700">
        <Download className="h-5 w-5" />
        Mentsd a főképernyődre
      </h3>

      {platform === 'ios' && (
        <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-700">
          <li>
            Nyomd meg lent a{' '}
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium">
              <Share className="h-3.5 w-3.5" /> Megosztás
            </span>{' '}
            ikont a Safari alján.
          </li>
          <li>
            Görgess le, és válaszd a{' '}
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium">
              <Plus className="h-3.5 w-3.5" /> Hozzáadás a kezdőképernyőhöz
            </span>{' '}
            opciót.
          </li>
          <li>Koppints a jobb felső <strong>Hozzáadás</strong> gombra.</li>
        </ol>
      )}

      {platform === 'android' && (
        <div className="space-y-3">
          {deferredPrompt ? (
            <button
              onClick={handleAndroidInstall}
              className="rounded-lg bg-louvre-gold-500 px-5 py-2.5 text-sm font-semibold text-louvre-navy-700 hover:opacity-90"
            >
              Telepítés egy koppintással
            </button>
          ) : (
            <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-700">
              <li>
                Nyisd meg a Chrome jobb felső{' '}
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium">
                  <MoreVertical className="h-3.5 w-3.5" /> menüjét
                </span>
                .
              </li>
              <li>Válaszd a „Telepítés” vagy „Hozzáadás a kezdőképernyőhöz” pontot.</li>
            </ol>
          )}
        </div>
      )}

      {platform === 'other' && (
        <p className="text-sm text-slate-700">
          A böngésződ menüjében keresd a „Telepítés” vagy „Hozzáadás a kezdőképernyőhöz” opciót --
          így egy ikonnal, internet nélkül is megnyithatod a túrát.
        </p>
      )}

      {platform === 'ios' && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          A Safari 7 nap tétlenség után törölheti a letöltött hangokat. Ha nem a Louvre-napodon
          nyitod meg, indulás előtt 1-2 nappal nyisd meg újra wifin, hogy friss maradjon a cache.
        </p>
      )}
    </div>
  )
}
