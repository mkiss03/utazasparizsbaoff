'use client'

import { useState, useRef, useEffect } from 'react'
import { Pipette, Check } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

// Preset colors for quick selection
const presetColors = [
  // Slate (Navy theme)
  '#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9',
  // Stone (Beige theme)
  '#1c1917', '#292524', '#44403c', '#57534e', '#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4', '#f5f5f4',
  // Whites & Blacks
  '#ffffff', '#fafafa', '#FAF7F2', '#000000',
  // Accent colors (if needed)
  '#dc2626', '#ea580c', '#d97706', '#65a30d', '#0891b2', '#2563eb', '#7c3aed', '#db2777',
]

export default function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Sync input value with prop
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    // Only trigger onChange for valid hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue)
    }
  }

  const handlePresetClick = (color: string) => {
    setInputValue(color)
    onChange(color)
  }

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      {description && (
        <p className="text-xs text-slate-500 mb-2">{description}</p>
      )}

      <div className="flex items-center gap-2">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors bg-white"
        >
          <div
            className="w-6 h-6 rounded border border-slate-200 shadow-inner"
            style={{ backgroundColor: value }}
          />
          <Pipette className="w-4 h-4 text-slate-500" />
        </button>

        {/* Hex Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />

        {/* Native Color Input (hidden, for fallback) */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-0 border-0 cursor-pointer rounded"
          title="Natív színválasztó"
        />
      </div>

      {/* Preset Colors Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xl w-72">
          <p className="text-xs font-medium text-slate-500 mb-2">Gyors választás</p>
          <div className="grid grid-cols-9 gap-1.5">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={`relative w-6 h-6 rounded border transition-all hover:scale-110 ${
                  value === color
                    ? 'border-slate-900 ring-2 ring-slate-400'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              >
                {value === color && (
                  <Check
                    className={`absolute inset-0 m-auto w-3 h-3 ${
                      isLightColor(color) ? 'text-slate-800' : 'text-white'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Current Color Display */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-slate-200 shadow-inner"
              style={{ backgroundColor: value }}
            />
            <div>
              <p className="text-xs text-slate-500">Kiválasztott szín</p>
              <p className="text-sm font-mono font-medium text-slate-700">{value}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to determine if a color is light
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}
