import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const CATEGORIES = ['All', 'Agribusiness', 'Recycled & Upcycled', 'Handmade Crafts', 'Organic Produce']

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

const Marketplace = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [orderModal, setOrderModal] = useState(null) // product object
  const [order, setOrder] = useState(emptyOrder)
  const [orderStatus, setOrderStatus] = useState('idle')
  const [vendorModal, setVendorModal] = useState(false)
  const [vendor, setVendor] = useState({ name: '', email: '', phone: '', business: '', category: '', productName: '', description: '', price: '', unit: '', location: '', imageUrl: '', notes: '' })
  const [vendorStatus, setVendorStatus] = useState('idle')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('swk_marketplace_products')
    if (stored) setProducts(JSON.parse(stored))
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOrderModal(null); setVendorModal(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = products.filter(p => {
    if (!p.approved) return false
    if (activeCategory !== 'All' && p.category !== activeCategory) return false
    if (search && !p.productName.toLowerCase().includes(search.toLowerCase()) && !p.business.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

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

  const handleVendorSubmit = async (e) => {
    e.preventDefault()
    setVendorStatus('sending')
    try {
      await fetch('https://formspree.io/f/mvzwqozw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New Vendor Submission — ${vendor.productName}`,
          ...vendor,
          form_type: 'Vendor Product Submission',
        }),
      })
      setVendorStatus('success')
    } catch { setVendorStatus('error') }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 xs:mb-10">
            <span className="inline-block text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3 bg-[#F2FAE8] text-[#1E963C]">Youth Ventures</span>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 mb-3">SWK Marketplace</h1>
            <p className="text-base xs:text-lg text-gray-800 max-w-2xl mx-auto mb-6">
              Shop directly from Ghana's youth-led agribusiness and circular economy ventures. Every purchase supports a young entrepreneur.
            </p>
            <button onClick={() => { setVendor({ name: '', email: '', phone: '', business: '', category: '', productName: '', description: '', price: '', unit: '', location: '', imageUrl: '', notes: '' }); setVendorStatus('idle'); setAgreedToTerms(false); setVendorModal(true) }}
              className="btn-gradient px-6 py-2.5 text-sm xs:text-base">
              + List Your Product
            </button>
          </div>

          {/* Search + Filters */}
          <div className="mb-6 xs:mb-8">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md mx-auto block px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78C31E] text-sm mb-4"
              placeholder="Search products or vendors..." />
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-[#78C31E] text-white' : 'bg-white text-gray-800 border border-gray-200 hover:border-[#78C31E]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <span className="text-5xl mb-4 block">🛒</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products yet</h3>
              <p className="text-gray-700 text-sm mb-5">Be the first to list your product on the SWK Marketplace!</p>
              <button onClick={() => setVendorModal(true)} className="btn-gradient px-6 py-2.5 text-sm">List Your Product</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xs:gap-6">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} className="w-full h-48 object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#F2FAE8] to-[#E0F5C0] flex items-center justify-center">
                      <span className="text-5xl">🌱</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[product.category] || 'bg-gray-100 text-gray-800'}`}>
                        {product.category}
                      </span>
                      {product.location && <span className="text-xs text-gray-400">📍 {product.location}</span>}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{product.productName}</h3>
                    <p className="text-xs text-gray-700 mb-1">by <button onClick={() => navigate(`/marketplace/vendor/${toSlug(product.business)}`)} className="font-semibold text-[#78C31E] hover:text-[#1E963C] hover:underline transition-colors">{product.business}</button></p>
                    <p className="text-xs text-gray-800 leading-relaxed flex-1 mb-3 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-[#1E963C]">
                          {product.price ? `GHS ${product.price}` : 'Contact for price'}
                        </span>
                        {product.unit && <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>}
                      </div>
                      <button onClick={() => openOrder(product)}
                        className="btn-gradient px-4 py-1.5 text-xs font-semibold rounded-lg">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <div className="mt-10 bg-[#1E963C] rounded-2xl p-6 xs:p-8 text-white text-center">
            <h2 className="text-xl xs:text-2xl font-bold mb-2">Are you a young entrepreneur?</h2>
            <p className="text-white/70 text-sm xs:text-base mb-5 max-w-xl mx-auto">
              List your agribusiness or circular economy product on SWK Marketplace and reach customers across Ghana. It's completely free.
            </p>
            <button onClick={() => setVendorModal(true)} className="bg-white text-[#1E963C] font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm xs:text-base">
              List Your Product →
            </button>
          </div>
        </div>
      </div>

      {/* ORDER MODAL */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOrderModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Place an Order</h3>
              <button aria-label="Close" className="text-gray-700 hover:text-gray-700 text-xl" onClick={() => setOrderModal(null)}>✕</button>
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
                <p className="text-xs text-gray-700">by {orderModal.business}</p>
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
                <p className="text-sm text-gray-800 mb-5">Thank you, {order.buyerName.split(' ')[0]}! We'll contact you shortly to confirm your order and arrange delivery.</p>
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

      {/* VENDOR SUBMISSION MODAL */}
      {vendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setVendorModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">List Your Product</h3>
              <button aria-label="Close" className="text-gray-700 hover:text-gray-700 text-xl" onClick={() => setVendorModal(false)}>✕</button>
            </div>

            {/* Sustainability notice */}
            <div className="bg-[#F2FAE8] border border-[#C0E870] rounded-xl p-3 mb-5">
              <div className="flex items-start gap-2">
                <span className="text-[#78C31E] text-lg flex-shrink-0">🌱</span>
                <div>
                  <p className="text-sm font-semibold text-[#1E963C] mb-1">Sustainability Requirement</p>
                  <p className="text-xs text-[#1E963C] leading-relaxed">
                    All products listed on SWK Marketplace must align with <strong>UN SDG 12 — Responsible Consumption and Production</strong>. Products must be eco-friendly, sustainably sourced or made, and minimize environmental harm. SWK Ghana reserves the right to reject any product that does not meet these criteria.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-5">Fill in your product details. Our team will review and publish it within 24–48 hours.</p>

            {vendorStatus === 'success' ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 bg-[#F2FAE8] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Submission Received!</h4>
                <p className="text-sm text-gray-800 mb-5">Thank you! We'll review your product and publish it within 24–48 hours. We'll notify you at {vendor.email}.</p>
                <button onClick={() => setVendorModal(false)} className="btn-gradient px-6 py-2 text-sm">Close</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleVendorSubmit}>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Your Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                    <input required type="text" value={vendor.name} onChange={e => setVendor({ ...vendor, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={vendor.email} onChange={e => setVendor({ ...vendor, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input required type="tel" value={vendor.phone} onChange={e => setVendor({ ...vendor, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="+233..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business / Farm name *</label>
                    <input required type="text" value={vendor.business} onChange={e => setVendor({ ...vendor, business: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="e.g. Kofi Farms" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input required type="text" value={vendor.location} onChange={e => setVendor({ ...vendor, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="e.g. Accra, Kumasi..." />
                </div>

                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide pt-2">Product Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product name *</label>
                    <input required type="text" value={vendor.productName} onChange={e => setVendor({ ...vendor, productName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="e.g. Organic Tomatoes" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select required value={vendor.category} onChange={e => setVendor({ ...vendor, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] bg-white text-sm">
                      <option value="">— Select —</option>
                      <option>Agribusiness</option>
                      <option>Recycled & Upcycled</option>
                      <option>Handmade Crafts</option>
                      <option>Organic Produce</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea required rows={3} value={vendor.description} onChange={e => setVendor({ ...vendor, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm"
                    placeholder="Describe your product — what it is, how it's made, benefits..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHS) *</label>
                    <input required type="number" min={0} step="0.01" value={vendor.price} onChange={e => setVendor({ ...vendor, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <input required type="text" value={vendor.unit} onChange={e => setVendor({ ...vendor, unit: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="e.g. kg, bag, piece" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="url" value={vendor.imageUrl} onChange={e => setVendor({ ...vendor, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm" placeholder="https://..." />
                  <p className="text-xs text-gray-400 mt-0.5">Paste a link to your product photo (Google Drive, WhatsApp, etc.)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea rows={2} value={vendor.notes} onChange={e => setVendor({ ...vendor, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] text-sm"
                    placeholder="Minimum order, availability, delivery options..." />
                </div>
                {vendorStatus === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}

                {/* Terms & Conditions */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-800 leading-relaxed space-y-2">
                  <p className="font-semibold text-gray-800 text-sm">Vendor Terms & Conditions</p>
                  <p>By listing your product on SWK Marketplace, you agree to the following:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Your product must be eco-friendly and align with <strong>UN SDG 12</strong> — Responsible Consumption and Production.</li>
                    <li>Products must be sustainably sourced, produced, or made with minimal environmental impact.</li>
                    <li>No harmful chemicals, non-biodegradable materials, or environmentally damaging processes may be used.</li>
                    <li>You are responsible for the accuracy of your product description, pricing, and availability.</li>
                    <li>You are responsible for the quality of your product. SWK Ghana acts solely as a marketplace intermediary.</li>
                    <li>SWK Ghana reserves the right to reject, remove, or unpublish any product at any time without notice.</li>
                    <li>A commission fee may be introduced in the future. Vendors will be notified in advance.</li>
                    <li>SWK Ghana is not liable for any disputes between vendors and buyers.</li>
                  </ol>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="agree-terms" required checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#78C31E] flex-shrink-0" />
                  <label htmlFor="agree-terms" className="text-xs text-gray-800 leading-relaxed">
                    I have read and agree to the SWK Marketplace Vendor Terms & Conditions, and confirm that my product meets the sustainability criteria aligned with UN SDG 12.
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setVendorModal(false)} className="px-4 py-2 border rounded-lg text-gray-800 text-sm">Cancel</button>
                  <button type="submit" disabled={vendorStatus === 'sending' || !agreedToTerms} className="btn-gradient flex-1 py-2.5 disabled:opacity-60 text-sm">
                    {vendorStatus === 'sending' ? 'Submitting...' : 'Submit Product'}
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

export default Marketplace