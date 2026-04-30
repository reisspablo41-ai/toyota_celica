import type { Metadata } from 'next'
import Link from 'next/link'
import FitmentFilter from '@/components/FitmentFilter'
import PartCard from '@/components/PartCard'
import Testimonials from '@/components/Testimonials'
import { testimonials } from '@/lib/data'
import { getFeaturedParts, getStoreCategories, getStoreStats } from '@/lib/services/store-service'

export const metadata: Metadata = {
  title: 'ToyotaParts Direct – Genuine & Aftermarket Toyota Spare Parts',
  description: 'Find exact-fit Toyota spare parts by year, model, and engine. OEM and aftermarket options. Next-day shipping available.',
}

const WHY_ITEMS = [
  {
    icon: '🎯',
    title: 'Guaranteed Fitment',
    body: 'Every part is matched to your exact year, model, and engine. If it doesn\'t fit, we\'ll make it right — no questions asked.',
  },
  {
    icon: '🚚',
    title: 'Next-Day Shipping',
    body: 'Order before 2 PM and receive your parts the next business day. International shipping available on select lines.',
  },
  {
    icon: '🏆',
    title: 'OEM Quality',
    body: 'We stock Genuine Toyota OEM parts sourced directly from authorised distributors, plus vetted aftermarket alternatives.',
  },
  {
    icon: '🧑‍🔧',
    title: 'Expert Support',
    body: 'Our team of qualified Toyota technicians can help you identify the right part, even with just your VIN number.',
  },
]


export default async function HomePage() {
  const [featuredParts, categories, stats] = await Promise.all([
    getFeaturedParts(4),
    getStoreCategories(),
    getStoreStats(),
  ])
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-toyota-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-toyota-dark to-gray-900 opacity-95" />
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #EB0A1E 0, #EB0A1E 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-toyota-red/20 border border-toyota-red/40 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-toyota-red animate-pulse" />
                <span className="text-toyota-red text-sm font-medium">Fitment-Guaranteed Parts</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                The Right Part,
                <br />
                <span className="text-toyota-red">First Time.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-lg">
                Genuine OEM and quality aftermarket spare parts for every Toyota ever made.
                Search by year, model, and engine for guaranteed compatibility.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-toyota-red text-white font-bold rounded-xl hover:bg-toyota-red-dark transition-colors"
                >
                  Browse All Parts
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center h-12 px-6 border border-gray-600 text-gray-200 font-semibold rounded-xl hover:border-gray-400 hover:text-white transition-colors"
                >
                  Talk to an Expert
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-700 pt-8">
                {[
                  { value: `${stats.totalParts.toLocaleString()}+`, label: 'Parts in Stock' },
                  { value: `${stats.totalModels} Models`, label: 'Toyota Lines Covered' },
                  { value: '99.2%', label: 'Fitment Accuracy' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: fitment filter */}
            <div>
              <FitmentFilter />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Everything your Toyota needs, organised by system</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group bg-white rounded-2xl border border-gray-200 p-5 text-center hover:border-toyota-red hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 group-hover:text-toyota-red transition-colors text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cat.partCount.toLocaleString()} parts</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured OEM Parts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Featured OEM Parts</h2>
              <p className="text-gray-500 mt-1">Top-selling genuine components for popular models</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1 text-toyota-red font-semibold text-sm hover:underline"
            >
              View all parts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParts.map((part) => (
              <PartCard key={part.sku} part={part} />
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link href="/shop" className="text-toyota-red font-semibold text-sm hover:underline">
              View all parts →
            </Link>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Why ToyotaParts Direct?</h2>
            <p className="text-gray-500 mt-2">We exist for one reason: getting you the right part, fast.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            ★★★★★ &nbsp; Trusted by 2,400+ Toyota owners worldwide
          </span>
          <h2 className="text-3xl font-black text-gray-900">What Our Customers Say</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Real feedback from verified buyers — mechanics, enthusiasts, and everyday Toyota owners
            who needed the right part and found it here.
          </p>
        </div>
        <Testimonials items={testimonials} />
      </section>

      {/* CTA Banner */}
      <section className="bg-toyota-red py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            Not sure which part you need?
          </h2>
          <p className="text-red-100 text-lg mb-6">
            Our Toyota specialists can identify the exact part using your VIN. Free, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center h-13 px-8 bg-white text-toyota-red font-bold rounded-xl hover:bg-gray-100 transition-colors text-base"
          >
            Get Expert Help
          </Link>
        </div>
      </section>
    </>
  )
}
