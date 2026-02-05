import React from 'react'

export function BlogHero() {
  return (
    <div className="bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl lg:text-7xl">
          Párizsi naplóm
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-parisian-grey-600">
          Történetek, élmények és titkos helyek a fények városából
        </p>
      </div>
    </div>
  )
}
