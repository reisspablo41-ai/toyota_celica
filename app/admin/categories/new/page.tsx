import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryForm from '@/components/admin/CategoryForm'

export const metadata: Metadata = { title: 'New Category' }

export default function NewCategoryPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/categories" className="hover:text-gray-700 transition-colors">
          Categories
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-700 font-medium">New Category</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new category to organize your product catalogue.
        </p>
      </div>

      <CategoryForm mode="create" />
    </div>
  )
}
