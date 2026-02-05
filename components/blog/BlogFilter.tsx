'use client'

import { useState } from 'react'
import { Filter, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BlogCategory } from '@/lib/types/database'

interface BlogFilterProps {
  categories: BlogCategory[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
}

export function BlogFilter({ categories, selectedCategory, onSelectCategory }: BlogFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (categories.length === 0) return null

  return (
    <div className="border-b border-parisian-beige-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="relative">
          {/* Filter Button (when collapsed) */}
          {!isExpanded && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-3 rounded-full px-8 py-3 text-base font-semibold
                  bg-parisian-beige-400 text-white shadow-lg
                  hover:bg-parisian-beige-500 hover:shadow-xl
                  transition-all duration-300"
              >
                <Filter className="h-5 w-5" />
                Témák szűrése
              </button>
            </motion.div>
          )}

          {/* Tags Container (when expanded) */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-parisian-grey-600" />
                <button
                  onClick={() => onSelectCategory('')}
                  className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                    selectedCategory === ''
                      ? 'bg-parisian-beige-400 text-white shadow-md'
                      : 'bg-parisian-beige-100 text-parisian-grey-700 hover:bg-parisian-beige-200'
                  }`}
                >
                  Összes
                </button>
                <AnimatePresence initial={false}>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onSelectCategory(category.id)}
                      className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-parisian-beige-400 text-white shadow-md'
                          : 'bg-parisian-beige-100 text-parisian-grey-700 hover:bg-parisian-beige-200'
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              {/* Collapse Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-parisian-grey-700 transition-all duration-300 hover:bg-parisian-beige-50 hover:text-parisian-beige-600"
                >
                  <ChevronUp className="h-4 w-4" />
                  Elrejt
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
