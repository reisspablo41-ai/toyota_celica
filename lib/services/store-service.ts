import { supabaseAdmin, supabase } from '@/lib/supabase'
import type { Part, PartBrand, Category } from '@/lib/types'

// Use the service-role client on the server so joins on part_images / part_fitment
// are not blocked by the anon-key's table-level permissions. Falls back to the
// public client only if the secret key is not configured.
const db = supabaseAdmin ?? supabase

function mapDbPart(row: any): Part {
  const images: string[] = (row.part_images ?? [])
    .slice()
    .sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return (a.sort_order ?? 0) - (b.sort_order ?? 0)
    })
    .map((img: any) => img.url as string)

  return {
    sku: row.sku,
    name: row.name,
    description: row.description ?? '',
    price: parseFloat(row.price),
    compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : undefined,
    brand: row.brand as PartBrand,
    category: row.categories?.name ?? '',
    categoryId: row.category_id,
    partNumber: row.part_number,
    oemCrossReference: row.oem_cross_ref ?? '',
    weight: row.weight_kg ? `${row.weight_kg} kg` : undefined,
    material: row.material ?? '',
    fitment: (row.part_fitment ?? []).map((f: any) => f.vehicle_id as string),
    images,
    inStock: row.in_stock,
    stockCount: row.stock_count,
    rating: parseFloat(row.rating ?? '0'),
    reviewCount: row.review_count ?? 0,
    tags: row.tags ?? [],
  }
}

function mapDbCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '⚙️',
    partCount: row.parts?.[0]?.count ?? 0,
  }
}

const PART_SELECT =
  '*, categories(name), part_images(url, is_primary, sort_order), part_fitment(vehicle_id)'

export const STORE_PAGE_SIZE = 12

export interface StoreFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  query?: string
  model?: string
  year?: string
  vehicleId?: string  // exact vehicle ID — highest priority fitment filter
  page?: number
}

export interface StorePartsResult {
  parts: Part[]
  total: number
}

export async function getStoreParts(filters: StoreFilters = {}): Promise<StorePartsResult> {
  const { category, brand, minPrice, maxPrice, inStockOnly, query, model, year, vehicleId, page = 1 } = filters
  const from = (page - 1) * STORE_PAGE_SIZE
  const to = from + STORE_PAGE_SIZE - 1

  // Resolve fitment filter to a list of SKUs first
  let skuFilter: string[] | null = null

  if (vehicleId) {
    // Exact vehicle — look up parts for that specific vehicle ID
    const { data: fitment } = await db
      .from('part_fitment')
      .select('sku')
      .eq('vehicle_id', vehicleId)

    skuFilter = [...new Set((fitment ?? []).map((f: { sku: string }) => f.sku))]
    if (skuFilter.length === 0) return { parts: [], total: 0 }
  } else if (model) {
    // Model (+ optional year) filter
    let vq = db.from('vehicles').select('id').ilike('model', `%${model}%`)
    if (year) vq = vq.eq('year', parseInt(year))

    const { data: vehicles } = await vq
    if (!vehicles || vehicles.length === 0) return { parts: [], total: 0 }

    const { data: fitment } = await db
      .from('part_fitment')
      .select('sku')
      .in('vehicle_id', vehicles.map((v: { id: string }) => v.id))

    skuFilter = [...new Set((fitment ?? []).map((f: { sku: string }) => f.sku))]
    if (skuFilter.length === 0) return { parts: [], total: 0 }
  }

  let q = db
    .from('parts')
    .select(PART_SELECT, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category) q = q.eq('category_id', category)
  if (brand) q = q.eq('brand', brand as PartBrand)
  if (minPrice !== undefined && minPrice > 0) q = q.gte('price', minPrice)
  if (maxPrice !== undefined && maxPrice !== Infinity) q = q.lte('price', maxPrice)
  if (inStockOnly) q = q.eq('in_stock', true)
  if (skuFilter !== null) q = q.in('sku', skuFilter)
  if (query) {
    q = q.or(
      `name.ilike.%${query}%,part_number.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  const { data, error, count } = await q
  if (error) {
    console.error('[getStoreParts]', error.message)
    return { parts: [], total: 0 }
  }

  return { parts: (data ?? []).map(mapDbPart), total: count ?? 0 }
}

export async function getFeaturedParts(limit = 4): Promise<Part[]> {
  const { data, error } = await db
    .from('parts')
    .select(PART_SELECT)
    .eq('is_active', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getFeaturedParts]', error.message)
    return []
  }

  return (data ?? []).map(mapDbPart)
}

export async function getStorePartBySku(sku: string): Promise<Part | null> {
  const { data, error } = await db
    .from('parts')
    .select(PART_SELECT)
    .eq('sku', sku)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('[getStorePartBySku]', error.message)
    return null
  }

  return mapDbPart(data)
}

export async function getRelatedStoreParts(sku: string): Promise<Part[]> {
  // 1. Get related SKUs
  const { data: relatedData, error: relatedError } = await db
    .from('related_parts')
    .select('related_sku')
    .eq('sku', sku)

  if (relatedError || !relatedData || relatedData.length === 0) return []

  // 2. Fetch the corresponding parts
  const skus = relatedData.map((r: { related_sku: string }) => r.related_sku)
  const { data, error } = await db
    .from('parts')
    .select(PART_SELECT)
    .in('sku', skus)
    .eq('is_active', true)

  if (error) {
    console.error('[getRelatedStoreParts]', error.message)
    return []
  }

  return (data ?? []).map(mapDbPart)
}

export async function getReviewsForSku(sku: string) {
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('sku', sku)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getReviewsForSku]', error.message)
    return []
  }

  return data || []
}

export async function getStoreCategories(): Promise<Category[]> {
  const { data, error } = await db
    .from('categories')
    .select('*, parts(count)')
    .eq('parts.is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getStoreCategories]', error.message)
    return []
  }

  return (data ?? []).map(mapDbCategory)
}

export async function getStoreStats() {
  const [
    { count: totalParts },
    { data: vehicles },
  ] = await Promise.all([
    db.from('parts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('vehicles').select('model'),
  ])

  const uniqueModels = new Set(vehicles?.map(v => v.model)).size

  return {
    totalParts: totalParts || 0,
    totalModels: uniqueModels || 0,
  }
}
