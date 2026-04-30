'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: {
  sku: string
  authorName: string
  rating: number
  title: string
  body: string
}) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database connection error' }
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .insert([
      {
        sku: formData.sku,
        author_name: formData.authorName,
        rating: formData.rating,
        title: formData.title,
        body: formData.body,
        is_approved: true, // Auto-approve for now as requested
        is_verified: false, // Default to false for anonymous reviews
      },
    ])

  if (error) {
    console.error('Error submitting review:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/product/${formData.sku}`)
  revalidatePath('/admin/reviews')
  return { success: true }
}

export async function deleteReview(id: number, sku: string) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database connection error' }
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/product/${sku}`)
  revalidatePath('/admin/reviews')
  return { success: true }
}
