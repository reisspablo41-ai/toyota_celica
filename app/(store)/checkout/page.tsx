'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitCheckoutForm } from '@/app/actions/checkout'

export default function CheckoutPage() {
  const { state, subtotal, totalCount, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (totalCount === 0 && !loading) {
       // router.push('/shop') // Disable for now to allow editing
    }
  }, [totalCount, router, loading])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitCheckoutForm(formData, state.items, subtotal)

    if (result.success) {
      clearCart()
      router.push(`/checkout/success?order=${result.orderNumber}`)
    } else {
      setError(result.error || 'Checkout failed')
      setLoading(false)
    }
  }

  const shippingCost = subtotal > 150 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your details to request your Toyota parts.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                    <input name="firstName" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                    <input name="lastName" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input name="email" type="email" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                  <input name="phone" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Stress Address</label>
                    <input name="address" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" placeholder="House number and street name" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                      <input name="city" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                      <input name="state" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">ZIP Code</label>
                      <input name="zipCode" required className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-toyota-red outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Info (Mock) */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">3</span>
                  Payment Method
                </h2>
                <div className="p-4 bg-gray-50 rounded-2xl border-2 border-toyota-red/20 border-dashed text-center">
                   <p className="text-sm text-gray-600">
                     Payment is not required now. This is a <strong>request-to-order</strong>. 
                     We will contact you with a final invoice and payment link once we confirm part fitment.
                   </p>
                </div>
              </section>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-toyota-red text-sm font-bold italic">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || totalCount === 0}
                className={`w-full h-16 rounded-2xl bg-toyota-red text-white font-black text-lg transition-all shadow-xl shadow-toyota-red/20 flex items-center justify-center gap-3 ${
                  loading || totalCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-toyota-red-dark hover:-translate-y-1 active:translate-y-0'
                }`}
              >
                {loading ? 'Processing Order...' : `Place Order Request – $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {state.items.map((item) => (
                    <div key={item.sku} className="flex gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : '⚙️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm font-black mt-1 text-toyota-red">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Shipping</span>
                    <span className="font-bold">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Estimated Tax</span>
                    <span className="font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-toyota-red">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-3xl p-6 text-white text-center">
                 <div className="mb-2 text-2xl">🚚</div>
                 <h3 className="font-bold text-sm">Fast Domestic & International Shipping</h3>
                 <p className="text-white/70 text-[10px] mt-1 uppercase font-bold tracking-widest">Tracking number provided on dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
