'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/data'
import { useCart } from '@/lib/cart-store'
import CartDrawer from './CartDrawer'
import SearchOverlay from './SearchOverlay'

const NAV_LINKS = [
  { label: 'Shop All Parts', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 .586-1.414l2-2A2 2 0 0 1 5 7h14a2 2 0 0 1 1.414.586l2 2A2 2 0 0 1 23 11v4a2 2 0 0 1-2 2h-2m-14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Header() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalCount, toggleCart } = useCart()
  const [garageVehicle, setGarageVehicle] = useState<string | null>(null)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('garage_vehicle_label')
    if (stored) setGarageVehicle(stored)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-toyota-dark text-white text-xs py-1.5 text-center">
        Free shipping on orders over $150 &nbsp;|&nbsp; Genuine OEM &amp; Aftermarket Parts &nbsp;|&nbsp; Expert Toyota Support
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-toyota-red rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">T</span>
              </div>
              {/* Mobile: Toyota Celica Parts */}
              <div className="sm:hidden block">
                <span className="font-black text-sm text-gray-900 tracking-tight">Toyota</span>
                <span className="font-light text-sm text-toyota-red tracking-tight ml-1">Celica</span>
                <span className="font-black text-[10px] text-gray-500 ml-1">Parts</span>
              </div>
              {/* Desktop: Toyota Parts Direct */}
              <div className="hidden sm:block">
                <span className="font-black text-lg text-gray-900 tracking-tight">Toyota</span>
                <span className="font-light text-lg text-toyota-red tracking-tight">Parts</span>
                <span className="font-black text-sm text-gray-500 ml-1">Direct</span>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:flex">
              <SearchOverlay onClose={() => {}} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* My Garage */}
              <Link
                href="/shop"
                className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-toyota-red transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
              >
                <CarIcon />
                <span className="max-w-[120px] truncate">
                  {garageVehicle ?? 'My Garage'}
                </span>
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-toyota-red transition-colors"
              >
                <CartIcon />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-toyota-red text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-gray-900 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-11 gap-1">
            {/* Categories mega menu */}
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1.5 h-11 px-4 text-sm font-semibold text-white bg-toyota-red hover:bg-toyota-red-dark transition-colors"
              >
                <span>All Categories</span>
                <ChevronDown />
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 w-[720px] bg-white shadow-2xl border-t-4 border-toyota-red rounded-b-lg z-50">
                  <div className="p-6 grid grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.id}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-toyota-red transition-colors text-sm">
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{cat.description}</p>
                          <p className="text-xs text-toyota-red mt-1">{cat.partCount.toLocaleString()} parts</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex gap-4 rounded-b-lg">
                    <Link
                      href="/shop"
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-sm font-semibold text-toyota-red hover:underline"
                    >
                      View all parts →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h-11 flex items-center px-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="ml-auto flex items-center gap-1">
              <Link href="/shipping" className="h-11 flex items-center px-3 text-xs text-gray-400 hover:text-white transition-colors">
                Shipping
              </Link>
              <Link href="/returns" className="h-11 flex items-center px-3 text-xs text-gray-400 hover:text-white transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="p-4">
            <SearchOverlay onClose={() => setMobileMenuOpen(false)} />
          </div>
          <div className="px-4 pb-4 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 text-sm text-gray-700 hover:text-toyota-red"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <CartDrawer />
    </header>
  )
}
