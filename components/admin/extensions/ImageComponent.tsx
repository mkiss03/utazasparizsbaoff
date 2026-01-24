'use client'

import { NodeViewWrapper } from '@tiptap/react'
import { type NodeViewProps } from '@tiptap/core'
import { useState } from 'react'
import { AlignCenter, Maximize2, Monitor } from 'lucide-react'
import { ImageSize } from './CustomImage'

const ImageComponent = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const { src, alt, title, size } = node.attrs

  const handleSizeChange = (newSize: ImageSize) => {
    updateAttributes({ size: newSize })
    setShowMenu(false)
  }

  // Size class mapping
  const getSizeClasses = (size: ImageSize): string => {
    switch (size) {
      case 'normal':
        return 'w-full max-w-[65ch] mx-auto rounded-md'
      case 'wide':
        return 'w-full max-w-[85ch] mx-auto rounded-md'
      case 'full':
        return 'w-full max-w-none rounded-none'
      default:
        return 'w-full max-w-[65ch] mx-auto rounded-md'
    }
  }

  return (
    <NodeViewWrapper className="my-6 relative">
      <div
        className="relative group"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        {/* Floating Menu */}
        {(showMenu || selected) && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white rounded-lg shadow-xl border-2 border-parisian-beige-300 p-1 animate-fade-in">
            {/* Normal Button */}
            <button
              type="button"
              onClick={() => handleSizeChange('normal')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                size === 'normal'
                  ? 'bg-parisian-beige-400 text-white'
                  : 'bg-white text-parisian-grey-700 hover:bg-parisian-beige-50'
              }`}
              title="Normál méret"
            >
              <AlignCenter className="h-4 w-4" />
              <span className="hidden sm:inline">Normál</span>
            </button>

            {/* Wide Button */}
            <button
              type="button"
              onClick={() => handleSizeChange('wide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                size === 'wide'
                  ? 'bg-parisian-beige-400 text-white'
                  : 'bg-white text-parisian-grey-700 hover:bg-parisian-beige-50'
              }`}
              title="Széles méret"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Széles</span>
            </button>

            {/* Full Button */}
            <button
              type="button"
              onClick={() => handleSizeChange('full')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                size === 'full'
                  ? 'bg-parisian-beige-400 text-white'
                  : 'bg-white text-parisian-grey-700 hover:bg-parisian-beige-50'
              }`}
              title="Teljes szélesség"
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Teljes</span>
            </button>
          </div>
        )}

        {/* Image with selection border */}
        <div
          className={`relative transition-all ${
            selected ? 'ring-2 ring-parisian-beige-400 ring-offset-2' : ''
          }`}
        >
          <img
            src={src}
            alt={alt || ''}
            title={title || ''}
            className={`${getSizeClasses(size)} object-cover transition-all duration-300`}
            draggable={false}
          />
        </div>

        {/* Size indicator badge (optional, shows current size) */}
        {(showMenu || selected) && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {size === 'normal' && 'Normál'}
            {size === 'wide' && 'Széles'}
            {size === 'full' && 'Teljes szélesség'}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default ImageComponent
