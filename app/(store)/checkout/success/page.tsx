'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-8 shadow-xl shadow-green-500/20">
        ✓
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4">Order Received!</h1>
      <p className="text-xl text-gray-600 mb-8">
        We've received your order request <span className="font-mono font-bold text-gray-900">#{orderNumber}</span> and sent a confirmation email to your inbox.
      </p>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left mb-10">
        <h2 className="font-bold text-gray-900 mb-4">What's next?</h2>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</span>
            <p className="text-sm text-gray-600"><strong className="text-gray-900">Fitment Verification:</strong> Our experts will cross-reference your order with your vehicle details to ensure 100% compatibility.</p>
          </li>
          <li className="flex gap-4">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
            <p className="text-sm text-gray-600"><strong className="text-gray-900">Invoice:</strong> You will receive a final invoice with a secure payment link once fitment is confirmed.</p>
          </li>
          <li className="flex gap-4">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</span>
            <p className="text-sm text-gray-600"><strong className="text-gray-900">Shipping:</strong> Parts are typically dispatched within 24 hours of payment clearance.</p>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/shop"
          className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/contact"
          className="h-14 px-8 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-sm flex items-center justify-center hover:border-gray-200 transition-all"
        >
          Contact Support
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
