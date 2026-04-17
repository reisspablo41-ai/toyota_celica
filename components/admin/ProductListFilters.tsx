'use client'

import { Category } from '@/lib/types'

interface Props {
  initialQuery?: string
  initialCategory?: string
  categories: Category[]
}

export default function ProductListFilters({ 
  initialQuery = '', 
  initialCategory = '', 
  categories 
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <form method="get" className="relative" action="/admin/products">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          name="q"
          defaultValue={initialQuery}
          placeholder="Search by name, SKU, part #…"
          className="h-9 pl-9 pr-4 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red w-64"
        />
        {initialCategory && <input type="hidden" name="category" value={initialCategory} />}
      </form>

      {/* Category filter */}
      <form method="get" action="/admin/products">
        {initialQuery && <input type="hidden" name="q" value={initialQuery} />}
        <select
          name="category"
          defaultValue={initialCategory}
          onChange={(e) => (e.target.form as HTMLFormElement).submit()}
          className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </form>
    </div>
  )
}
