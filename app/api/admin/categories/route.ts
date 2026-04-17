import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/admin/categories – create a new category
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  try {
    const body = await request.json()

    // Validation
    if (!body.id || !body.name || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: id, name, slug' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        id: body.id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        icon: body.icon,
        sort_order: body.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Category ID or Slug already exists' }, { status: 409 })
      throw error
    }

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 })
  }
}
