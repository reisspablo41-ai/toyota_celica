'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { categories as fallbackCategories } from '@/lib/data'
import { Category } from '@/lib/types'

interface SidebarFiltersProps {
  categories?: Category[]
}

export default function SidebarFilters({ categories = fallbackCategories }: SidebarFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('category') ?? ''
  const activeBrand = searchParams.get('brand') ?? ''
  const activeMin = searchParams.get('minPrice') ?? ''
  const activeMax = searchParams.get('maxPrice') ?? ''
  const activeStock = searchParams.get('inStock') === '1'

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggleStock() {
    const params = new URLSearchParams(searchParams.toString())
    if (activeStock) {
      params.delete('inStock')
    } else {
      params.set('inStock', '1')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('brand')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('inStock')
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters = activeCategory || activeBrand || activeMin || activeMax || activeStock

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-toyota-red hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !activeCategory
                ? 'bg-toyota-red text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                activeCategory === cat.id
                  ? 'bg-toyota-red text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </span>
              <span className={`text-xs ${activeCategory === cat.id ? 'text-red-200' : 'text-gray-400'}`}>
                {cat.partCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Brand</h3>
        <div className="space-y-2">
          {['', 'Genuine OEM', 'Aftermarket'].map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={activeBrand === brand}
                onChange={() => updateParam('brand', brand)}
                className="accent-toyota-red"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {brand || 'All Brands'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              value={activeMin}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className="w-full h-9 pl-6 pr-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red"
              min={0}
            />
          </div>
          <span className="text-gray-400 text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              value={activeMax}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="w-full h-9 pl-6 pr-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-toyota-red"
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={activeStock}
            onChange={toggleStock}
            className="w-4 h-4 accent-toyota-red rounded"
          />
          <span className="text-sm text-gray-700">In stock only</span>
        </label>
      </div>
    </aside>
  )
}
