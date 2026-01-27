'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate inputs
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        error: 'Kérjük, töltse ki az összes mezőt.'
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: 'Kérjük, adjon meg egy érvényes email címet.'
      }
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.error('RESEND_API_KEY is not configured')
      return {
        success: false,
        error: 'Az email küldési szolgáltatás nincs beállítva. Kérjük, vegye fel velünk a kapcsolatot közvetlenül.'
      }
    }

    // Send email to site owner
    const { data, error } = await resend.emails.send({
      from: 'Utazás Párizsba <onboarding@resend.dev>', // You'll need to configure a verified domain
      to: ['utazasparizsba@gmail.com'],
      replyTo: formData.email,
      subject: `Új kapcsolatfelvételi üzenet tőle: ${formData.name}`,
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
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                color: white;
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
              }
              .field-label {
                font-weight: bold;
                color: #C9A581;
                margin-bottom: 5px;
              }
              .field-value {
                background: white;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #C9A581;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 5px;
                border-left: 4px solid #C9A581;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #E8D5C4;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📧 Új Kapcsolatfelvételi Üzenet</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Név:</div>
                <div class="field-value">${formData.name}</div>
              </div>

              <div class="field">
                <div class="field-label">Email cím:</div>
                <div class="field-value">
                  <a href="mailto:${formData.email}" style="color: #C9A581; text-decoration: none;">
                    ${formData.email}
                  </a>
                </div>
              </div>

              <div class="field">
                <div class="field-label">Üzenet:</div>
                <div class="message-box">${formData.message}</div>
              </div>

              <div class="footer">
                <p>Ez az üzenet az Utazás Párizsba weboldalának kapcsolatfelvételi űrlapjáról érkezett.</p>
                <p>Válaszoljon közvetlenül erre az email címre: ${formData.email}</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        success: false,
        error: 'Hiba történt az email küldése során. Kérjük, próbálja meg később.'
      }
    }

    return {
      success: true,
      message: 'Köszönjük az üzenetet! Hamarosan felvesszük Önnel a kapcsolatot.'
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      error: 'Váratlan hiba történt. Kérjük, próbálja meg később vagy írjon nekünk közvetlenül.'
    }
  }
}
