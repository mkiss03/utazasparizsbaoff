import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Post } from '@/lib/types/database'

interface PostGridProps {
  posts: Post[]
  isLoading: boolean
  selectedCategory: string
}

export function PostGrid({ posts, isLoading, selectedCategory }: PostGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-parisian-beige-200 border-t-parisian-beige-500" />
        <p className="mt-4 text-parisian-grey-600">Betöltés...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
        <h2 className="font-playfair text-2xl font-bold text-parisian-grey-800">
          {selectedCategory ? 'Nincs bejegyzés ebben a kategóriában' : 'Hamarosan...'}
        </h2>
        <p className="mt-2 text-parisian-grey-600">
          {selectedCategory ? 'Próbálj ki egy másik kategóriát!' : 'Dolgozunk az első bejegyzéseken!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`}>
            <article className="group overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              {/* Cover Image */}
              {post.cover_image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-800/50 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="mb-3 flex items-center gap-2 text-sm text-parisian-grey-600">
                  <Calendar className="h-4 w-4 text-parisian-beige-500" />
                  <span>
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-500">
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="line-clamp-3 text-parisian-grey-600">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
