const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPBASE_SECRET_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  const sku = 'TYT-WP-1ZZFE-OEM'
  const { data, error } = await supabaseAdmin
    .from('parts')
    .select('*, categories(name), part_images(url, is_primary)')
    .eq('sku', sku)
    .single()

  if (error) {
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
  } else {
    console.log('Part found:', data.name)
  }
}

test()
