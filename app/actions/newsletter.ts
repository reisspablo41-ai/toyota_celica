'use server'

import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend'
import { AdminNotificationEmail } from '@/components/emails/AdminNotification'

export async function submitNewsletter(formData: FormData) {
  try {
    const email = formData.get('email') as string
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Newsletter Subscriber: ${email}`,
      react: AdminNotificationEmail({ 
        formType: 'newsletter', 
        data: { email, subscribedAt: new Date().toLocaleString() } 
      }),
    })

    return { success: true }
  } catch (error) {
    console.error('Newsletter error:', error)
    return { success: false }
  }
}
