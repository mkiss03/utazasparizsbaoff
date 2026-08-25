'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function captureLouvreLead(email: string) {
  const cleanEmail = email?.trim().toLowerCase()

  if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
    return { success: false, error: 'Kérjük, adjon meg egy érvényes email címet.' }
  }

  const supabase = await createClient()

  const { error: insertError } = await supabase
    .from('louvre_leads')
    .insert({ email: cleanEmail, source: 'louvre-mini-tour' })

  if (insertError && insertError.code !== '23505') {
    console.error('Louvre lead insert error:', insertError)
    return { success: false, error: 'Hiba történt. Kérjük, próbálja meg később.' }
  }

  await sendWelcomeEmail(cleanEmail)

  return { success: true }
}

async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.warn('RESEND_API_KEY nincs beállítva -- a Louvre üdvözlő email kimarad.')
    return
  }

  try {
    await resend.emails.send({
      from: 'Utazás Párizsba <info@utazasparizsba.com>',
      to: [email],
      subject: 'A Louvre mini túrád készen áll -- töltsd le wifin!',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #002147 0%, #001C77 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 22px;">Hét tárgy, amely hazudik neked</h1>
              <p style="color: white; margin: 8px 0 0;">Ingyenes 3 állomásos ízelítő a Louvre-ból</p>
            </div>
            <div style="background: #FAF4E8; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Szia!</p>
              <p>Készen áll a mini túrád. Mielőtt bemész a Louvre-ba, <strong>most, wifin</strong> nyisd meg a linket, hogy minden hangfájl letöltődjön -- odabent a jelerősség foltos, és a lejátszás teljesen internet nélkül működik, ha előre letöltötted.</p>
              <p style="text-align: center; margin: 28px 0;">
                <a href="https://utazasparizsba.com/louvre/tour" style="background: #D4AF37; color: #002147; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">Túra megnyitása</a>
              </p>
              <p><strong>Mentsd a főképernyődre:</strong></p>
              <p>iPhone-on: Safari-ban nyisd meg a linket → Megosztás ikon → „Hozzáadás a kezdőképernyőhöz”.<br />
              Androidon: Chrome-ban a jobb felső menü → „Telepítés” vagy „Hozzáadás a kezdőképernyőhöz”.</p>
              <p style="margin-top: 24px; font-size: 13px; color: #666;">Ha kérdésed van, csak válaszolj erre az emailre.</p>
            </div>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Louvre welcome email error:', error)
  }
}

const EVENT_TYPES = [
  'tour_started',
  'station_completed',
  'tour_completed',
  'bonus_unlocked',
  'install_prompted',
  'install_accepted',
] as const

export type LouvreEventType = (typeof EVENT_TYPES)[number]

export async function logLouvreEvent(
  clientId: string,
  eventType: LouvreEventType,
  stationId?: string,
  manifestVersion?: string
) {
  if (!clientId || !EVENT_TYPES.includes(eventType)) return { success: false }

  const supabase = await createClient()
  const { error } = await supabase.from('louvre_events').insert({
    client_id: clientId,
    event_type: eventType,
    station_id: stationId ?? null,
    manifest_version: manifestVersion ?? null,
  })

  if (error) {
    console.error('Louvre event log error:', error)
    return { success: false }
  }
  return { success: true }
}
