import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'ToyotaParts Direct shipping information. Next-day, standard, and international delivery options for Toyota spare parts.',
}

const SHIPPING_OPTIONS = [
  {
    name: 'Standard Shipping',
    price: '$9.95',
    time: '3–5 Business Days',
    free: 'Free on orders over $150',
    icon: '📦',
    description:
      'Delivered by your regional carrier. Tracking provided at time of dispatch. Available for all in-stock items.',
  },
  {
    name: 'Express (Next-Day)',
    price: '$24.95',
    time: 'Next Business Day',
    free: null,
    icon: '⚡',
    description:
      'Order before 2 PM Mon–Fri. Delivered the following business day. Not available for oversized items (engines, gearboxes, large body panels).',
  },
  {
    name: 'International Economy',
    price: 'From $39.95',
    time: '7–14 Business Days',
    free: null,
    icon: '🌏',
    description:
      'Available to most countries worldwide. Duties, taxes, and import fees are the responsibility of the recipient. We declare all items accurately — we do not falsify customs documentation.',
  },
  {
    name: 'International Express',
    price: 'From $79.95',
    time: '3–5 Business Days',
    free: null,
    icon: '✈️',
    description:
      'Priority international delivery via express courier. Tracking to final delivery. Subject to local customs processing times.',
  },
]

const HEAVY_ITEMS = [
  'Engines and long-block assemblies',
  'Complete gearboxes and transfer cases',
  'Radiators (large format)',
  'Large body panels (bonnets, door skins, boot lids)',
  'Exhaust systems and catalytic converters',
]

export default function ShippingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black mb-3">Shipping Policy</h1>
          <p className="text-gray-300">
            Last updated: April 2026. All times are business-day estimates from the date of dispatch.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Shipping options grid */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">Delivery Options</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {SHIPPING_OPTIONS.map((opt) => (
              <div key={opt.name} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-toyota-red transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{opt.name}</p>
                      <p className="text-xs text-gray-500">{opt.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{opt.price}</p>
                    {opt.free && <p className="text-xs text-green-600 font-medium">{opt.free}</p>}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{opt.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dispatch times */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">📅 Order & Dispatch Times</h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Same-day dispatch:</strong> In-stock orders placed before 2:00 PM (EST), Monday to Friday.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Next business day dispatch:</strong> Orders placed after 2:00 PM, or on Saturday/Sunday.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">!</span>
                <span><strong>Back-ordered items:</strong> If any item in your order is on back-order, we will contact you by email within 24 hours with an estimated lead time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">ℹ</span>
                <span><strong>Public holidays:</strong> Our warehouse is closed on public holidays. Orders placed on these days will dispatch the next business day.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Heavy items */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">🏋️ Oversized & Heavy Items</h2>
          <p className="text-sm text-gray-600 mb-4">
            The following product types are classified as oversized or heavy freight and may attract
            a handling surcharge. Next-day express is not available for these items. Delivery
            estimates for heavy freight are 5–10 business days domestically.
          </p>
          <ul className="space-y-2">
            {HEAVY_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-gray-400">—</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Heavy freight requires a delivery address where someone can sign for the shipment.
            Liftgate/tailgate delivery is available on request for an additional fee. Contact us
            before ordering if you need special delivery arrangements.
          </p>
        </section>

        {/* International */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">🌏 International Shipping Notes</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 text-sm text-amber-900">
            <p>
              <strong>Import duties and taxes:</strong> International customers are responsible for
              all import duties, taxes, and customs clearance fees levied by their country.
              These are not included in our shipping charges and will be collected by the carrier
              or customs authority at delivery.
            </p>
            <p>
              <strong>Restricted items:</strong> Certain parts (airbags, aerosols, lithium batteries)
              are prohibited for air freight on international routes. We will notify you if any item
              in your order cannot be shipped internationally.
            </p>
            <p>
              <strong>Transit times:</strong> International estimates are in addition to local
              customs processing time, which varies by country and is outside our control.
            </p>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">📍 Tracking Your Order</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            A tracking number and carrier link will be emailed to you as soon as your order is
            dispatched. If you have not received a dispatch notification within 2 business days
            of placing your order, please check your spam folder first, then contact us.
          </p>
        </section>

        {/* Questions */}
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900">Questions about your shipment?</p>
            <p className="text-sm text-gray-500 mt-1">
              We respond to all shipping inquiries within 4 business hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex h-11 px-6 bg-toyota-red text-white font-bold rounded-xl items-center hover:bg-toyota-red-dark transition-colors text-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
