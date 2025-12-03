import React from 'react'

export default function Posts({ isDark }) {
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({ title: '', description: '', imageUrl: '', published: false, status: 'draft', publishAt: '' })
  const [statusFilter, setStatusFilter] = React.useState('all')
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API_BASE}/admin/posts`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }
  React.useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(form)
    })
    setForm({ title: '', description: '', imageUrl: '', published: false, status: 'draft', publishAt: '' })
    load()
  }

  const togglePublish = async (id, published) => {
    await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ published: !published })
    })
    load()
  }

  const remove = async (id) => {
    await fetch(`${API_BASE}/admin/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
    load()
  }

  return (
    <div>
      <h2>Posts</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({ ...form, imageUrl: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <select value={form.status} onChange={e=>setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input type="datetime-local" value={form.publishAt} onChange={e=>setForm({ ...form, publishAt: e.target.value })} placeholder="Schedule publish" />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={form.published} onChange={e=>setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <button type="submit" style={{ width: 160 }}>Create Post</button>
      </form>

      {loading ? 'Loading…' : (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Filter:</strong>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          {posts.filter(p => statusFilter==='all' ? true : (p.status||'draft')===statusFilter).map(p => (
            <div key={p._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{p.title}</strong>
                  <div style={{ opacity: .7, fontSize: 13 }}>
                    <span style={{
                      background: (p.status||'draft')==='published' ? '#d1fae5' : (p.status||'draft')==='archived' ? '#fee2e2' : '#e5e7eb',
                      color: (p.status||'draft')==='published' ? '#065f46' : (p.status||'draft')==='archived' ? '#991b1b' : '#374151',
                      padding: '2px 6px', borderRadius: 6, marginRight: 6
                    }}>{(p.status||'draft').toUpperCase()}</span>
                    {p.published ? 'Visible' : 'Hidden'}
                    {p.publishAt ? ` • Schedules: ${new Date(p.publishAt).toLocaleString()}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={()=>togglePublish(p._id, p.published)}>{p.published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={()=>remove(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Delete</button>
                </div>
              </div>
              {p.imageUrl && <img src={p.imageUrl} alt="" style={{ marginTop: 8, maxHeight: 120 }} />}
              {p.description && <p style={{ marginTop: 8 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


