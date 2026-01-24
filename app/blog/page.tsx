'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag as TagIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Post, BlogCategory } from '@/lib/types/database'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    // Fetch published posts only
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    setCategories(categoriesData || [])
    setPosts(postsData || [])
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category_id === selectedCategory)
    : posts

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-parisian-cream-100 to-parisian-beige-100">
        {/* Hero */}
        <div className="bg-gradient-to-br from-white via-parisian-cream-50 to-parisian-beige-50 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 font-playfair text-5xl font-bold text-parisian-grey-800 md:text-6xl lg:text-7xl">
              Párizsi Napló
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-parisian-grey-600">
              Történetek, élmények és titkos helyek a Fények Városából
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="border-b border-parisian-beige-200 bg-white">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <TagIcon className="h-5 w-5 text-parisian-grey-600" />
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                    selectedCategory === ''
                      ? 'bg-parisian-beige-400 text-white shadow-md'
                      : 'bg-parisian-beige-100 text-parisian-grey-700 hover:bg-parisian-beige-200'
                  }`}
                >
                  Összes
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-parisian-beige-400 text-white shadow-md'
                        : 'bg-parisian-beige-100 text-parisian-grey-700 hover:bg-parisian-beige-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="container mx-auto px-4 py-16">
          {isLoading ? (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-parisian-beige-200 border-t-parisian-beige-500" />
              <p className="mt-4 text-parisian-grey-600">Betöltés...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
              <h2 className="font-playfair text-2xl font-bold text-parisian-grey-800">
                {selectedCategory ? 'Nincs bejegyzés ebben a kategóriában' : 'Hamarosan...'}
              </h2>
              <p className="mt-2 text-parisian-grey-600">
                {selectedCategory ? 'Próbálj ki egy másik kategóriát!' : 'Dolgozunk az első bejegyzéseken!'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
