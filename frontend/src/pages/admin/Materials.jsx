import React from 'react'

const YEARS = ['first','second','third','fourth']

export default function Materials({ isDark }) {
  const [materials, setMaterials] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({ title: '', url: '', subjectCode: '', yearSlug: 'first', type: 'pdf', category: 'chapter', published: true })
  const [subjectsForYear, setSubjectsForYear] = React.useState([])
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [filter, setFilter] = React.useState({ yearSlug: 'all', subjectCode: '' })

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API_BASE}/admin/materials`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setMaterials(data)
    setLoading(false)
  }
  React.useEffect(() => { load() }, [])

  // When year changes in form, load subjects for that year
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/years/${form.yearSlug}/subjects`)
        const data = await res.json()
        setSubjectsForYear(Array.isArray(data) ? data : [])
      } catch {
        setSubjectsForYear([])
      }
    })()
  }, [API_BASE, form.yearSlug])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/admin/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(form)
    })
    setForm({ title: '', url: '', subjectCode: '', yearSlug: 'first', type: 'pdf', category: 'chapter', published: true })
    load()
  }

  const remove = async (id) => {
    await fetch(`${API_BASE}/admin/materials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
    load()
  }

  const togglePublish = async (id, published) => {
    await fetch(`${API_BASE}/admin/materials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify({ published: !published }) })
    load()
  }

  return (
    <div>
      <h2>Materials</h2>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <strong>Filter:</strong>
        <select value={filter.yearSlug} onChange={e=>setFilter({ ...filter, yearSlug: e.target.value })}>
          <option value="all">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <input placeholder="Subject code (e.g., PHY101)" value={filter.subjectCode} onChange={e=>setFilter({ ...filter, subjectCode: e.target.value })} />
      </div>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12, maxWidth: 900 }}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} required />
        <input placeholder="PDF/Link URL" value={form.url} onChange={e=>setForm({ ...form, url: e.target.value })} required />
        <select value={form.yearSlug} onChange={e=>setForm({ ...form, yearSlug: e.target.value })}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={form.subjectCode} onChange={e=>setForm({ ...form, subjectCode: e.target.value })}>
          <option value="">Select subject</option>
          {subjectsForYear.map(s => (
            <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
          ))}
        </select>
        <select value={form.type} onChange={e=>setForm({ ...form, type: e.target.value })}>
          <option value="pdf">PDF</option>
          <option value="link">Link</option>
        </select>
        <select value={form.category} onChange={e=>setForm({ ...form, category: e.target.value })}>
          <option value="chapter">Chapter</option>
          <option value="syllabus">Syllabus</option>
          <option value="questionBank">Question Bank</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={form.published} onChange={e=>setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div />
        <button type="submit" style={{ width: 180 }}>Add Material</button>
      </form>

      {loading ? 'Loading…' : (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {materials
            .filter(m => filter.yearSlug==='all' ? true : m.yearSlug===filter.yearSlug)
            .filter(m => filter.subjectCode ? m.subjectCode.toUpperCase().includes(filter.subjectCode.toUpperCase()) : true)
            .map(m => (
            <div key={m._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{m.title}</strong>
                  <div style={{ fontSize: 12, opacity: .7 }}>{m.yearSlug.toUpperCase()} • {m.subjectCode} • {m.type} • {m.category}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Open</a>
                  <button onClick={()=>togglePublish(m._id, m.published)}>{m.published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={()=>remove(m._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


