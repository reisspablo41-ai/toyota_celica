import type { Vehicle, Category, Part, Review, Testimonial } from './types'

export const TOYOTA_MODELS = [
  'Camry', 'Corolla', 'Hilux', 'Celica', 'Land Cruiser', 'RAV4',
  'Prius', 'Yaris', 'Tacoma', 'Tundra', 'Supra', '4Runner',
]

export const TOYOTA_YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i)

export const ENGINE_OPTIONS: Record<string, string[]> = {
  Camry: ['2.5L 4-Cylinder (2AR-FE)', '3.5L V6 (2GR-FE)', '2.5L Hybrid'],
  Corolla: ['1.8L 4-Cylinder (2ZR-FE)', '2.0L 4-Cylinder (M20A-FKS)'],
  Hilux: ['2.4L Diesel (2GD-FTV)', '2.8L Diesel (1GD-FTV)', '2.7L Petrol (2TR-FE)'],
  Celica: ['1.8L 4-Cylinder (1ZZ-FE)', '1.8L 4-Cylinder (2ZZ-GE)'],
  'Land Cruiser': ['4.5L V8 Diesel (1VD-FTV)', '4.0L V6 (1GR-FE)', '3.3L Diesel (F33A-FTV)'],
  RAV4: ['2.5L 4-Cylinder (2AR-FE)', '2.5L Hybrid', '2.0L Diesel (1AD-FTV)'],
  Prius: ['1.8L Hybrid (2ZR-FXE)', '2.0L Hybrid (M20A-FXS)'],
  Yaris: ['1.5L 4-Cylinder (1NZ-FE)', '1.5L Hybrid (1NZ-FXE)'],
  Tacoma: ['2.7L 4-Cylinder (2TR-FE)', '3.5L V6 (2GR-FKS)'],
  Tundra: ['3.5L V6 Twin Turbo (V35A-FTS)', '5.7L V8 (3UR-FE)'],
  Supra: ['3.0L Inline-6 Turbo (B58)', '2.0L Inline-4 Turbo (B48)'],
  '4Runner': ['4.0L V6 (1GR-FE)', '2.7L 4-Cylinder (2TR-FE)'],
}

function cel(year: number, disp: string, code: string, engine: string): Vehicle {
  return { id: `cel-${year}-${disp}-${code}`, year, make: 'Toyota', model: 'Celica', engine }
}

const celicaVehicles: Vehicle[] = [
  // Generation 7 (T230) 2000–2006 — 1ZZ-FE / 2ZZ-GE
  ...[2000, 2001, 2002, 2003, 2004, 2005, 2006].flatMap(y => [
    cel(y, '18', '1zz', '1.8L 4-Cylinder (1ZZ-FE)'),
    cel(y, '18', '2zz', '1.8L 4-Cylinder (2ZZ-GE)'),
  ]),
  // Generation 6 (T200) 1994–1999 — 5S-FE / 3S-GE
  ...[1994, 1995, 1996, 1997, 1998, 1999].flatMap(y => [
    cel(y, '22', '5sfe', '2.2L 4-Cylinder (5S-FE)'),
    cel(y, '20', '3sge', '2.0L 4-Cylinder (3S-GE)'),
  ]),
  // Generation 5 (T180) 1990–1993 — 5S-FE / 3S-GTE
  ...[1990, 1991, 1992, 1993].flatMap(y => [
    cel(y, '22', '5sfe', '2.2L 4-Cylinder (5S-FE)'),
    cel(y, '20t', '3sgte', '2.0L Turbo (3S-GTE)'),
  ]),
  // Generation 4 (T160) 1986–1989 — 3S-FE / 3S-GTE
  ...[1986, 1987, 1988, 1989].flatMap(y => [
    cel(y, '20', '3sfe', '2.0L 4-Cylinder (3S-FE)'),
    cel(y, '20t', '3sgte', '2.0L Turbo (3S-GTE)'),
  ]),
  // Generation 3 (A60) 1982–1985 — 22R / 2S-E
  ...[1982, 1983, 1984, 1985].flatMap(y => [
    cel(y, '22', '22r', '2.2L 4-Cylinder (22R)'),
    cel(y, '20', '2se', '2.0L 4-Cylinder (2S-E)'),
  ]),
  // Generation 2 (A40) 1978–1981 — 20R / 22R
  ...[1978, 1979, 1980, 1981].flatMap(y => [
    cel(y, '20', '20r', '2.0L 4-Cylinder (20R)'),
    cel(y, '22', '22r', '2.2L 4-Cylinder (22R)'),
  ]),
  // Generation 1 (A20) 1970–1977 — 2T-C / 18R
  ...[1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977].flatMap(y => [
    cel(y, '16', '2tc', '1.6L 4-Cylinder (2T-C)'),
    cel(y, '20', '18r', '2.0L 4-Cylinder (18R)'),
  ]),
]

export const vehicles: Vehicle[] = [
  ...celicaVehicles,
  { id: 'cam-2020-25', year: 2020, make: 'Toyota', model: 'Camry', engine: '2.5L 4-Cylinder (2AR-FE)' },
  { id: 'cam-2020-35v6', year: 2020, make: 'Toyota', model: 'Camry', engine: '3.5L V6 (2GR-FE)' },
  { id: 'hil-2022-28d', year: 2022, make: 'Toyota', model: 'Hilux', engine: '2.8L Diesel (1GD-FTV)' },
  { id: 'cor-2019-18', year: 2019, make: 'Toyota', model: 'Corolla', engine: '1.8L 4-Cylinder (2ZR-FE)' },
  { id: 'lc-2021-45d', year: 2021, make: 'Toyota', model: 'Land Cruiser', engine: '4.5L V8 Diesel (1VD-FTV)' },
  { id: 'rav-2022-25h', year: 2022, make: 'Toyota', model: 'RAV4', engine: '2.5L Hybrid' },
]

export const categories: Category[] = [
  { id: 'engine', name: 'Engine', slug: 'engine', description: 'Gaskets, timing belts, water pumps, oil filters, and all internal engine components.', icon: '⚙️', partCount: 842 },
  { id: 'transmission', name: 'Transmission', slug: 'transmission', description: 'Gearboxes, clutch kits, CVT belts, and drivetrain components.', icon: '🔧', partCount: 314 },
  { id: 'suspension', name: 'Suspension', slug: 'suspension', description: 'Shock absorbers, struts, control arms, tie rods, and bushings.', icon: '🛞', partCount: 526 },
  { id: 'brakes', name: 'Brakes', slug: 'brakes', description: 'Brake pads, rotors, calipers, brake lines, and master cylinders.', icon: '🔴', partCount: 398 },
  { id: 'electrical', name: 'Electrical', slug: 'electrical', description: 'Alternators, starters, sensors, ECU modules, and wiring harnesses.', icon: '⚡', partCount: 673 },
  { id: 'body', name: 'Body & Exterior', slug: 'body', description: 'Bumpers, panels, mirrors, grilles, and all exterior components.', icon: '🚗', partCount: 1204 },
  { id: 'cooling', name: 'Cooling', slug: 'cooling', description: 'Radiators, thermostats, coolant hoses, and fans.', icon: '❄️', partCount: 211 },
  { id: 'fuel', name: 'Fuel System', slug: 'fuel', description: 'Fuel pumps, injectors, filters, and fuel rails.', icon: '⛽', partCount: 189 },
]

export const parts: Part[] = [
  {
    sku: 'TYT-WP-1ZZFE-OEM',
    name: 'Water Pump Assembly – 1ZZ-FE Engine',
    description: 'Genuine Toyota OEM water pump for the 1ZZ-FE engine found in the 2000–2006 Celica GT. Ensures correct coolant flow and prevents overheating. Direct fit, no modifications required.',
    price: 89.95,
    compareAtPrice: 119.00,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '16100-29085',
    oemCrossReference: '16100-29085, 16100-29086',
    weight: '1.2 kg',
    material: 'Cast aluminium impeller, steel housing',
    fitment: ['cel-2003-18-1zz'],
    images: ['/parts/water-pump-main.jpg'],
    inStock: true,
    stockCount: 23,
    rating: 4.8,
    reviewCount: 47,
    relatedSkus: ['TYT-GK-1ZZFE-OEM', 'TYT-BELT-1ZZFE-OEM', 'TYT-THERM-OEM'],
    tags: ['cooling', 'engine', 'OEM', 'celica'],
  },
  {
    sku: 'TYT-GK-1ZZFE-OEM',
    name: 'Head Gasket Set – 1ZZ-FE Engine',
    description: 'Complete multi-layer steel head gasket set for the Toyota 1ZZ-FE engine. Includes head gasket, valve cover gasket, intake and exhaust manifold gaskets.',
    price: 64.50,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '04111-22090',
    oemCrossReference: '04111-22090',
    weight: '0.4 kg',
    material: 'Multi-layer steel (MLS)',
    fitment: ['cel-2003-18-1zz', 'cor-2019-18'],
    images: ['/parts/head-gasket-main.jpg'],
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 31,
    relatedSkus: ['TYT-WP-1ZZFE-OEM', 'TYT-BELT-1ZZFE-OEM'],
    tags: ['engine', 'gasket', 'OEM'],
  },
  {
    sku: 'TYT-BELT-1ZZFE-OEM',
    name: 'Timing Chain Kit – 1ZZ-FE / 2ZZ-GE',
    description: 'OEM-spec timing chain kit for the 1ZZ-FE and 2ZZ-GE engines. Includes chain, tensioner, guides, and all necessary hardware for a complete replacement.',
    price: 142.00,
    compareAtPrice: 185.00,
    brand: 'Genuine OEM',
    category: 'Engine',
    categoryId: 'engine',
    partNumber: '13506-22020',
    weight: '0.9 kg',
    material: 'Hardened steel chain',
    fitment: ['cel-2003-18-1zz', 'cel-2003-18-2zz'],
    images: ['/parts/timing-chain-main.jpg'],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviewCount: 22,
    relatedSkus: ['TYT-WP-1ZZFE-OEM', 'TYT-GK-1ZZFE-OEM'],
    tags: ['engine', 'timing', 'OEM', 'celica'],
  },
  {
    sku: 'TYT-BP-CAM-FRONT-OEM',
    name: 'Front Brake Pad Set – Camry 2018–2024',
    description: 'Genuine Toyota front brake pads for the Camry XV70. Low-dust, low-noise formula with wear indicator. Matches factory stopping performance exactly.',
    price: 54.90,
    brand: 'Genuine OEM',
    category: 'Brakes',
    categoryId: 'brakes',
    partNumber: '04465-06190',
    oemCrossReference: '04465-06190, 04465-AZ101',
    weight: '0.7 kg',
    material: 'Semi-metallic compound',
    fitment: ['cam-2020-25', 'cam-2020-35v6'],
    images: ['/parts/brake-pads-main.jpg'],
    inStock: true,
    stockCount: 42,
    rating: 4.8,
    reviewCount: 89,
    relatedSkus: ['TYT-ROTOR-CAM-FRONT', 'TYT-BP-CAM-REAR-OEM'],
    tags: ['brakes', 'Camry', 'OEM'],
  },
  {
    sku: 'TYT-ROTOR-CAM-FRONT',
    name: 'Front Brake Rotor – Camry 2018–2024',
    description: 'OEM-specification vented front brake rotor for the Toyota Camry XV70 series. Precision-machined for zero runout and extended pad life.',
    price: 78.00,
    compareAtPrice: 95.00,
    brand: 'Genuine OEM',
    category: 'Brakes',
    categoryId: 'brakes',
    partNumber: '43512-06220',
    weight: '5.1 kg',
    material: 'Grey cast iron',
    fitment: ['cam-2020-25', 'cam-2020-35v6'],
    images: ['/parts/brake-rotor-main.jpg'],
    inStock: true,
    stockCount: 19,
    rating: 4.6,
    reviewCount: 38,
    relatedSkus: ['TYT-BP-CAM-FRONT-OEM'],
    tags: ['brakes', 'rotor', 'Camry'],
  },
  {
    sku: 'TYT-STRUT-HIL-FRONT',
    name: 'Front Strut Assembly – Hilux Revo 2015+',
    description: 'Complete front strut assembly for the Toyota Hilux Revo (AN120/AN130). Includes shock absorber, spring, and top mount. Ready to install.',
    price: 219.00,
    brand: 'Genuine OEM',
    category: 'Suspension',
    categoryId: 'suspension',
    partNumber: '48520-09891',
    weight: '8.4 kg',
    material: 'High-tensile steel, polyurethane bump stop',
    fitment: ['hil-2022-28d'],
    images: ['/parts/strut-main.jpg'],
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    reviewCount: 14,
    relatedSkus: [],
    tags: ['suspension', 'Hilux', 'OEM'],
  },
  {
    sku: 'TYT-ALT-2AR-AFT',
    name: 'Alternator – 2AR-FE Camry (Aftermarket)',
    description: 'High-output 130A alternator compatible with Toyota Camry 2.5L models. Remanufactured to OEM specifications with a 2-year warranty. Significant saving over genuine parts.',
    price: 169.00,
    compareAtPrice: 310.00,
    brand: 'Aftermarket',
    category: 'Electrical',
    categoryId: 'electrical',
    partNumber: '27060-0V150-84',
    oemCrossReference: '27060-0V150',
    weight: '3.8 kg',
    material: 'Copper windings, aluminium housing',
    fitment: ['cam-2020-25'],
    images: ['/parts/alternator-main.jpg'],
    inStock: true,
    stockCount: 6,
    rating: 4.4,
    reviewCount: 27,
    relatedSkus: [],
    tags: ['electrical', 'alternator', 'Camry', 'aftermarket'],
  },
  {
    sku: 'TYT-THERM-OEM',
    name: 'Engine Thermostat – 1ZZ / 2ZZ / 1NZ',
    description: 'Genuine Toyota thermostat and housing assembly. Opens at 80°C for optimal engine temperature management. Fits multiple 4-cylinder models.',
    price: 28.50,
    brand: 'Genuine OEM',
    category: 'Cooling',
    categoryId: 'cooling',
    partNumber: '90916-03129',
    weight: '0.2 kg',
    material: 'Wax-element thermostat, brass housing',
    fitment: ['cel-2003-18-1zz', 'cel-2003-18-2zz', 'cor-2019-18'],
    images: ['/parts/thermostat-main.jpg'],
    inStock: true,
    stockCount: 54,
    rating: 4.7,
    reviewCount: 63,
    relatedSkus: ['TYT-WP-1ZZFE-OEM'],
    tags: ['cooling', 'OEM'],
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    sku: 'TYT-WP-1ZZFE-OEM',
    author: 'Dave M.',
    rating: 5,
    title: 'Perfect fit, no leaks',
    body: 'Replaced my failing pump on a 2003 Celica GT. Part number matched exactly and the install was straightforward. Coolant temp back to normal. Highly recommend going OEM for this job.',
    date: '2026-02-14',
    verified: true,
  },
  {
    id: 'r2',
    sku: 'TYT-WP-1ZZFE-OEM',
    author: 'Sarah K.',
    rating: 5,
    title: 'Arrived fast, genuine Toyota packaging',
    body: 'Came in genuine Toyota box with the correct gasket included. Arrived next day. Very happy.',
    date: '2026-01-30',
    verified: true,
  },
  {
    id: 'r3',
    sku: 'TYT-BP-CAM-FRONT-OEM',
    author: 'James L.',
    rating: 5,
    title: 'No noise, stops perfectly',
    body: 'Swapped out the worn OEM pads on my XV70 Camry. These are silent and bite well. Exactly what I needed.',
    date: '2026-03-05',
    verified: true,
  },
]

export function getPartBySku(sku: string): Part | undefined {
  return parts.find((p) => p.sku === sku)
}

export function getPartsByCategory(categoryId: string): Part[] {
  return parts.filter((p) => p.categoryId === categoryId)
}

export function getCompatibleParts(vehicleId: string): Part[] {
  return parts.filter((p) => p.fitment.includes(vehicleId))
}

export function getRelatedParts(sku: string): Part[] {
  const part = getPartBySku(sku)
  if (!part?.relatedSkus?.length) return []
  return part.relatedSkus.map((s) => getPartBySku(s)).filter(Boolean) as Part[]
}

export function checkFitment(sku: string, vehicleId: string): boolean {
  const part = getPartBySku(sku)
  return part?.fitment.includes(vehicleId) ?? false
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getReviewsForSku(sku: string): Review[] {
  return reviews.filter((r) => r.sku === sku)
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Marcus T.',
    location: 'Atlanta, GA',
    vehicle: '2003 Toyota Celica GT',
    rating: 5,
    quote: 'I\'ve been chasing the right water pump for my Celica for weeks. Every other site sent me the wrong part or couldn\'t confirm fitment. ToyotaParts Direct had the exact OEM part number, confirmed it for my 1ZZ-FE, and it arrived next day. The car is back on the road.',
    partBought: 'Water Pump Assembly – 1ZZ-FE',
    date: 'March 2026',
    avatarInitials: 'MT',
    avatarColor: '#EB0A1E',
  },
  {
    id: 't2',
    author: 'Priya S.',
    location: 'Melbourne, AU',
    vehicle: '2020 Toyota Camry 2.5L',
    rating: 5,
    quote: 'Ordered the front brake pad and rotor set for my XV70 Camry. The fitment checker confirmed compatibility in seconds. Parts arrived well packaged, genuine Toyota box, exactly as described. Fitted them myself in under an hour. Absolutely the best online Toyota parts experience I\'ve had.',
    partBought: 'Front Brake Pad + Rotor Set',
    date: 'February 2026',
    avatarInitials: 'PS',
    avatarColor: '#2563eb',
  },
  {
    id: 't3',
    author: 'Ryan O.',
    location: 'Nairobi, KE',
    vehicle: '2022 Toyota Hilux Revo 2.8D',
    rating: 5,
    quote: 'Sourcing OEM struts for a Hilux Revo locally is a nightmare — everything is pattern-copy aftermarket. I ordered the genuine OEM front strut assembly here, shipped internationally. It arrived in 6 days, perfectly packaged, no damage. Worth every penny to get the real part.',
    partBought: 'Front Strut Assembly – Hilux Revo',
    date: 'January 2026',
    avatarInitials: 'RO',
    avatarColor: '#16a34a',
  },
  {
    id: 't4',
    author: 'Claire W.',
    location: 'Houston, TX',
    vehicle: '2019 Toyota Corolla 1.8L',
    rating: 5,
    quote: 'The head gasket set for my Corolla was exactly right. I was nervous ordering online because a mismatched gasket is a disaster, but the fitment database showed confirmed compatibility with my VIN. The support team even replied to my email in under 2 hours to double-check. Outstanding service.',
    partBought: 'Head Gasket Set – 1ZZ-FE',
    date: 'March 2026',
    avatarInitials: 'CW',
    avatarColor: '#7c3aed',
  },
  {
    id: 't5',
    author: 'James P.',
    location: 'Toronto, CA',
    vehicle: '2020 Toyota Camry V6',
    rating: 5,
    quote: 'The aftermarket alternator for my 2GR-FE saved me $140 versus the dealer price. It came with a 2-year warranty and fits perfectly. I was sceptical about aftermarket, but the product listing was honest about what it was, and so far after 3 months it\'s running flawlessly.',
    partBought: 'Alternator – 2AR-FE (Aftermarket)',
    date: 'December 2025',
    avatarInitials: 'JP',
    avatarColor: '#b45309',
  },
  {
    id: 't6',
    author: 'Aiko N.',
    location: 'Osaka, JP',
    vehicle: '2003 Toyota Celica GT-S',
    rating: 5,
    quote: 'Found the 2ZZ-GE timing chain kit that I could not find anywhere in Japan at a reasonable price. Shipped to Japan, arrived in 5 business days. The part is genuine OEM — I can tell immediately from the Toyota packaging and casting quality. This site is now my go-to.',
    partBought: 'Timing Chain Kit – 2ZZ-GE',
    date: 'February 2026',
    avatarInitials: 'AN',
    avatarColor: '#0891b2',
  },
]

export const featuredSkus = [
  'TYT-WP-1ZZFE-OEM',
  'TYT-BP-CAM-FRONT-OEM',
  'TYT-BELT-1ZZFE-OEM',
  'TYT-ALT-2AR-AFT',
]
