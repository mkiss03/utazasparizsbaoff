'use server'

import { createClient } from '@/lib/supabase/server'

export async function subscribeToNewsletter(email: string) {
  try {
    // Validate email
    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Kérjük, adjon meg egy email címet.'
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Kérjük, adjon meg egy érvényes email címet.'
      }
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      console.error('Newsletter check error:', checkError)
      return {
        success: false,
        error: 'Hiba történt. Kérjük, próbálja meg később.'
      }
    }

    if (existing) {
      if (existing.is_active) {
        return {
          success: false,
          error: 'Ez az email cím már feliratkozott a hírlevelünkre.'
        }
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Newsletter reactivation error:', updateError)
          return {
            success: false,
            error: 'Hiba történt. Kérjük, próbálja meg később.'
          }
        }

        return {
          success: true,
          message: 'Sikeresen újra feliratkozott a hírlevelünkre!'
        }
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        is_active: true
      })

    if (insertError) {
      console.error('Newsletter subscription error:', insertError)
      return {
        success: false,
        error: 'Hiba történt a feliratkozás során. Kérjük, próbálja meg később.'
      }
    }

    return {
      success: true,
      message: 'Köszönjük a feliratkozást! Hamarosan küldjük az első hírlevelünket.'
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: 'Váratlan hiba történt. Kérjük, próbálja meg később.'
    }
  }
}
