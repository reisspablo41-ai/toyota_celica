import { getPartBySku } from './lib/services/admin-service'

async function test() {
  try {
    const part = await getPartBySku('TYT-WP-1ZZFE-OEM')
    console.log('Part found:', part ? part.name : 'null')
  } catch (e) {
    console.error('Error:', e)
  }
}

test()
