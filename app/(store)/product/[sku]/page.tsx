import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PartCard from '@/components/PartCard'
import FitmentChecker from '@/components/FitmentChecker'
import ProductImageGallery from '@/components/ProductImageGallery'
import { getStorePartBySku, getRelatedStoreParts, getReviewsForSku } from '@/lib/services/store-service'
import { getCategoryById } from '@/lib/services/admin-service'
import AddToCart from '@/components/AddToCart'

interface ProductPageProps {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { sku } = await params
  const part = await getStorePartBySku(sku)
  if (!part) return {}
  return {
    title: `${part.name} – ${part.partNumber}`,
    description: part.description.slice(0, 160),
  }
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-400">({count} reviews)</span>
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku } = await params
  
  const [part, reviews, relatedParts] = await Promise.all([
    getStorePartBySku(sku),
    getReviewsForSku(sku),
    getRelatedStoreParts(sku),
  ])

  if (!part) notFound()
  const category = await getCategoryById(part.categoryId)

  const discount = part.compareAtPrice
    ? Math.round(((part.compareAtPrice - part.price) / part.compareAtPrice) * 100)
    : 0

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={`/category/${category.id}`} className="hover:text-gray-700">
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{part.name}</span>
          </nav>
        </div>
      </div>

      {/* Product main section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <ProductImageGallery part={part} />

          {/* Right: Product Info */}
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">
                  {part.brand}
                </span>
                <span className="text-xs font-mono text-gray-400">{part.sku}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">{part.name}</h1>
              <div className="mt-3">
                <StarRating rating={part.rating} count={part.reviewCount} />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-gray-100">
              <span className="text-4xl font-black text-gray-900">${part.price.toFixed(2)}</span>
              {part.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">${part.compareAtPrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-toyota-red">Save ${(part.compareAtPrice! - part.price).toFixed(2)}</span>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${part.inStock ? 'bg-green-500' : 'bg-red-400'}`}
              />
              <span className={`text-sm font-medium ${part.inStock ? 'text-green-700' : 'text-red-600'}`}>
                {part.inStock ? `In Stock – ${part.stockCount} units available` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{part.description}</p>

            {/* Add to Cart */}
            <AddToCart part={part} />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {[
                { icon: '🚚', text: 'Next-day shipping' },
                { icon: '↩️', text: '30-day returns' },
                { icon: '🔒', text: 'Secure checkout' },
              ].map((item) => (
                <div key={item.text} className="text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider leading-tight">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Fitment Checker */}
            <FitmentChecker part={part} />
          </div>
        </div>

        {/* Tech Specs */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-toyota-red rounded-full" />
              Technical Specifications
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: 'Part Number', value: part.partNumber },
                    { label: 'SKU', value: part.sku },
                    { label: 'Brand', value: part.brand },
                    { label: 'Category', value: part.category },
                    ...(part.oemCrossReference ? [{ label: 'OEM Cross-Reference', value: part.oemCrossReference }] : []),
                    ...(part.weight ? [{ label: 'Weight', value: part.weight }] : []),
                    ...(part.material ? [{ label: 'Material', value: part.material }] : []),
                  ].map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}
                    >
                      <td className="px-4 py-3.5 font-bold text-gray-600 w-2/5 border-r border-gray-100">{row.label}</td>
                      <td className="px-4 py-3.5 text-gray-900 font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping & Returns info */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
               Shipping & Returns
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  icon: '📦',
                  title: 'Standard Shipping',
                  body: '3–5 business days. Free on orders over $150.',
                  color: 'bg-blue-50/50'
                },
                {
                  icon: '⚡',
                  title: 'Express Delivery',
                  body: 'Order before 2 PM for next business day delivery.',
                  color: 'bg-amber-50/50'
                },
                {
                  icon: '↩️',
                  title: 'Easy Returns',
                  body: 'Return unused parts within 30 days for a full refund.',
                  color: 'bg-green-50/50'
                },
                {
                  icon: '🌏',
                  title: 'International',
                  body: 'We ship worldwide. Duties may apply at destination.',
                  color: 'bg-purple-50/50'
                },
              ].map((item) => (
                <div key={item.title} className={`p-4 rounded-xl border border-gray-100 ${item.color}`}>
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <p className="font-bold text-sm text-gray-900 mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        {reviews.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-200 pb-4">Customer Reviews</h2>
            <div className="flex flex-col md:flex-row gap-8 mb-10 items-start md:items-center">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[180px]">
                <p className="text-6xl font-black text-gray-900 mb-2">{part.rating.toFixed(1)}</p>
                <div className="flex justify-center mb-2">
                   <StarRating rating={part.rating} count={part.reviewCount} />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{part.reviewCount} verified reviews</p>
              </div>
              <div className="flex-1 space-y-2 max-w-sm">
                 {[5,4,3,2,1].map(num => (
                   <div key={num} className="flex items-center gap-3">
                     <span className="text-xs font-bold text-gray-500 w-3">{num}</span>
                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden text-[0px]">
                       <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${num === 5 ? 85 : num === 4 ? 12 : 3}%` }}
                       />
                     </div>
                     <span className="text-xs text-gray-400 w-8">{num === 5 ? 85 : num === 4 ? 12 : 3}%</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-toyota-red/10 flex items-center justify-center text-toyota-red font-black text-sm">
                        {review.author_name?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{review.author_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {review.is_verified && (
                       <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400' : 'text-gray-100'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-bold text-gray-900 mb-2 leading-snug">{review.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{review.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Often replaced together */}
        {relatedParts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-7 bg-toyota-red rounded-full" />
              Often Replaced Together
            </h2>
            <p className="text-sm text-gray-500 mb-8 ml-3.5">
              Customers who bought this part also replaced these components at the same time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedParts.map((related) => (
                <PartCard key={related.sku} part={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
