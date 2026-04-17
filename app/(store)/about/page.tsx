import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ToyotaParts Direct – specialists in genuine OEM and aftermarket Toyota spare parts with guaranteed fitment accuracy.',
}

const TEAM_VALUES = [
  {
    icon: '🔬',
    title: 'Technical Expertise',
    body: 'Our team includes certified Toyota technicians with decades of hands-on workshop experience. We do not guess — we verify every part number against Toyota\'s official parts catalogue.',
  },
  {
    icon: '🎯',
    title: 'Fitment Accuracy',
    body: 'Fitment errors are the number-one source of frustration for DIYers and professionals alike. Our fitment database cross-references VIN data, year, model, engine code, and variant to eliminate guesswork.',
  },
  {
    icon: '🤝',
    title: 'Trusted Sourcing',
    body: 'Genuine Toyota parts are sourced exclusively from authorised Toyota distributors. Our aftermarket range undergoes quality verification before being listed — no grey-market, low-grade substitutes.',
  },
  {
    icon: '⚡',
    title: 'Fast Fulfilment',
    body: 'Our warehouse operates Mon–Sat. Orders placed before 2 PM on business days ship the same day. We understand that a car off the road means lost income or lost time.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black mb-4">Toyota Parts Specialists</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            We built ToyotaParts Direct because we were tired of ordering the wrong part.
            Every component in our catalogue is verified for fitment before it goes live.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                ToyotaParts Direct was founded by a team of automotive professionals who grew
                frustrated with online parts suppliers that listed components without meaningful
                fitment data. Ordering a water pump only to discover it was for a different engine
                variant is not just inconvenient — it costs mechanics real money and real time.
              </p>
              <p>
                We set out to build the resource we wished existed: a platform dedicated entirely
                to Toyota, where every listing is matched to a specific year, model, and engine
                combination before it goes live.
              </p>
              <p>
                Today we stock over 35,000 individual components covering 30+ years of Toyota
                production, from the iconic Celica GT to the workhorse Hilux Revo. Whether you
                are a home mechanic rebuilding a weekend project or a professional workshop
                keeping a fleet on the road, we exist to get you the right part, fast.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '35,000+', label: 'Parts in Catalogue' },
              { value: '99.2%', label: 'Fitment Accuracy Rate' },
              { value: '12+', label: 'Toyota Model Lines' },
              { value: '30 Days', label: 'Returns Window' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100"
              >
                <p className="text-3xl font-black text-toyota-red">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-gray-900 mb-10 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {TEAM_VALUES.map((val) => (
              <div key={val.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{val.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toyota Disclaimer */}
      <section className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Disclaimer:</strong> ToyotaParts Direct is an independent spare parts retailer.
            We are not affiliated with, authorised by, or endorsed by Toyota Motor Corporation.
            Toyota®, Camry®, Celica®, Hilux®, Corolla®, Land Cruiser®, RAV4®, and Supra® are
            registered trademarks of Toyota Motor Corporation. Genuine OEM part numbers are cited
            for compatibility reference only.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-toyota-red py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white mb-3">Ready to find your part?</h2>
          <p className="text-red-100 mb-6">Use our fitment checker and get the right component first time.</p>
          <Link
            href="/shop"
            className="inline-flex h-12 px-8 bg-white text-toyota-red font-bold rounded-xl items-center hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
