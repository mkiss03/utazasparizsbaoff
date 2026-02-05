'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogFilter } from '@/components/blog/BlogFilter'
import { PostGrid } from '@/components/blog/PostGrid'
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

    // Fetch posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    setCategories(categoriesData || [])
    setPosts(postsData || [])
    setIsLoading(false)
  }

  // Filter logic
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category_id === selectedCategory)
    : posts

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-parisian-cream-100 to-parisian-beige-100">
        
        {/* 1. Hero Section */}
        <BlogHero />

        {/* 2. Filter Section */}
        <BlogFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 3. Post Grid */}
        <div className="container mx-auto px-4 py-16">
          <PostGrid 
            posts={filteredPosts} 
            isLoading={isLoading} 
            selectedCategory={selectedCategory}
          />
        </div>

      </main>
      <Footer />
    </>
  )
}
