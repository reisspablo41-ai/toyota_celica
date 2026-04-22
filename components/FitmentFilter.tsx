'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CELICA_GENERATIONS = [
  {
    years: [2006, 2005, 2004, 2003, 2002, 2001, 2000],
    engines: [
      { label: '1.8L 4-Cylinder (1ZZ-FE)', code: '1zz', disp: '18' },
      { label: '1.8L 4-Cylinder (2ZZ-GE)', code: '2zz', disp: '18' },
    ],
  },
  {
    years: [1999, 1998, 1997, 1996, 1995, 1994],
    engines: [
      { label: '2.2L 4-Cylinder (5S-FE)', code: '5sfe', disp: '22' },
      { label: '2.0L 4-Cylinder (3S-GE)', code: '3sge', disp: '20' },
    ],
  },
  {
    years: [1993, 1992, 1991, 1990],
    engines: [
      { label: '2.2L 4-Cylinder (5S-FE)', code: '5sfe', disp: '22' },
      { label: '2.0L Turbo (3S-GTE)', code: '3sgte', disp: '20t' },
    ],
  },
  {
    years: [1989, 1988, 1987, 1986],
    engines: [
      { label: '2.0L 4-Cylinder (3S-FE)', code: '3sfe', disp: '20' },
      { label: '2.0L Turbo (3S-GTE)', code: '3sgte', disp: '20t' },
    ],
  },
  {
    years: [1985, 1984, 1983, 1982],
    engines: [
      { label: '2.2L 4-Cylinder (22R)', code: '22r', disp: '22' },
      { label: '2.0L 4-Cylinder (2S-E)', code: '2se', disp: '20' },
    ],
  },
  {
    years: [1981, 1980, 1979, 1978],
    engines: [
      { label: '2.0L 4-Cylinder (20R)', code: '20r', disp: '20' },
      { label: '2.2L 4-Cylinder (22R)', code: '22r', disp: '22' },
    ],
  },
  {
    years: [1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970],
    engines: [
      { label: '1.6L 4-Cylinder (2T-C)', code: '2tc', disp: '16' },
      { label: '2.0L 4-Cylinder (18R)', code: '18r', disp: '20' },
    ],
  },
]

const CELICA_YEARS = CELICA_GENERATIONS.flatMap(g => g.years)

function getEnginesForYear(year: string) {
  const y = parseInt(year)
  return CELICA_GENERATIONS.find(g => g.years.includes(y))?.engines ?? []
}

export default function FitmentFilter() {
  const router = useRouter()
  const [year, setYear] = useState('')
  const [engineCode, setEngineCode] = useState('')

  const availableEngines = year ? getEnginesForYear(year) : []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!year) return

    const params = new URLSearchParams()
    const selectedEngine = availableEngines.find(e => e.code === engineCode)
    if (engineCode && selectedEngine) {
      params.set('vehicle', `cel-${year}-${selectedEngine.disp}-${engineCode}`)
    } else {
      params.set('model', 'Celica')
      params.set('year', year)
    }

    const engineLabel = selectedEngine?.label ?? ''
    const label = engineLabel
      ? `${year} Toyota Celica (${engineLabel.match(/\((.+)\)/)?.[1] ?? engineLabel})`
      : `${year} Toyota Celica`
    localStorage.setItem('garage_vehicle_label', label)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Find Parts for Your Celica</h2>
      <p className="text-sm text-gray-500 mb-5">
        Select your year and engine to see only compatible parts — guaranteed to fit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Year */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => { setYear(e.target.value); setEngineCode('') }}
            className="w-full h-11 px-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-toyota-red transition-colors appearance-none cursor-pointer"
          >
            <option value="">Select Year</option>
            {CELICA_YEARS.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>

        {/* Model — fixed, display only */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Model
          </label>
          <div className="w-full h-11 px-3 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 flex items-center font-semibold">
            Toyota Celica
          </div>
        </div>

        {/* Engine */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Engine
          </label>
          <select
            value={engineCode}
            onChange={(e) => setEngineCode(e.target.value)}
            className="w-full h-11 px-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:border-toyota-red transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Engines</option>
            {availableEngines.map((eng) => (
              <option key={eng.code} value={eng.code}>{eng.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!year}
        className="w-full h-12 bg-toyota-red text-white font-bold rounded-xl hover:bg-toyota-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        Search Compatible Parts
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Or{' '}
        <a href="/shop" className="text-toyota-red hover:underline font-medium">
          browse all parts
        </a>{' '}
        without filtering by vehicle
      </p>
    </form>
  )
}
