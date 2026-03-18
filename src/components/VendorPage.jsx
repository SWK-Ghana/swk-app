import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const categoryColors = {
  'Agribusiness': 'bg-green-100 text-green-700',
  'Recycled & Upcycled': 'bg-blue-100 text-blue-700',
  'Handmade Crafts': 'bg-purple-100 text-purple-700',
  'Organic Produce': 'bg-[#F2FAE8] text-[#1E963C]',
}

const emptyOrder = {
  productId: null,
  productName: '',
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  quantity: 1,
  deliveryAddress: '',
  notes: '',
}

// Convert business name to URL-safe slug
const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const VendorPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orderModal, setOrderModal] = useState(null)
  const [order, setOrder] = useState(emptyOrder)
  const [orderStatus, setOrderStatus] = useState('idle')

  useEffect(() => {
    const stored = localStorage.getItem('swk_marketplace_products')
    if (stored) setProducts(JSON.parse(stored))
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOrderModal(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Find vendor's products by matching slug to business name
  const vendorProducts = products.filter(p =>
    p.approved && toSlug(p.business || '') === slug
  )

  const vendorName = vendorProducts[0]?.business || ''
  const vendorLocation = vendorProducts[0]?.location || ''

  const openOrder = (product) => {
    setOrder({ ...emptyOrder, productId: product.id, productName: product.productName })
    setOrderStatus('idle')
    setOrderModal(product)
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    setOrderStatus('sending')
    try {
      await fetch('https://formspree.io/f/mvzwqozw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Marketplace Order — ${order.productName}`,
          product: order.productName,
          vendor: vendorName,
          buyer_name: order.buyerName,
          buyer_email: order.buyerEmail,
          buyer_phone: order.buyerPhone,
          quantity: order.quantity,
          delivery_address: order.deliveryAddress,
          notes: order.notes || 'N/A',
          form_type: 'Marketplace Order',
        }),
      })
      setOrderStatus('success')
    } catch { setOrderStatus('error') }
  }

  // Vendor not found
  if (products.length > 0 && vendorProducts.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Vendor not found</h2>
          <p className="text-gray-700 mb-6">This vendor may have removed their listings or the link may be incorrect.</p>
          <button onClick={() => navigate('/marketplace')} className="btn-gradient px-6 py-3">
            ← Back to Marketplace
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── Vendor Hero Banner ── */}
      <div className="bg-[#1E963C] py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Vendor Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#78C31E] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                {vendorName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-block bg-[#78C31E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Verified Vendor
                </span>
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  🌱 SDG 12 Aligned
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2 mb-1">
                {vendorName}
              </h1>
              {vendorLocation && (
                <p className="text-white/70 text-base">
                  📍 {vendorLocation}
                </p>
              )}
              <p className="text-white/60 text-sm mt-1">
                {vendorProducts.length} product{vendorProducts.length !== 1 ? 's' : ''} listed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Products by {vendorName}
            </h2>
            <p className="text-gray-700 mt-1 text-sm">
              All products from this vendor are reviewed and approved by SWK Ghana.
            </p>
          </div>
        </div>

        {vendorProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#F2FAE8] rounded-2xl border border-[#D4F0A0]">
            <span className="text-5xl mb-4 block">🌱</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading products...</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {vendorProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group">
                {/* Product Image */}
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.productName} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#F2FAE8] to-[#E0F5C0] flex items-center justify-center">
                    <span className="text-5xl">🌱</span>
                  </div>
                )}

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[product.category] || 'bg-gray-100 text-gray-800'}`}>
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{product.productName}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed flex-1 mb-4 line-clamp-3">{product.description}</p>

                  {/* Price + Order */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-[#1E963C]">
                        {product.price ? `GHS ${product.price}` : 'Contact for price'}
                      </span>
                      {product.unit && <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>}
                    </div>
                    <button
                      onClick={() => openOrder(product)}
                      className="btn-gradient px-4 py-1.5 text-xs font-semibold rounded-lg"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Contact Vendor Banner ── */}
        <div className="mt-12 bg-[#F2FAE8] border border-[#D4F0A0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Want to get in touch with {vendorName}?</h3>
            <p className="text-gray-700 text-sm">Submit an order inquiry on any product and SWK Ghana will connect you with this vendor.</p>
          </div>
          <button
            onClick={() => vendorProducts[0] && openOrder(vendorProducts[0])}
            className="btn-gradient px-6 py-3 text-sm flex-shrink-0"
          >
            Contact Vendor
          </button>
        </div>

        {/* ── Browse More ── */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/marketplace')}
            className="text-sm font-semibold text-[#78C31E] hover:text-[#1E963C] hover:underline transition-colors"
          >
            ← Browse all products on SWK Marketplace
          </button>
        </div>
      </div>

      {/* ══ ORDER MODAL ══ */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOrderModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Place an Order</h3>
              <button aria-label="Close" className="text-gray-700 hover:text-gray-900 text-xl" onClick={() => setOrderModal(null)}>✕</button>
            </div>

            {/* Product summary */}
            <div className="flex items-center gap-3 bg-[#F2FAE8] border border-[#D4F0A0] rounded-xl p-3 mb-5">
              {orderModal.imageUrl ? (
                <img src={orderModal.imageUrl} alt={orderModal.productName} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 bg-[#D4F0A0] rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-2xl">🌱</span></div>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-sm">{orderModal.productName}</p>
                <p className="text-xs text-gray-700">by <span className="font-medium text-[#78C31E]">{orderModal.business}</span></p>
                <p className="text-sm font-bold text-[#1E963C]">{orderModal.price ? `GHS ${orderModal.price}` : 'Contact for price'}{orderModal.unit ? ` / ${orderModal.unit}` : ''}</p>
              </div>
            </div>

            {orderStatus === 'success' ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 bg-[#F2FAE8] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Order Received!</h4>
                <p className="text-sm text-gray-800 mb-5">Thank you, {order.buyerName.split(' ')[0]}! We'll contact you shortly to confirm your order.</p>
                <button onClick={() => setOrderModal(null)} className="btn-gradient px-6 py-2 text-sm">Close</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleOrderSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                    <input required type="text" value={order.buyerName} onChange={e => setOrder({ ...order, buyerName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input required type="tel" value={order.buyerPhone} onChange={e => setOrder({ ...order, buyerPhone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="+233..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={order.buyerEmail} onChange={e => setOrder({ ...order, buyerEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input required type="number" min={1} value={order.quantity} onChange={e => setOrder({ ...order, quantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery address *</label>
                  <textarea required rows={2} value={order.deliveryAddress} onChange={e => setOrder({ ...order, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="Where should we deliver?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea rows={2} value={order.notes} onChange={e => setOrder({ ...order, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="Any special requests..." />
                </div>
                {orderStatus === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOrderModal(null)} className="px-4 py-2 border rounded-lg text-gray-800 text-sm">Cancel</button>
                  <button type="submit" disabled={orderStatus === 'sending'} className="btn-gradient flex-1 py-2.5 disabled:opacity-60 text-sm">
                    {orderStatus === 'sending' ? 'Sending...' : 'Submit Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default VendorPage