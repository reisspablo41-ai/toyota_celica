'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader, { type UploadedImage } from './ImageUploader'
import { categories, vehicles } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { Part } from '@/lib/types'

const BUCKET = 'bucket'

async function uploadImagesToStorage(sku: string, images: UploadedImage[]): Promise<string[]> {
  const urls: string[] = []
  for (const img of images) {
    if (!img.file) {
      // Already a remote URL — keep it
      urls.push(img.url)
      continue
    }
    const ext = img.file.name.split('.').pop() ?? 'jpg'
    // Sanitize SKU for storage path (remove/replace characters that might break Supabase Storage)
    const safeSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_')
    const path = `products/${safeSku}/${img.id}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, img.file, { upsert: true })
    if (error) throw new Error(`Upload failed for ${img.name}: ${error.message}`)
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
    urls.push(publicUrl)
  }
  return urls
}

interface ProductFormProps {
  initialData?: Partial<Part>
  mode: 'create' | 'edit'
}

interface FormState {
  sku: string
  name: string
  description: string
  price: string
  compareAtPrice: string
  brand: 'Genuine OEM' | 'Aftermarket'
  categoryId: string
  partNumber: string
  oemCrossReference: string
  weight: string
  material: string
  inStock: boolean
  stockCount: string
  tags: string
  fitment: string[]
  relatedSkus: string
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-toyota-red ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red focus:ring-1 focus:ring-toyota-red/20 transition-colors'
const textareaCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-toyota-red focus:ring-1 focus:ring-toyota-red/20 transition-colors resize-none'

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<UploadedImage[]>(
    (initialData?.images ?? []).map((url, i) => ({
      id: `existing-${i}`,
      url,
      file: undefined,
      name: url.split('/').pop() ?? `image-${i}`,
      sizeKb: 0,
    }))
  )

  const [form, setForm] = useState<FormState>({
    sku: initialData?.sku ?? '',
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price?.toString() ?? '',
    compareAtPrice: initialData?.compareAtPrice?.toString() ?? '',
    brand: initialData?.brand ?? 'Genuine OEM',
    categoryId: initialData?.categoryId ?? '',
    partNumber: initialData?.partNumber ?? '',
    oemCrossReference: initialData?.oemCrossReference ?? '',
    weight: initialData?.weight ?? '',
    material: initialData?.material ?? '',
    inStock: initialData?.inStock ?? true,
    stockCount: initialData?.stockCount?.toString() ?? '0',
    tags: initialData?.tags?.join(', ') ?? '',
    fitment: initialData?.fitment ?? [],
    relatedSkus: initialData?.relatedSkus?.join(', ') ?? '',
  })

  function set(key: keyof FormState, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  function toggleFitment(vehicleId: string) {
    set(
      'fitment',
      form.fitment.includes(vehicleId)
        ? form.fitment.filter((id) => id !== vehicleId)
        : [...form.fitment, vehicleId],
    )
  }

  // Auto-generate SKU from name + part number
  function generateSku() {
    const base = form.name.slice(0, 3).toUpperCase().replace(/\s/g, '')
    const pn = form.partNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
    set('sku', `TYT-${base}-${pn || rand}`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    // Client-side validation
    if (!form.sku.trim()) { setError('SKU is required.'); setSaving(false); return }
    if (!form.name.trim()) { setError('Product name is required.'); setSaving(false); return }
    if (!form.price || isNaN(parseFloat(form.price))) { setError('A valid price is required.'); setSaving(false); return }
    if (!form.categoryId) { setError('Please select a category.'); setSaving(false); return }
    if (!form.partNumber.trim()) { setError('Part number is required.'); setSaving(false); return }

    // Upload any new images to Supabase Storage
    let imageUrls: string[] = []
    try {
      imageUrls = await uploadImagesToStorage(form.sku.trim(), images)
    } catch (uploadErr: any) {
      setError(uploadErr.message)
      setSaving(false)
      return
    }

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      brand: form.brand,
      categoryId: form.categoryId,
      category: categories.find((c) => c.id === form.categoryId)?.name ?? '',
      partNumber: form.partNumber.trim(),
      oemCrossReference: form.oemCrossReference.trim() || undefined,
      weight: form.weight.trim() || undefined,
      material: form.material.trim() || undefined,
      inStock: form.inStock,
      stockCount: parseInt(form.stockCount) || 0,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      fitment: form.fitment,
      relatedSkus: form.relatedSkus.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrls,
    }

    const url = mode === 'edit'
      ? `/api/admin/products/${form.sku}`
      : '/api/admin/products'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      return
    }

    setSaved(true)
    if (mode === 'create') {
      setTimeout(() => router.push('/admin/products'), 1200)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* ── Section: Basic Info ────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Basic Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Product Name" required>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Water Pump Assembly – 1ZZ-FE Engine"
                className={inputCls}
              />
            </Field>
          </div>

          <Field
            label="SKU"
            required
            hint={mode === 'create' ? 'Must be unique. Use the generate button or enter manually.' : 'SKU cannot be changed after creation.'}
          >
            <div className="flex gap-2">
              <input
                value={form.sku}
                onChange={(e) => set('sku', e.target.value.toUpperCase())}
                placeholder="TYT-WP-1ZZFE-OEM"
                disabled={mode === 'edit'}
                className={`${inputCls} font-mono flex-1 ${mode === 'edit' ? 'bg-gray-50 text-gray-400' : ''}`}
              />
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={generateSku}
                  className="h-10 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Auto-generate
                </button>
              )}
            </div>
          </Field>

          <Field label="Part Number" required hint="Toyota OEM part number (e.g. 16100-29085)">
            <input
              value={form.partNumber}
              onChange={(e) => set('partNumber', e.target.value)}
              placeholder="16100-29085"
              className={`${inputCls} font-mono`}
            />
          </Field>

          <Field label="OEM Cross-Reference" hint="Comma-separated alternative part numbers">
            <input
              value={form.oemCrossReference}
              onChange={(e) => set('oemCrossReference', e.target.value)}
              placeholder="16100-29085, 16100-29086"
              className={inputCls}
            />
          </Field>

          <Field label="Category" required>
            <select
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              className={inputCls}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                placeholder="Detailed description of the part, fitment notes, and what's included in the kit…"
                className={textareaCls}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ── Section: Pricing & Inventory ──────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Pricing & Inventory
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Field label="Sale Price (USD)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className={`${inputCls} pl-7`}
              />
            </div>
          </Field>

          <Field label="Compare-at Price" hint="Original / RRP price (shows strikethrough)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => set('compareAtPrice', e.target.value)}
                placeholder="0.00"
                className={`${inputCls} pl-7`}
              />
            </div>
          </Field>

          <Field label="Brand" required>
            <select
              value={form.brand}
              onChange={(e) => set('brand', e.target.value as 'Genuine OEM' | 'Aftermarket')}
              className={inputCls}
            >
              <option value="Genuine OEM">Genuine OEM</option>
              <option value="Aftermarket">Aftermarket</option>
            </select>
          </Field>

          <Field label="Stock Count">
            <input
              type="number"
              min="0"
              value={form.stockCount}
              onChange={(e) => set('stockCount', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <button
              type="button"
              role="switch"
              aria-checked={form.inStock}
              onClick={() => set('inStock', !form.inStock)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.inStock ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.inStock ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Mark as In Stock
            </span>
          </label>
        </div>
      </section>

      {/* ── Section: Technical Details ─────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Technical Details
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Weight" hint="e.g. 1.2 kg">
            <input value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="1.2 kg" className={inputCls} />
          </Field>
          <Field label="Material" hint="e.g. Cast aluminium, steel">
            <input value={form.material} onChange={(e) => set('material', e.target.value)} placeholder="Cast aluminium impeller, steel housing" className={inputCls} />
          </Field>
          <Field label="Tags" hint="Comma-separated: engine, OEM, celica">
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="engine, OEM, celica, timing" className={inputCls} />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Related SKUs" hint="Comma-separated SKUs for 'Often replaced together'">
              <input value={form.relatedSkus} onChange={(e) => set('relatedSkus', e.target.value)} placeholder="TYT-GK-1ZZFE-OEM, TYT-BELT-1ZZFE-OEM" className={`${inputCls} font-mono`} />
            </Field>
          </div>
        </div>
      </section>

      {/* ── Section: Images ────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1 pb-0">
          Product Images
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          The first image is used as the primary listing photo. Drag to reorder via the star button.
          {' '}In production, images upload directly to Supabase Storage.
        </p>
        <ImageUploader value={images} onChange={setImages} maxImages={8} />
      </section>

      {/* ── Section: Vehicle Fitment ───────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Vehicle Fitment</h2>
        <p className="text-xs text-gray-400 mb-5">
          Select every vehicle this part is confirmed to fit. Customers will see a green ✓ for their selected vehicle.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {vehicles.map((v) => {
            const checked = form.fitment.includes(v.id)
            return (
              <label
                key={v.id}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  checked ? 'border-toyota-red bg-red-50' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFitment(v.id)}
                  className="mt-0.5 accent-toyota-red"
                />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${checked ? 'text-toyota-red' : 'text-gray-800'}`}>
                    {v.year} Toyota {v.model}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{v.engine}</p>
                </div>
              </label>
            )
          })}
        </div>
      </section>

      {/* ── Sticky save bar ───────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 flex items-center justify-between rounded-b-2xl">
        <div className="flex-1">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {mode === 'create' ? 'Product created! Redirecting…' : 'Changes saved.'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="h-10 px-5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || saved}
            className="h-10 px-6 bg-toyota-red text-white font-bold rounded-lg text-sm hover:bg-toyota-red-dark transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : mode === 'create' ? (
              'Create Product'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
