import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'SWKGhana@2024'

const CATEGORIES = ['Event Recap', 'Program Update', 'Impact Story', 'Opinion']

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Program Update',
  coverImage: '',
  author: 'SWK Ghana',
  published: true,
}

const Admin = () => {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('list') // list | new | edit
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saved, setSaved] = useState(false)

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
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    if (view === 'new') {
      const newPost = {
        ...form,
        id: Date.now(),
        slug: slugify(form.title),
        date: now,
      }
      savePosts([newPost, ...posts])
    } else {
      const updated = posts.map(p => p.id === editId ? { ...p, ...form } : p)
      savePosts(updated)
    }
    setSaved(true)
    setTimeout(() => { setSaved(false); setView('list') }, 1200)
    setForm(emptyForm)
    setEditId(null)
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
    if (window.confirm('Delete this post?')) {
      savePosts(posts.filter(p => p.id !== id))
    }
  }

  const togglePublish = (id) => {
    const updated = posts.map(p => p.id === id ? { ...p, published: !p.published } : p)
    savePosts(updated)
  }

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
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter admin password"
              />
              {passwordError && <p className="text-xs text-red-500 mt-1">Incorrect password. Try again.</p>}
            </div>
            <button type="submit" className="btn-gradient w-full py-2.5">Login</button>
          </form>
        </div>
      </main>
    )
  }

  // Post form (new or edit)
  if (view === 'new' || view === 'edit') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-10 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{view === 'new' ? 'New Post' : 'Edit Post'}</h1>
            <button onClick={() => { setView('list'); setForm(emptyForm); setEditId(null) }} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
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
                  <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Frank Koomson" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL (optional)</label>
                <input type="url" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://res.cloudinary.com/..." />
                <p className="text-xs text-gray-400 mt-1">Paste a Cloudinary image URL</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt * <span className="text-gray-400 font-normal">(short summary shown on blog list)</span></label>
                <textarea required rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="A brief summary of the post (1-2 sentences)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content * <span className="text-gray-400 font-normal">(full post body)</span></label>
                <textarea required rows={14} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                  placeholder="Write your full post content here..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gradient px-6 py-2.5 flex items-center gap-2">
                  {saved ? '✓ Saved!' : (view === 'new' ? 'Publish Post' : 'Save Changes')}
                </button>
                <button type="button" onClick={() => { setView('list'); setForm(emptyForm); setEditId(null) }}
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

  // Post list
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-10 max-w-5xl">
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
      </div>
    </main>
  )
}

export default Admin