'use client'

import { useCart } from '@/lib/cart-store'
import Link from 'next/link'

export default function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, subtotal, totalCount } = useCart()

  if (!state.isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart} 
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {totalCount} {totalCount === 1 ? 'Item' : 'Items'} selected
              </p>
            </div>
            <button 
              onClick={toggleCart}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {state.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-gray-300">🛒</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-[240px]">
                  Looks like you haven't added any parts to your cart yet.
                </p>
                <button 
                  onClick={toggleCart}
                  className="mt-6 text-toyota-red font-bold text-sm hover:underline"
                >
                  Continue Shopping →
                </button>
              </div>
            ) : (
              state.items.map((item) => (
                <div key={item.sku} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl">⚙️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                       <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-toyota-red transition-colors line-clamp-2">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.sku)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-tight">{item.sku}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50/50">
                        <button 
                          onClick={() => updateQuantity(item.sku, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 text-gray-400 hover:text-gray-900 font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="w-8 h-8 text-gray-400 hover:text-gray-900 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-500">Subtotal</span>
                <span className="text-xl font-black text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 leading-tight">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="w-full h-14 bg-toyota-red text-white flex items-center justify-center gap-3 rounded-2xl font-black text-sm shadow-xl shadow-toyota-red/20 hover:bg-toyota-red-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Go to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
