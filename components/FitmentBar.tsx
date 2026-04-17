'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function FitmentBar() {
  const [vehicle, setVehicle] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('garage_vehicle_label')
    if (stored) setVehicle(stored)
  }, [])

  if (!vehicle) return null

  return (
    <div className="bg-green-50 border-b border-green-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
          <span className="text-green-800 font-medium">
            Filtered for: <strong>{vehicle}</strong>
          </span>
          <span className="text-green-600 text-xs">– showing compatible parts only</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="text-xs text-green-700 hover:underline">
            Change vehicle
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('garage_vehicle_label')
              setVehicle(null)
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ✕ Clear
          </button>
        </div>
      </div>
    </div>
  )
}
