import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import { getPartBySku } from '@/lib/services/admin-service'

interface Props {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku: encodedSku } = await params
  const sku = decodeURIComponent(encodedSku)
  const part = await getPartBySku(sku)
  return { title: part ? `Edit – ${part.name}` : 'Edit Product' }
}

export default async function EditProductPage({ params }: Props) {
  const { sku: encodedSku } = await params
  const sku = decodeURIComponent(encodedSku)
  const part = await getPartBySku(sku)
  
  if (!part) notFound()

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/products" className="hover:text-gray-700 transition-colors">
          Products
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-700 font-medium truncate max-w-xs">{part.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">{part.sku}</p>
        </div>
        <Link
          href={`/product/${part.sku}`}
          target="_blank"
          className="flex items-center gap-1.5 h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on Store
        </Link>
      </div>

      <ProductForm mode="edit" initialData={part} />
    </div>
  )
}
