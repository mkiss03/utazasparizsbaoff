'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  slug: string
  cover_image?: string
}

export async function sendBlogNotification(post: BlogPost) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.error('RESEND_API_KEY is not configured')
      return {
        success: false,
        error: 'Az email küldési szolgáltatás nincs beállítva.'
      }
    }

    const supabase = await createClient()

    // Get all active subscribers
    const { data: subscribers, error: subscriberError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)

    if (subscriberError) {
      console.error('Error fetching subscribers:', subscriberError)
      return {
        success: false,
        error: 'Hiba történt a feliratkozók lekérésekor.'
      }
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        message: 'Nincs aktív feliratkozó.'
      }
    }

    const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://utazasparizsba.com'}/blog/${post.slug}`

    // Send email to all subscribers
    const emailPromises = subscribers.map((subscriber) =>
      resend.emails.send({
        from: 'Párizsi Útitárs <info@utazasparizsba.com>',
        to: [subscriber.email],
        replyTo: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'utazasparizsba@gmail.com',
        subject: `Új blogbejegyzés: ${post.title}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #E8D5C4 0%, #C9A581 100%);
                  padding: 40px 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .header h1 {
                  color: white;
                  margin: 0;
                  font-size: 28px;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px;
                }
                .post-title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #2C3E50;
                  margin-bottom: 15px;
                }
                .post-excerpt {
                  color: #555;
                  margin-bottom: 25px;
                  line-height: 1.8;
                }
                ${post.cover_image ? `
                .post-image {
                  width: 100%;
                  max-height: 300px;
                  object-fit: cover;
                  border-radius: 8px;
                  margin-bottom: 20px;
                }
                ` : ''}
                .cta-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #E8D5C4 0%, #C9A581 100%);
                  color: white;
                  padding: 15px 40px;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                  margin: 20px 0;
                  text-align: center;
                }
                .cta-button:hover {
                  background: linear-gradient(135deg, #C9A581 0%, #A68967 100%);
                }
                .footer {
                  background: #f9f9f9;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                  border-top: 1px solid #ddd;
                }
                .unsubscribe {
                  margin-top: 15px;
                  font-size: 11px;
                }
                .unsubscribe a {
                  color: #C9A581;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>📝 Új Blogbejegyzés</h1>
                <p style="color: white; margin: 10px 0 0 0;">Párizsi Napló</p>
              </div>
              <div class="content">
                ${post.cover_image ? `<img src="${post.cover_image}" alt="${post.title}" class="post-image" />` : ''}
                <h2 class="post-title">${post.title}</h2>
                ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
                <div style="text-align: center;">
                  <a href="${blogUrl}" class="cta-button">Olvass tovább →</a>
                </div>
              </div>
              <div class="footer">
                <p>Köszönjük, hogy feliratkoztál hírlevelünkre!</p>
                <p>Ha kérdésed van, írj nekünk: <a href="mailto:utazasparizsba@gmail.com" style="color: #C9A581;">utazasparizsba@gmail.com</a></p>
                <div class="unsubscribe">
                  <p>Nem szeretnél több értesítést kapni? <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://utazasparizsba.com'}">Leiratkozás</a></p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    )

    const results = await Promise.allSettled(emailPromises)

    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failCount = results.filter(r => r.status === 'rejected').length

    console.log(`Blog notification sent: ${successCount} successful, ${failCount} failed`)

    return {
      success: true,
      message: `Blog értesítés elküldve ${successCount} feliratkozónak.`,
      successCount,
      failCount
    }

  } catch (error) {
    console.error('Blog notification error:', error)
    return {
      success: false,
      error: 'Váratlan hiba történt az értesítések küldése során.'
    }
  }
}
