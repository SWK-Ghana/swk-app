import React, { useState, useEffect, useRef, useCallback } from 'react'

const ADMIN_PASSWORD = 'SWKGhana@2024'
const CATEGORIES = ['Event Recap', 'Program Update', 'Impact Story', 'Opinion']
const PRODUCT_CATEGORIES = ['Agribusiness', 'Recycled & Upcycled', 'Handmade Crafts', 'Organic Produce']

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const CLOUDINARY_CLOUD = 'dwgj3lovn'
const CLOUDINARY_PRESET = 'wx7boz2b'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url
}

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Program Update',
  coverImage: '',
  author: 'SWK Ghana',
  published: true,
}

// ─── Rich Text Editor ──────────────────────────────────────────────────────────
const RichEditor = ({ value, onChange }) => {
  const editorRef = useRef(null)
  const isInternalUpdate = useRef(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
    isInternalUpdate.current = false
  }, [value])

  const exec = useCallback((command, val = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, val)
    isInternalUpdate.current = true
    onChange(editorRef.current?.innerHTML || '')
  }, [onChange])

  const handleInput = () => {
    isInternalUpdate.current = true
    onChange(editorRef.current?.innerHTML || '')
  }

  const insertLink = () => {
    const url = prompt('Enter URL (e.g. https://swkghana.org):')
    if (url) exec('createLink', url)
  }

  const insertImageByUrl = () => {
    const url = prompt('Enter image URL:')
    if (url) exec('insertImage', url)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      editorRef.current?.focus()
      document.execCommand('insertImage', false, url)
      isInternalUpdate.current = true
      onChange(editorRef.current?.innerHTML || '')
    } catch {
      alert('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const ToolBtn = ({ cmd, val, title, children, onClick }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick ? onClick() : exec(cmd, val)
      }}
      className="px-2 py-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm transition-colors min-w-[28px] flex items-center justify-center"
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolBtn cmd="bold" title="Bold"><strong>B</strong></ToolBtn>
        <ToolBtn cmd="italic" title="Italic"><em>I</em></ToolBtn>
        <ToolBtn cmd="underline" title="Underline"><u>U</u></ToolBtn>
        <ToolBtn cmd="strikeThrough" title="Strikethrough"><s>S</s></ToolBtn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolBtn cmd="formatBlock" val="H2" title="Heading 2"><span className="font-bold text-xs">H2</span></ToolBtn>
        <ToolBtn cmd="formatBlock" val="H3" title="Heading 3"><span className="font-bold text-xs">H3</span></ToolBtn>
        <ToolBtn cmd="formatBlock" val="P" title="Paragraph"><span className="text-xs font-medium">¶</span></ToolBtn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolBtn cmd="insertUnorderedList" title="Bullet list">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </ToolBtn>
        <ToolBtn cmd="insertOrderedList" title="Numbered list">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
          </svg>
        </ToolBtn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolBtn cmd="justifyLeft" title="Align left">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/></svg>
        </ToolBtn>
        <ToolBtn cmd="justifyCenter" title="Align center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm3 4h12v2H6V9zm-3 4h18v2H3v-2zm3 4h12v2H6v-2z"/></svg>
        </ToolBtn>
        <ToolBtn cmd="justifyRight" title="Align right">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm6 4h12v2H9V9zm-6 4h18v2H3v-2zm6 4h12v2H9v-2z"/></svg>
        </ToolBtn>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolBtn title="Insert link" onClick={insertLink}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolBtn>
        <ToolBtn title="Insert image by URL" onClick={insertImageByUrl}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </ToolBtn>
        <label title="Upload image from laptop" className="px-2 py-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm transition-colors cursor-pointer flex items-center justify-center min-w-[28px]">
          {uploading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
        </label>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolBtn cmd="undo" title="Undo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </ToolBtn>
        <ToolBtn cmd="redo" title="Redo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[280px] px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_p]:my-2 [&_a]:text-emerald-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through"
      />
    </div>
  )
}

// ─── Marketplace Admin ─────────────────────────────────────────────────────────
const emptyProduct = { productName: '', category: '', business: '', name: '', email: '', phone: '', location: '', description: '', price: '', unit: '', imageUrl: '', notes: '', approved: false }

const MarketplaceAdmin = () => {
  const [products, setProducts] = useState([])
  const [view, setView] = useState('list')
  const [form, setForm] = useState(emptyProduct)
  const [editId, setEditId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('swk_marketplace_products')
    if (stored) setProducts(JSON.parse(stored))
  }, [])

  const saveProducts = (updated) => {
    setProducts(updated)
    localStorage.setItem('swk_marketplace_products', JSON.stringify(updated))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editId) {
      saveProducts(products.map(p => p.id === editId ? { ...p, ...form } : p))
    } else {
      saveProducts([{ ...form, id: Date.now(), submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }, ...products])
    }
    setSaved(true)
    setTimeout(() => { setSaved(false); setView('list'); setForm(emptyProduct); setEditId(null) }, 1200)
  }

  const handleEdit = (product) => { setForm({ ...product }); setEditId(product.id); setView('edit') }
  const handleDelete = (id) => { if (window.confirm('Delete this product?')) saveProducts(products.filter(p => p.id !== id)) }
  const toggleApprove = (id) => saveProducts(products.map(p => p.id === id ? { ...p, approved: !p.approved } : p))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      setForm(f => ({ ...f, imageUrl: data.secure_url }))
    } catch { alert('Image upload failed.') }
    finally { setUploadingImg(false); e.target.value = '' }
  }

  if (view === 'new' || view === 'edit') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{view === 'new' ? 'Add Product' : 'Edit Product'}</h2>
          <button onClick={() => { setView('list'); setForm(emptyProduct); setEditId(null) }} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product name *</label>
                <input required type="text" value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Organic Tomatoes" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm">
                  <option value="">— Select —</option>
                  {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business / Farm name *</label>
                <input required type="text" value={form.business} onChange={e => setForm({ ...form, business: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Kofi Farms" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. Accra" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Describe the product..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHS) *</label>
                <input required type="number" min={0} step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <input required type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. kg, bag, piece" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex gap-2 items-center">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadingImg ? 'Uploading...' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingImg} onChange={handleImageUpload} />
                </label>
                <span className="text-xs text-gray-400">or paste URL:</span>
                <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="https://..." />
              </div>
              {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200" />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Contact person" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="vendor@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="+233..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Min order, availability, etc." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prod-approved" checked={form.approved} onChange={e => setForm({ ...form, approved: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
              <label htmlFor="prod-approved" className="text-sm font-medium text-gray-700">Approve & publish immediately</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-gradient px-6 py-2.5 text-sm">{saved ? '✓ Saved!' : (view === 'new' ? 'Add Product' : 'Save Changes')}</button>
              <button type="button" onClick={() => { setView('list'); setForm(emptyProduct); setEditId(null) }} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
          <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} · {products.filter(p => !p.approved).length} pending approval</p>
        </div>
        <div className="flex gap-3">
          <a href="/marketplace" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50">View Marketplace →</a>
          <button onClick={() => { setForm(emptyProduct); setView('new') }} className="btn-gradient px-5 py-2 text-sm">+ Add Product</button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <span className="text-5xl mb-4 block">🛒</span>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products yet</h3>
          <p className="text-sm text-gray-500 mb-5">Add your first product or wait for vendor submissions.</p>
          <button onClick={() => setView('new')} className="btn-gradient px-6 py-2.5 text-sm">Add First Product</button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              {product.imageUrl && <img src={product.imageUrl} alt={product.productName} className="w-full sm:w-16 h-24 sm:h-12 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-emerald-600">{product.category}</span>
                  <span className="text-xs text-gray-400">{product.location}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {product.approved ? 'Live' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{product.productName}</p>
                <p className="text-xs text-gray-500">by {product.business} · GHS {product.price} / {product.unit}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleApprove(product.id)} className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-gray-600">
                  {product.approved ? 'Unpublish' : 'Approve'}
                </button>
                <button onClick={() => handleEdit(product)} className="text-xs px-3 py-1.5 border border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Admin Component ───────────────────────────────────────────────────────────
const Admin = () => {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('list')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [adminTab, setAdminTab] = useState('blog')

  useEffect(() => {
    const stored = localStorage.getItem('swk_blog_posts')
    if (stored) setPosts(JSON.parse(stored))
  }, [])

  const savePosts = (updated) => {
    setPosts(updated)
    localStorage.setItem('swk_blog_posts', JSON.stringify(updated))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPasswordError(false) }
    else setPasswordError(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.content || form.content === '<br>') {
      alert('Please add some content to the post.')
      return
    }
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    if (view === 'new') {
      savePosts([{ ...form, id: Date.now(), slug: slugify(form.title), date: now }, ...posts])
    } else {
      savePosts(posts.map(p => p.id === editId ? { ...p, ...form } : p))
    }
    setSaved(true)
    setTimeout(() => { setSaved(false); setView('list'); setForm(emptyForm); setEditId(null) }, 1200)
  }

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImage: post.coverImage || '',
      author: post.author || 'SWK Ghana',
      published: post.published,
    })
    setEditId(post.id)
    setView('edit')
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this post?')) savePosts(posts.filter(p => p.id !== id))
  }

  const togglePublish = (id) => {
    savePosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p))
  }

  const cancelForm = () => { setView('list'); setForm(emptyForm); setEditId(null) }

  // ── Login ──
  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">🔐</span>
            <h1 className="text-xl font-bold text-gray-900">SWK Ghana Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Blog management panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="admin-password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter admin password" />
              {passwordError && <p className="text-xs text-red-500 mt-1">Incorrect password. Try again.</p>}
            </div>
            <button type="submit" className="btn-gradient w-full py-2.5">Login</button>
          </form>
        </div>
      </main>
    )
  }

  // ── Post form ──
  if (view === 'new' || view === 'edit') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-10 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{view === 'new' ? 'New Post' : 'Edit Post'}</h1>
            <button onClick={cancelForm} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required type="text" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Post title" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input type="text" value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Frank Koomson" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploadingCover ? 'Uploading...' : 'Upload from laptop'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingCover}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingCover(true)
                        try {
                          const url = await uploadToCloudinary(file)
                          setForm(f => ({ ...f, coverImage: url }))
                        } catch {
                          alert('Image upload failed. Please try again or paste a URL.')
                        } finally {
                          setUploadingCover(false)
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-400">or paste URL:</span>
                  <input type="url" value={form.coverImage}
                    onChange={e => setForm({ ...form, coverImage: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="https://res.cloudinary.com/..." />
                </div>
                {form.coverImage && (
                  <div className="mt-2 relative">
                    <img src={form.coverImage} alt="Cover preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt * <span className="text-gray-400 font-normal">(short summary shown on blog list)</span>
                </label>
                <textarea required rows={2} value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="A brief summary of the post (1-2 sentences)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * <span className="text-gray-400 font-normal">(use the toolbar to format your post)</span>
                </label>
                <RichEditor
                  value={form.content}
                  onChange={(html) => setForm(f => ({ ...f, content: html }))}
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gradient px-6 py-2.5">
                  {saved ? '✓ Saved!' : (view === 'new' ? 'Publish Post' : 'Save Changes')}
                </button>
                <button type="button" onClick={cancelForm}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // ── Post list ──
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-10 max-w-5xl">

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setAdminTab('blog')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${adminTab === 'blog' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            📝 Blog
          </button>
          <button onClick={() => setAdminTab('marketplace')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${adminTab === 'marketplace' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            🛒 Marketplace
          </button>
        </div>

        {/* ── BLOG TAB ── */}
        {adminTab === 'blog' && (
          <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Admin</h1>
            <p className="text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
          </div>
          <div className="flex gap-3">
            <a href="/blog" target="_blank" rel="noopener noreferrer"
              className="text-sm text-emerald-600 border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
              View Blog →
            </a>
            <button onClick={() => { setForm(emptyForm); setView('new') }} className="btn-gradient px-5 py-2 text-sm">
              + New Post
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-sm text-gray-500 mb-5">Create your first blog post to get started.</p>
            <button onClick={() => setView('new')} className="btn-gradient px-6 py-2.5 text-sm">Create First Post</button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4 xs:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="w-full sm:w-20 h-32 sm:h-14 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-emerald-600">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(post.id)}
                    className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-gray-600">
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleEdit(post)}
                    className="text-xs px-3 py-1.5 border border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)}
                    className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* ── MARKETPLACE TAB ── */}
        {adminTab === 'marketplace' && (
          <MarketplaceAdmin />
        )}
      </div>
    </main>
  )
}

export default Admin