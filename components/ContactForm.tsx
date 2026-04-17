'use client'

import { useState } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)
    
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      e.currentTarget.reset()
    } else {
      setError(result.error || 'Something went wrong')
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for reaching out. We've received your inquiry and will get back to you within 4 business hours.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-toyota-red font-bold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            First Name <span className="text-toyota-red">*</span>
          </label>
          <input
            name="firstName"
            type="text"
            required
            placeholder="John"
            className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Last Name <span className="text-toyota-red">*</span>
          </label>
          <input
            name="lastName"
            type="text"
            required
            placeholder="Smith"
            className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Email Address <span className="text-toyota-red">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          VIN Number{' '}
          <span className="text-gray-400 font-normal normal-case">(recommended for technical help)</span>
        </label>
        <input
          name="vin"
          type="text"
          placeholder="e.g. JT2AE09W8X0123456"
          maxLength={17}
          className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-toyota-red transition-colors uppercase"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Vehicle Details
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            name="vehicleYear"
            type="text"
            placeholder="Year (e.g. 2003)"
            className="h-11 px-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
          />
          <input
            name="vehicleModel"
            type="text"
            placeholder="Model (e.g. Celica)"
            className="h-11 px-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
          />
          <input
            name="vehicleEngine"
            type="text"
            placeholder="Engine (e.g. 1ZZ-FE)"
            className="h-11 px-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Inquiry Type
        </label>
        <select 
          name="inquiryType"
          className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red transition-colors"
        >
          <option value="">Select inquiry type</option>
          <option>Part identification help</option>
          <option>Order status or tracking</option>
          <option>Returns &amp; refunds</option>
          <option>Fitment question</option>
          <option>Bulk / trade inquiry</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Message <span className="text-toyota-red">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe what you need, including any symptoms, part numbers you've found, or other relevant details…"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-sm font-bold text-toyota-red bg-red-50 p-3 rounded-lg border border-red-100 italic">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full h-12 bg-toyota-red text-white font-bold rounded-xl transition-all shadow-lg shadow-toyota-red/10 ${
          loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-toyota-red-dark hover:-translate-y-0.5'
        }`}
      >
        {loading ? 'Sending Inquiry...' : 'Send Inquiry'}
      </button>
      <p className="text-xs text-center text-gray-400">
        We respond to all inquiries within 4 business hours. No spam, ever.
      </p>
    </form>
  )
}
