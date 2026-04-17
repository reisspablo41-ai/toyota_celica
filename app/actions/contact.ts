'use server'

import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend'
import { AdminNotificationEmail } from '@/components/emails/AdminNotification'

export async function submitContactForm(formData: FormData) {
  try {
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      vin: formData.get('vin') as string,
      vehicleYear: formData.get('vehicleYear') as string,
      vehicleModel: formData.get('vehicleModel') as string,
      vehicleEngine: formData.get('vehicleEngine') as string,
      inquiryType: formData.get('inquiryType') as string,
      message: formData.get('message') as string,
      submittedAt: new Date().toLocaleString(),
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Inquiry: ${data.inquiryType || 'General'} from ${data.firstName}`,
      react: AdminNotificationEmail({ formType: 'contact', data }),
    })

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Failed to send inquiry' }
  }
}
