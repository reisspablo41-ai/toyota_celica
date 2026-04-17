import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get expert help identifying your Toyota spare part. Use our inquiry form and include your VIN for the fastest response.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-black mb-3">Contact Our Toyota Specialists</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Can&apos;t find the right part, or not sure what you need? Our qualified Toyota
            technicians are here to help. Provide your VIN for the fastest, most accurate
            response.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: '📧', label: 'Email', value: 'toyotacelicaautostore@gmail.com', sub: 'Response within 4 business hours' },
                  { icon: '💬', label: 'Live Chat', value: 'Available on this site', sub: 'Mon–Sat, 9 AM – 5 PM EST' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                      <p className="font-semibold text-gray-900 text-sm mt-0.5">{item.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">Pro Tip: Include Your VIN</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Your Vehicle Identification Number (VIN) allows us to identify your exact production
                specification — trim, engine variant, and country of manufacture — so we can confirm
                the correct part with zero ambiguity.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Send an Inquiry</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
