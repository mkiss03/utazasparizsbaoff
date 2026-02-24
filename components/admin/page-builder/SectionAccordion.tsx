'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

interface SectionAccordionProps {
  sectionKey: string
  label: string
  icon: string
  isVisible: boolean
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export default function SectionAccordion({
  sectionKey,
  label,
  icon,
  isVisible,
  isOpen,
  onToggle,
  children,
}: SectionAccordionProps) {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Layout

  return (
    <div
      id={`editor-${sectionKey}`}
      className={`rounded-xl border transition-colors ${
        isOpen ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isVisible ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-navy-500">{label}</span>
            {!isVisible && (
              <span className="ml-2 text-xs text-slate-400">(rejtett)</span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}
