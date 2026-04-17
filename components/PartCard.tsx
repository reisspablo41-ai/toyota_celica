'use client'

import Link from 'next/link'
import type { Part } from '@/lib/types'

interface PartCardProps {
  part: Part
  vehicleId?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

import { useCart } from '@/lib/cart-store'

export default function PartCard({ part, vehicleId }: PartCardProps) {
  const { addItem } = useCart()
  const isFitment = vehicleId ? part.fitment.includes(vehicleId) : null
  const discount = part.compareAtPrice
    ? Math.round(((part.compareAtPrice - part.price) / part.compareAtPrice) * 100)
    : 0

  return (
    <Link href={`/product/${part.sku}`} className="group block">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200">
        {/* ... existing code ... */}
        {/* Image area */}
        <div className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
          {part.images && part.images.length > 0 ? (
            <img 
              src={part.images[0]} 
              alt={part.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {part.categoryId === 'engine' ? '⚙️' :
                   part.categoryId === 'brakes' ? '🔴' :
                   part.categoryId === 'suspension' ? '🛞' :
                   part.categoryId === 'electrical' ? '⚡' :
                   part.categoryId === 'cooling' ? '❄️' : '🔧'}
                </div>
                <p className="text-xs text-gray-400 font-mono">{part.partNumber}</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-toyota-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {part.brand === 'Genuine OEM' && (
              <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                OEM
              </span>
            )}
            {!part.inStock && (
              <span className="bg-gray-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Fitment indicator */}
          {isFitment !== null && (
            <div className="absolute top-2 right-2">
              {isFitment ? (
                <span className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Fits
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-gray-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  ✗ No fit
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] font-mono text-gray-400 mb-1">{part.partNumber}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-toyota-red transition-colors leading-snug">
            {part.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={part.rating} />
            <span className="text-xs text-gray-500">({part.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-gray-900">${part.price.toFixed(2)}</span>
              {part.compareAtPrice && (
                <span className="ml-2 text-xs text-gray-400 line-through">${part.compareAtPrice.toFixed(2)}</span>
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              part.inStock
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {part.inStock ? `${part.stockCount} left` : 'Out of stock'}
            </span>
          </div>

          <button
            className={`w-full mt-3 h-9 rounded-lg text-sm font-semibold transition-colors ${
              part.inStock
                ? 'bg-toyota-red text-white hover:bg-toyota-red-dark'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!part.inStock}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem({
                sku: part.sku,
                name: part.name,
                price: part.price,
                quantity: 1,
                image: part.images?.[0]
              })
            }}
          >
            {part.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  )
}
