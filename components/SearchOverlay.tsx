'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  sku: string
  name: string
  partNumber: string
  price: number
  categoryId: string
  inStock: boolean
  image: string | null
}

const CATEGORY_ICONS: Record<string, string> = {
  engine: '⚙️', brakes: '🔴', suspension: '🛞',
  electrical: '⚡', cooling: '❄️', body: '🚗',
  transmission: '🔧', fuel: '⛽',
}

interface Props {
  onClose: () => void
}

export default function SearchOverlay({ onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-focus when mounted
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    onClose()
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  const showDropdown = focused && (loading || query.length >= 2)

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            placeholder="Search by part number, name, or keyword…"
            className="w-full h-10 pl-4 pr-20 border-2 border-toyota-red rounded-lg text-sm focus:outline-none transition-colors bg-white"
          />
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              className="absolute right-11 top-0 h-10 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-0 top-0 h-10 w-11 flex items-center justify-center bg-toyota-red text-white rounded-r-lg hover:bg-toyota-red-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-3 px-4 py-5 text-sm text-gray-400">
              <span className="w-4 h-4 border-2 border-gray-200 border-t-toyota-red rounded-full animate-spin flex-shrink-0" />
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-5 text-sm text-gray-400 text-center">
              No parts found for <span className="font-semibold text-gray-600">"{query}"</span>
            </div>
          ) : (
            <>
              <ul>
                {results.map((result) => (
                  <li key={result.sku}>
                    <Link
                      href={`/product/${result.sku}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {result.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{CATEGORY_ICONS[result.categoryId] ?? '🔧'}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{result.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{result.partNumber}</p>
                      </div>

                      {/* Price + stock */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">${result.price.toFixed(2)}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${result.inStock ? 'text-green-600' : 'text-red-500'}`}>
                          {result.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="flex items-center gap-1 text-sm font-semibold text-toyota-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  See all results for "{query}"
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
