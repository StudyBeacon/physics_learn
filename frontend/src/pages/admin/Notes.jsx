import React from 'react'

export default function Notes({ isDark }) {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [list, setList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [form, setForm] = React.useState({
    title: '', subjectCode: '', yearSlug: 'first', chapterId: '', description: '', file: null,
  })
  const [chapters, setChapters] = React.useState([])
  const [filters, setFilters] = React.useState({ yearSlug: '', subjectCode: '' })

  const adminToken = typeof window !== 'undefined' ? window.localStorage.getItem('admin_token') : ''

  const loadList = async () => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams()
      if (filters.yearSlug) params.append('yearSlug', filters.yearSlug)
      if (filters.subjectCode) params.append('subjectCode', filters.subjectCode)
      const res = await fetch(`${API_BASE}/chapter-notes?${params.toString()}`)
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load notes')
    }
    setLoading(false)
  }

  React.useEffect(() => { loadList() }, [filters.yearSlug, filters.subjectCode])

  const loadChapters = async () => {
    if (!form.yearSlug || !form.subjectCode) { setChapters([]); return }
    try {
      const res = await fetch(`${API_BASE}/subjects/${form.yearSlug}/${form.subjectCode.toLowerCase()}/chapters`)
      const data = await res.json()
      setChapters(Array.isArray(data) ? data : [])
    } catch { setChapters([]) }
  }
  React.useEffect(() => { loadChapters() }, [form.yearSlug, form.subjectCode])

  const onSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.title || !form.subjectCode || !form.yearSlug || !form.chapterId || !form.file) {
      setError('All fields and PDF file are required'); return
    }
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subjectCode', form.subjectCode.toUpperCase())
      fd.append('yearSlug', form.yearSlug)
      fd.append('chapterId', form.chapterId)
      fd.append('description', form.description)
      fd.append('file', form.file)
      const res = await fetch(`${API_BASE}/chapter-notes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}`, 'X-Requested-With': 'XMLHttpRequest' },
        body: fd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      setForm({ title: '', subjectCode: '', yearSlug: 'first', chapterId: '', description: '', file: null })
      setError('') // Clear any previous errors
      alert('PDF uploaded successfully!')
      await loadList()
    } catch (e) { 
      setError(e.message)
      console.error('Upload error:', e)
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      const res = await fetch(`${API_BASE}/chapter-notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}`, 'X-Requested-With': 'XMLHttpRequest' }
      })
      if (!res.ok) throw new Error('Delete failed')
      await loadList()
    } catch (e) { alert(e.message) }
  }

  const onReplaceFile = async (id, file) => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API_BASE}/chapter-notes/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}`, 'X-Requested-With': 'XMLHttpRequest' },
        body: fd
      })
      if (!res.ok) throw new Error('Update failed')
      await loadList()
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <h2 style={{ margin: '8px 0 16px' }}>Chapter Notes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <form onSubmit={onSubmit} style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Upload PDF</div>
          {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
          <label>Title</label>
          <input value={form.title} onChange={e=>setForm(f=>({ ...f, title: e.target.value }))} required style={{ width: '100%', padding: 8, margin: '6px 0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label>Year</label>
              <select value={form.yearSlug} onChange={e=>setForm(f=>({ ...f, yearSlug: e.target.value }))} style={{ width: '100%', padding: 8, margin: '6px 0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}>
                {['first','second','third','fourth'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label>Subject Code</label>
              <input value={form.subjectCode} onChange={e=>setForm(f=>({ ...f, subjectCode: e.target.value }))} placeholder="e.g., PHY101" required style={{ width: '100%', padding: 8, margin: '6px 0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }} />
            </div>
          </div>
          <div>
            <label>Chapter</label>
            <select value={form.chapterId} onChange={e=>setForm(f=>({ ...f, chapterId: e.target.value }))} required style={{ width: '100%', padding: 8, margin: '6px 0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}>
              <option value="">Select chapter</option>
              {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.title}</option>)}
            </select>
          </div>
          <label>Description</label>
          <textarea value={form.description} onChange={e=>setForm(f=>({ ...f, description: e.target.value }))} rows={3} style={{ width: '100%', padding: 8, margin: '6px 0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }} />
          <label>PDF File</label>
          <input type="file" accept="application/pdf" onChange={e=>setForm(f=>({ ...f, file: e.target.files?.[0] || null }))} required style={{ display: 'block', margin: '6px 0 16px' }} />
          <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}>Upload</button>
        </form>

        <div style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <select value={filters.yearSlug} onChange={e=>setFilters(f=>({ ...f, yearSlug: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}>
              <option value="">All years</option>
              {['first','second','third','fourth'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <input placeholder="Filter by subject code" value={filters.subjectCode} onChange={e=>setFilters(f=>({ ...f, subjectCode: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit', flex: 1 }} />
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : list.length === 0 ? (
            <div style={{ opacity: .8 }}>No notes yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Year</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Subject</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(note => (
                  <tr key={note._id}>
                    <td style={{ padding: 8 }}>{note.title}</td>
                    <td style={{ padding: 8 }}>{note.yearSlug}</td>
                    <td style={{ padding: 8 }}>{note.subjectCode}</td>
                    <td style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <a href={note.pdfUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: 6 }}>Open</a>
                      <label style={{ border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}>
                        Replace
                        <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e=>{ if(e.target.files?.[0]) onReplaceFile(note._id, e.target.files[0]) }} />
                      </label>
                      <button onClick={()=>onDelete(note._id)} style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}


