'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, ImageIcon, X } from 'lucide-react'

export const AVAILABLE_IMAGES = [
  { path: '/images/stock1.jpeg', label: 'Szajna & Eiffel-torony (alkonyat)' },
  { path: '/images/stock3.jpg', label: 'Louvre piramis (alkonyat)' },
  { path: '/images/eiffel1.jpeg', label: 'Eiffel-torony 1' },
  { path: '/images/eiffel2.jpeg', label: 'Eiffel-torony 2' },
  { path: '/images/louvre1.jpeg', label: 'Louvre' },
  { path: '/images/aboutme.jpeg', label: 'Viktória (portré)' },
  { path: '/images/viktoriaprofillouvre.jpg', label: 'Viktória a Louvre-nál' },
]

export default function ImagePickerField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (path: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <span className="mb-2 block font-montserrat text-sm font-medium text-parisian-grey-700">{label}</span>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-parisian-beige-200 bg-parisian-beige-50">
          {value ? (
            <Image src={value} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-parisian-grey-300" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full border-2 border-parisian-beige-300 px-4 py-2 font-montserrat text-sm font-medium text-parisian-grey-700 hover:border-parisian-beige-400"
          >
            Kép kiválasztása
          </button>
          <p className="mt-1.5 truncate font-montserrat text-xs text-parisian-grey-400">{value || 'Nincs kép kiválasztva'}</p>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-parisian-grey-900/50 p-6" onClick={() => setIsOpen(false)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h4 className="font-playfair text-lg font-bold text-parisian-grey-800">Kép kiválasztása</h4>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-parisian-grey-400 hover:bg-parisian-beige-50 hover:text-parisian-grey-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {AVAILABLE_IMAGES.map((image) => {
                const isSelected = value === image.path
                return (
                  <button
                    key={image.path}
                    type="button"
                    onClick={() => {
                      onChange(image.path)
                      setIsOpen(false)
                    }}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-colors ${
                      isSelected ? 'border-parisian-beige-400' : 'border-transparent hover:border-parisian-beige-300'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-parisian-beige-50">
                      <Image src={image.path} alt={image.label} fill sizes="200px" className="object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-parisian-grey-900/40">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <Check className="h-4 w-4 text-parisian-beige-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="bg-white p-2 text-left font-montserrat text-xs text-parisian-grey-600">{image.label}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 border-t border-parisian-beige-100 pt-5">
              <span className="mb-2 block font-montserrat text-xs font-medium text-parisian-grey-600">
                Vagy egyéni kép-útvonal / URL
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="/images/sajat-kep.jpg vagy https://…"
                className="w-full rounded-lg border border-parisian-beige-200 px-3 py-2 font-montserrat text-sm text-parisian-grey-800 outline-none focus:border-parisian-beige-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
