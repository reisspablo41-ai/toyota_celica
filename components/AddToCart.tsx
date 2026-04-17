'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-store'
import { Part } from '@/lib/types'

export default function AddToCart({ part }: { part: Part }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50/50">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-11 text-lg font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-11 text-lg font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          +
        </button>
      </div>
      <button
        disabled={!part.inStock}
        onClick={() => addItem({
          sku: part.sku,
          name: part.name,
          price: part.price,
          quantity,
          image: part.images?.[0]
        })}
        className={`flex-1 h-11 rounded-xl font-bold text-sm transition-all shadow-lg shadow-toyota-red/10 ${
          part.inStock
            ? 'bg-toyota-red text-white hover:bg-toyota-red-dark hover:-translate-y-0.5 active:translate-y-0'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {part.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
      <button className="w-11 h-11 border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:border-gray-200 hover:text-red-500 transition-all bg-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  )
}
