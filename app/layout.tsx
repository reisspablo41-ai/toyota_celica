import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | ToyotaParts Direct',
    default: 'ToyotaParts Direct – Genuine & Aftermarket Toyota Spare Parts',
  },
  description:
    'Find the exact Toyota spare part for your vehicle. Guaranteed fitment by year, model, and engine. OEM and aftermarket options for Camry, Celica, Hilux, Corolla, Land Cruiser, and more.',
  keywords: 'Toyota spare parts, OEM Toyota parts, Toyota Celica parts, Toyota Camry parts, Toyota Hilux parts, genuine Toyota',
}

import { CartProvider } from '@/lib/cart-store'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <CartProvider>
          {children}
        </CartProvider>
        <Script src="//code.jivosite.com/widget/L6O6sgHrsT" strategy="afterInteractive" />
      </body>
    </html>
  )
}
