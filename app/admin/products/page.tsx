import type { Metadata } from 'next'
import Link from 'next/link'
import ProductListFilters from '@/components/admin/ProductListFilters'
import { getAdminProducts, getAllCategories } from '@/lib/services/admin-service'

export const metadata: Metadata = { title: 'Products' }

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const catId = typeof sp.category === 'string' ? sp.category : ''

  const [products, categories] = await Promise.all([
    getAdminProducts({ query: q, categoryId: catId }),
    getAllCategories(),
  ])

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <ProductListFilters 
            initialQuery={q} 
            initialCategory={catId} 
            categories={categories} 
          />
          <span className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</span>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-9 px-4 bg-toyota-red text-white font-semibold rounded-lg text-sm hover:bg-toyota-red-dark transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU / Part #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                    <span className="text-4xl block mb-2">🔍</span>
                    No products match your search.
                  </td>
                </tr>
              ) : (
                products.map((part) => {
                  return (
                    <tr key={part.sku} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                            {part.images && part.images.length > 0 ? (
                              <img 
                                src={part.images[0]} 
                                alt={part.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl opacity-40">📦</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[220px]">{part.name}</p>
                            <p className="text-xs text-gray-400">★ {part.rating} ({part.reviewCount})</p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded inline-block">{part.sku}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{part.partNumber}</p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase tracking-tight font-medium">
                          {part.category || part.categoryId}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          part.brand === 'Genuine OEM'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}>
                          {part.brand === 'Genuine OEM' ? 'OEM' : 'Aftermarket'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right">
                        <p className="font-bold text-gray-900">${part.price.toFixed(2)}</p>
                        {part.compareAtPrice && (
                          <p className="text-xs text-gray-400 line-through">${part.compareAtPrice.toFixed(2)}</p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          part.inStock
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${part.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                          {part.inStock ? part.stockCount : 'Out'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/product/${part.sku}`}
                            target="_blank"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            title="View on store"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/products/${part.sku}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
