import type { Metadata } from 'next'
import { Suspense } from 'react'
import PartCard from '@/components/PartCard'
import SidebarFilters from '@/components/SidebarFilters'
import FitmentBar from '@/components/FitmentBar'
import ShopPagination from '@/components/ShopPagination'
import { getStoreParts, getStoreCategories, STORE_PAGE_SIZE } from '@/lib/services/store-service'

export const metadata: Metadata = {
  title: 'Shop All Parts',
  description: 'Browse our full catalogue of genuine OEM and aftermarket Toyota spare parts. Filter by category, brand, price, and availability.',
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = await searchParams
  const category = typeof filters.category === 'string' ? filters.category : ''
  const brand = typeof filters.brand === 'string' ? filters.brand : ''
  const minPrice = typeof filters.minPrice === 'string' ? parseFloat(filters.minPrice) : 0
  const maxPrice = typeof filters.maxPrice === 'string' ? parseFloat(filters.maxPrice) : Infinity
  const inStockOnly = filters.inStock === '1'
  const query = typeof filters.q === 'string' ? filters.q : ''
  const model = typeof filters.model === 'string' ? filters.model : ''
  const year = typeof filters.year === 'string' ? filters.year : ''
  const vehicleId = typeof filters.vehicle === 'string' ? filters.vehicle : ''
  const page = typeof filters.page === 'string' ? Math.max(1, parseInt(filters.page) || 1) : 1

  const [{ parts: filtered, total }, categories] = await Promise.all([
    getStoreParts({ category, brand, minPrice, maxPrice, inStockOnly, query, model, year, vehicleId, page }),
    getStoreCategories(),
  ])

  const totalPages = Math.ceil(total / STORE_PAGE_SIZE)
  const hasActiveFilters = category || brand || minPrice || maxPrice !== Infinity || inStockOnly

  return (
    <>
      <Suspense>
        <FitmentBar />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {query
              ? `Search results for "${filters.q}"`
              : model
              ? `Parts for Toyota ${filters.model}`
              : 'All Toyota Parts'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} part{total !== 1 ? 's' : ''} found
            {hasActiveFilters && ' · filters applied'}
            {totalPages > 1 && ` · page ${page} of ${totalPages}`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-32">
              <Suspense>
                <SidebarFilters categories={categories} />
              </Suspense>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-4 py-3 font-semibold text-sm cursor-pointer select-none">
                  Filters {hasActiveFilters && '(active)'}
                </summary>
                <div className="px-4 pb-4">
                  <Suspense>
                    <SidebarFilters categories={categories} />
                  </Suspense>
                </div>
              </details>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <h2 className="text-xl font-bold text-gray-900">No parts found</h2>
                <p className="text-gray-500 mt-2 max-w-sm">
                  Try adjusting your filters or search terms. Our team can also help you find the
                  right part.
                </p>
                <a
                  href="/contact"
                  className="mt-6 inline-flex items-center h-10 px-5 bg-toyota-red text-white font-semibold rounded-lg text-sm hover:bg-toyota-red-dark transition-colors"
                >
                  Ask an Expert
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((part) => (
                    <PartCard key={part.sku} part={part} />
                  ))}
                </div>
                <Suspense>
                  <ShopPagination currentPage={page} totalPages={totalPages} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
