'use client'

import { useState, useEffect } from 'react'
import { TOYOTA_MODELS, TOYOTA_YEARS, ENGINE_OPTIONS } from '@/lib/data'
import type { Part } from '@/lib/types'

interface FitmentCheckerProps {
  part: Part
}

export default function FitmentChecker({ part }: FitmentCheckerProps) {
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [engine, setEngine] = useState('')
  const [checked, setChecked] = useState(false)
  const [fits, setFits] = useState(false)

  const engines = model ? (ENGINE_OPTIONS[model] ?? []) : []

  // Restore garage vehicle from localStorage
  useEffect(() => {
    const label = localStorage.getItem('garage_vehicle_label')
    if (label) {
      const match = label.match(/^(\d{4}) Toyota (.+)$/)
      if (match) {
        setYear(match[1])
        setModel(match[2])
      }
    }
  }, [])

  function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!year || !model) return
    // Build a vehicle ID to check against fitment data
    // In production this would query the DB; here we do a heuristic check
    const modelLower = model.toLowerCase().replace(/\s+/g, '-')
    const engineCode = engine.match(/\(([^)]+)\)/)?.[1]?.toLowerCase() ?? ''
    const yearNum = parseInt(year)

    // Check if any fitment vehicle ID matches our selection
    const fitResult = part.fitment.some((fid) => {
      const parts = fid.split('-')
      const fidModel = parts[0]
      const fidYear = parseInt(parts[1] ?? '0')
      const fidEngine = parts.slice(2).join('-')

      const modelMatch =
        modelLower.startsWith(fidModel) || fidModel.startsWith(modelLower.slice(0, 3))
      const yearMatch = Math.abs(fidYear - yearNum) <= 2
      const engineMatch = !engineCode || fidEngine.includes(engineCode.slice(0, 4))

      return modelMatch && yearMatch && engineMatch
    })

    setFits(fitResult)
    setChecked(true)

    if (fitResult) {
      localStorage.setItem('garage_vehicle_label', `${year} Toyota ${model}`)
    }
  }

  function handleModelChange(val: string) {
    setModel(val)
    setEngine('')
    setChecked(false)
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
        <span className="text-lg">🔍</span> Fitment Checker
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Confirm this part fits your specific Toyota before ordering.
      </p>

      <form onSubmit={handleCheck} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setChecked(false) }}
              className="w-full h-10 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red"
            >
              <option value="">Year</option>
              {TOYOTA_YEARS.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Model</label>
            <select
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!year}
              className="w-full h-10 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red disabled:opacity-50"
            >
              <option value="">Model</option>
              {TOYOTA_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Engine (optional)</label>
          <select
            value={engine}
            onChange={(e) => { setEngine(e.target.value); setChecked(false) }}
            disabled={!model || engines.length === 0}
            className="w-full h-10 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red disabled:opacity-50"
          >
            <option value="">All Engines</option>
            {engines.map((eng) => (
              <option key={eng} value={eng}>{eng}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!year || !model}
          className="w-full h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Fitment
        </button>
      </form>

      {/* Result */}
      {checked && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            fits
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <span className="text-xl">{fits ? '✅' : '❌'}</span>
          <div>
            <p className={`font-semibold text-sm ${fits ? 'text-green-800' : 'text-red-800'}`}>
              {fits
                ? `This part fits your ${year} Toyota ${model}`
                : `This part may not fit your ${year} Toyota ${model}`}
            </p>
            <p className={`text-xs mt-1 ${fits ? 'text-green-600' : 'text-red-600'}`}>
              {fits
                ? 'Fitment confirmed. Safe to add to cart.'
                : 'Please check the compatibility list below or contact our experts.'}
            </p>
          </div>
        </div>
      )}

      {/* Listed fitment vehicles */}
      {part.fitment.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Confirmed Fitment Vehicles
          </p>
          <div className="space-y-1">
            {part.fitment.map((fid) => {
              const segments = fid.split('-')
              const modelCode = segments[0]
              const yearCode = segments[1]
              const engineCode = segments.slice(2).join('-').toUpperCase()
              return (
                <div key={fid} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded px-2 py-1.5">
                  <span className="text-green-500">✓</span>
                  <span className="font-mono uppercase">{modelCode} {yearCode} · {engineCode}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
