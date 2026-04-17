'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Testimonial } from '@/lib/types'

interface TestimonialsProps {
  items: Testimonial[]
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function QuoteIcon() {
  return (
    <svg
      className="w-10 h-10 text-toyota-red opacity-20"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

export default function Testimonials({ items }: TestimonialsProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = items.length

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total])
  const prev = () => setActive((a) => (a - 1 + total) % total)

  // Auto-advance every 6 s
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [paused, next])

  const featured = items[active]
  // Show up to 3 thumbnails (prev, active, next) for the side-panel on large screens
  const sideItems = [-1, 0, 1].map((offset) => items[(active + offset + total) % total])

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid lg:grid-cols-3 gap-8 items-start">

        {/* ── Main card ─────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 overflow-hidden min-h-[320px] flex flex-col justify-between">
            {/* Decorative large quote mark */}
            <div className="absolute top-6 right-8">
              <QuoteIcon />
            </div>

            {/* Stars */}
            <div className="mb-5">
              <Stars rating={featured.rating} />
            </div>

            {/* Quote */}
            <blockquote className="flex-1">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium italic">
                &ldquo;{featured.quote}&rdquo;
              </p>
            </blockquote>

            {/* Part bought */}
            <div className="mt-5 mb-6 inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 self-start">
              <span className="text-xs text-toyota-red">🔧</span>
              <span className="text-xs font-semibold text-toyota-red">{featured.partBought}</span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ backgroundColor: featured.avatarColor }}
              >
                {featured.avatarInitials}
              </div>
              <div>
                <p className="font-bold text-gray-900">{featured.author}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {featured.vehicle} &nbsp;·&nbsp; {featured.location}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{featured.date}</p>
              </div>
              {/* Verified badge */}
              <div className="ml-auto flex-shrink-0">
                <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Purchase
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-5">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-6 h-2 bg-toyota-red'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-toyota-red hover:text-toyota-red transition-colors"
                aria-label="Previous testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-toyota-red hover:text-toyota-red transition-colors"
                aria-label="Next testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Side panel: stacked mini-cards (desktop only) ─────── */}
        <div className="hidden lg:flex flex-col gap-3">
          {sideItems.map((item, i) => {
            const isActive = i === 1
            return (
              <button
                key={item.id}
                onClick={() => {
                  const idx = items.findIndex((t) => t.id === item.id)
                  setActive(idx)
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-toyota-red bg-red-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${isActive ? 'text-toyota-red' : 'text-gray-900'}`}>
                      {item.author}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{item.vehicle}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </button>
            )
          })}

          {/* Summary stat */}
          <div className="mt-2 bg-gray-900 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-white">4.9</p>
            <div className="flex justify-center mt-1 mb-2">
              <Stars rating={5} />
            </div>
            <p className="text-xs text-gray-400">Average rating from</p>
            <p className="text-sm font-semibold text-white">2,400+ verified buyers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
