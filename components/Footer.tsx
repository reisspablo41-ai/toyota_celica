'use client'

import Link from 'next/link'
import { useState } from 'react'
import { submitNewsletter } from '@/app/actions/newsletter'

const MODEL_LINKS = [
  { label: 'Engine Components', href: '/shop?category=engine' },
  { label: 'Brakes & Rotors', href: '/shop?category=brakes' },
  { label: 'Suspension & Steering', href: '/shop?category=suspension' },
  { label: 'Electrical & Sensors', href: '/shop?category=electrical' },
  { label: 'Cooling System', href: '/shop?category=cooling' },
  { label: 'Fuel System', href: '/shop?category=fuel' },
  { label: 'Transmission', href: '/shop?category=transmission' },
  { label: 'Body & Exterior', href: '/shop?category=body' },
]


const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Shop All Parts', href: '/shop' },
]

export default function Footer() {

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await submitNewsletter(formData)
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      e.currentTarget.reset()
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-toyota-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {success ? "You're on the list!" : "Stay in the know"}
              </h3>
              <p className="text-red-100 text-sm mt-1">
                {success 
                  ? "Thanks for subscribing. We'll be in touch soon." 
                  : "Get part alerts, Toyota news, and exclusive deals straight to your inbox."
                }
              </p>
            </div>
            {!success && (
              <form className="flex gap-2 w-full md:w-auto" onSubmit={handleNewsletter}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="flex-1 md:w-72 h-11 px-4 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 bg-white text-toyota-red font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-toyota-red rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">T</span>
              </div>
              <span className="font-black text-white text-lg">ToyotaParts<span className="text-toyota-red">Direct</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Specialists in genuine OEM and quality aftermarket spare parts for all Toyota models. Fitment-guaranteed by year, model, and engine.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {['FB', 'IG', 'YT', 'X'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-toyota-red hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* By Category */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop by Category</h4>
            <ul className="space-y-2">
              {MODEL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Celica Years */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Celica by Year</h4>
            <ul className="space-y-2">
              {[2000, 2001, 2002, 2003, 2004, 2005].map((year) => (
                <li key={year}>
                  <Link href={`/shop?model=Celica&year=${year}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {year} Toyota Celica
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Information</h4>
            <ul className="space-y-2">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trust & Security</h4>
              {[
                '🔒 SSL Secure Payments',
                '✅ OEM Quality Guaranteed',
                '🚚 Next-Day Shipping Available',
                '↩️ Hassle-Free Returns',
              ].map((badge) => (
                <div key={badge} className="text-xs text-gray-400 flex items-center gap-1">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ToyotaParts Direct. All rights reserved.</p>
          <p>Toyota® is a registered trademark of Toyota Motor Corporation. We are an independent parts retailer, not affiliated with TMC.</p>
        </div>
      </div>
    </footer>
  )
}
