'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/types/database'

interface BlogSectionProps {
  posts?: Post[]
}

export default function BlogSection({ posts = [] }: BlogSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!posts || posts.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  } as const

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-parisian-cream-50 to-white py-20 md:py-32">
      {/* Background Decoration */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-parisian-beige-300 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-playfair text-4xl font-bold text-parisian-grey-800 md:text-5xl lg:text-6xl">
            Párizsi Napló
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-parisian-grey-600 md:text-xl">
            Fedezd fel a város titkait, történeteit és varázslatos pillanatait
          </p>
        </motion.div>

        {/* Blog Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="overflow-hidden rounded-3xl border-2 border-parisian-beige-200 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-parisian-beige-300">
                  {/* Post Image */}
                  {post.cover_image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-900/50 to-transparent" />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="mb-3 flex items-center gap-2 text-sm text-parisian-grey-600">
                      <Calendar className="h-4 w-4 text-parisian-beige-500" />
                      <span>
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 font-playfair text-2xl font-bold text-parisian-grey-800 transition-colors group-hover:text-parisian-beige-600">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="mb-4 line-clamp-2 text-parisian-grey-600">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-parisian-beige-600 transition-all group-hover:gap-3">
                      <span>Tovább olvasom</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-parisian-beige-500"
            >
              Összes bejegyzés
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
