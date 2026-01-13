import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import type { Post } from '@/lib/types/database'
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
      <main className="min-h-screen bg-gradient-to-b from-champagne-100 to-champagne-200">
        {/* Hero with Cover Image */}
        {postData.cover_image && (
          <div className="relative h-[50vh] w-full overflow-hidden bg-navy-500 md:h-[60vh]">
            <Image
              src={postData.cover_image}
              alt={postData.title}
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-500/90 via-navy-500/50 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-4">
          {/* Article Header */}
          <div className="mx-auto -mt-32 max-w-4xl">
            <div className="glass-strong rounded-3xl p-8 shadow-2xl md:p-12">
              {/* Back to Blog Link */}
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-navy-400 transition-colors hover:text-gold-500"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Vissza a bloghoz</span>
              </Link>

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-navy-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold-400" />
                  <span>
                    {formatDate(postData.published_at || postData.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold-400" />
                  <span>{readingTime} perc olvasás</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-8 font-playfair text-4xl font-bold text-navy-500 md:text-5xl lg:text-6xl">
                {postData.title}
              </h1>

              {/* Excerpt */}
              {postData.excerpt && (
                <p className="mb-8 border-l-4 border-gold-400 pl-6 text-xl italic text-navy-400">
                  {postData.excerpt}
                </p>
              )}
            </div>
          </div>

          {/* Article Body */}
          <div className="mx-auto max-w-4xl py-12">
            <div className="glass-strong rounded-3xl p-8 shadow-xl md:p-12">
              <div
                className="prose prose-lg prose-navy max-w-none
                  prose-headings:font-playfair prose-headings:font-bold prose-headings:text-navy-500
                  prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-3xl
                  prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-2xl
                  prose-p:mb-4 prose-p:leading-relaxed prose-p:text-navy-400
                  prose-a:text-gold-500 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-gold-600 hover:prose-a:underline
                  prose-strong:font-semibold prose-strong:text-navy-500
                  prose-em:italic prose-em:text-navy-400
                  prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-navy-400
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:text-navy-400
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-navy-400
                  prose-li:mb-2
                  prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mx-auto max-w-4xl pb-16">
            <div className="glass-strong rounded-3xl p-6 text-center shadow-xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-8 py-4 font-semibold text-navy-500 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gold-500 hover:shadow-xl"
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
