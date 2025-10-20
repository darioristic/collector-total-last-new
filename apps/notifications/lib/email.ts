import nodemailer from 'nodemailer'
import { Notification } from './types'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmailNotification(notification: Notification, userEmail: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 16px;">${notification.title}</h2>
            <p style="color: #666; line-height: 1.6;">${notification.message}</p>
            ${notification.metadata?.action_url ? `
              <div style="margin-top: 20px;">
                <a href="${notification.metadata.action_url}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; display: inline-block;">
                  ${notification.metadata.action_text || 'View Details'}
                </a>
              </div>
            ` : ''}
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This notification was sent from Collector Platform</p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
