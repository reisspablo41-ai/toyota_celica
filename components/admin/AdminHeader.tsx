'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const BREADCRUMBS: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Products / New Product',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/testimonials': 'Testimonials',
}

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  // Handle dynamic edit routes
  let title = BREADCRUMBS[pathname] ?? 'Admin'
  if (pathname.match(/^\/admin\/products\/.+\/edit$/)) {
    title = 'Products / Edit Product'
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-toyota-red rounded-full" />
        </button>

        {/* Avatar + logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-toyota-red flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin</p>
            <p className="text-[10px] text-gray-400">admin@toyotaparts.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            title="Log out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
