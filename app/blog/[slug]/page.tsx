import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft, Clock, Hash } from 'lucide-react'
import type { Post } from '@/lib/types/database'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, '') // Strip HTML tags
  const wordCount = textContent.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    return {
      title: 'Bejegyzés nem található',
    }
  }

  const postData = post as Post

  // Process tags for keywords
  const keywords = postData.tags
    ? postData.tags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter((tag) => tag !== '')
        .join(', ')
    : 'párizs, utazás, idegenvezetés'

  return {
    title: postData.title,
    description: postData.excerpt || postData.title,
    keywords: keywords,
    openGraph: {
      title: postData.title,
      description: postData.excerpt || postData.title,
      images: postData.cover_image ? [postData.cover_image] : [],
      type: 'article',
      publishedTime: postData.published_at || postData.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt || postData.title,
      images: postData.cover_image ? [postData.cover_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  const postData = post as Post

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const readingTime = estimateReadingTime(postData.content)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-parisian-cream-50 to-parisian-beige-50">
        {/* Hero with Cover Image */}
        {postData.cover_image && (
          <div className="relative h-[40vh] w-full overflow-hidden bg-parisian-grey-800 md:h-[50vh]">
            <Image
              src={postData.cover_image}
              alt={postData.title}
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-parisian-grey-800/90 via-parisian-grey-800/50 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-4 py-12">
          {/* Article Header */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-8 shadow-xl md:p-10">
              {/* Back to Blog Link */}
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-parisian-grey-600 transition-colors hover:text-french-blue-500"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Vissza a bloghoz</span>
              </Link>

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-parisian-grey-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-parisian-beige-500" />
                  <span>
                    {formatDate(postData.published_at || postData.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-parisian-beige-500" />
                  <span>{readingTime} perc olvasás</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-6 font-playfair text-3xl font-bold text-parisian-grey-800 md:text-4xl lg:text-5xl">
                {postData.title}
              </h1>

              {/* Excerpt */}
              {postData.excerpt && (
                <p className="mb-6 border-l-4 border-parisian-beige-400 pl-6 text-lg italic text-parisian-grey-700">
                  {postData.excerpt}
                </p>
              )}

              {/* Tags */}
              {postData.tags && postData.tags.trim() !== '' && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-parisian-beige-200">
                  <Hash className="h-4 w-4 text-parisian-beige-500" />
                  {postData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== '')
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-parisian-beige-100 px-3 py-1 text-sm font-medium text-parisian-grey-700 transition-colors hover:bg-parisian-beige-200"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Article Body */}
          <div className="mx-auto max-w-4xl py-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-playfair prose-headings:font-bold prose-headings:text-parisian-grey-800
                  prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl
                  prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-xl
                  prose-p:mb-4 prose-p:leading-relaxed prose-p:text-parisian-grey-700
                  prose-a:text-french-blue-500 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-french-blue-600 hover:prose-a:underline
                  prose-strong:font-semibold prose-strong:text-parisian-grey-800
                  prose-em:italic prose-em:text-parisian-grey-700
                  prose-blockquote:border-l-4 prose-blockquote:border-parisian-beige-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-parisian-grey-600
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:text-parisian-grey-700
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-parisian-grey-700
                  prose-li:mb-2
                  prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mx-auto max-w-4xl pb-16">
            <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-parisian-beige-400 px-8 py-3 font-semibold text-parisian-grey-800 shadow-md transition-all duration-300 hover:scale-105 hover:bg-parisian-beige-500 hover:shadow-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                Összes bejegyzés
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
