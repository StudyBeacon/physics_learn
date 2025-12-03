import React from 'react'

const YEARS = ['first','second','third','fourth']

export default function Units({ isDark }) {
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState({ yearSlug: 'first', subjectCode: '' })
  const [form, setForm] = React.useState({ subjectCode: '', yearSlug: 'first', unitCode: '', unitName: '', topics: '', resourceTitle: '', resourceUrl: '', resourceType: 'note' })

  const load = async () => {
    setLoading(true)
    const q = new URLSearchParams()
    if (filter.yearSlug) q.set('yearSlug', filter.yearSlug)
    if (filter.subjectCode) q.set('subjectCode', filter.subjectCode)
    const res = await fetch(`${API_BASE}/admin/units?${q.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setRows(data)
    setLoading(false)
  }
  React.useEffect(() => { load() }, [filter.yearSlug, filter.subjectCode])

  const add = async (e) => {
    e.preventDefault()
    const body = {
      subjectCode: form.subjectCode.toUpperCase(),
      yearSlug: form.yearSlug,
      unitCode: form.unitCode,
      unitName: form.unitName,
      topics: form.topics ? form.topics.split(',').map(t=>t.trim()).filter(Boolean) : [],
      resources: form.resourceUrl ? [{ type: form.resourceType, title: form.resourceTitle || form.unitName, url: form.resourceUrl }] : []
    }
    await fetch(`${API_BASE}/admin/units`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(body) })
    setForm({ subjectCode: '', yearSlug: form.yearSlug, unitCode: '', unitName: '', topics: '', resourceTitle: '', resourceUrl: '', resourceType: 'note' })
    load()
  }

  const update = async (id, patch) => {
    await fetch(`${API_BASE}/admin/units/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(patch) })
    load()
  }

  const remove = async (id) => {
    await fetch(`${API_BASE}/admin/units/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
    load()
  }

  return (
    <div style={{ color: isDark ? '#e5e5e5' : '#0f172a' }}>
      <h2>Units</h2>

      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <strong>Filter:</strong>
        <select value={filter.yearSlug} onChange={e=>setFilter({ ...filter, yearSlug: e.target.value })}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <input placeholder="Subject code (e.g., PHY201)" value={filter.subjectCode} onChange={e=>setFilter({ ...filter, subjectCode: e.target.value.toUpperCase() })} />
      </div>

      <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginTop: 12 }}>
        <input placeholder="Subject Code" value={form.subjectCode} onChange={e=>setForm({ ...form, subjectCode: e.target.value })} required />
        <select value={form.yearSlug} onChange={e=>setForm({ ...form, yearSlug: e.target.value })}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <input placeholder="Unit Code (e.g., U1)" value={form.unitCode} onChange={e=>setForm({ ...form, unitCode: e.target.value })} required />
        <input placeholder="Unit Name" value={form.unitName} onChange={e=>setForm({ ...form, unitName: e.target.value })} required />
        <input placeholder="Topics (comma separated)" value={form.topics} onChange={e=>setForm({ ...form, topics: e.target.value })} />
        <input placeholder="Resource Title" value={form.resourceTitle} onChange={e=>setForm({ ...form, resourceTitle: e.target.value })} />
        <input placeholder="Resource URL" value={form.resourceUrl} onChange={e=>setForm({ ...form, resourceUrl: e.target.value })} />
        <select value={form.resourceType} onChange={e=>setForm({ ...form, resourceType: e.target.value })}>
          <option value="note">note</option>
          <option value="diagram">diagram</option>
          <option value="video">video</option>
          <option value="link">link</option>
        </select>
        <button type="submit" style={{ gridColumn: '1 / -1', width: 160 }}>Add Unit</button>
      </form>

      {loading ? 'Loading…' : (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {rows.map(u => (
            <div key={u._id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: isDark ? '#0f0f0f' : '#fff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px auto', gap: 8, alignItems: 'center' }}>
                <input value={u.subjectCode} onChange={e=>update(u._id, { subjectCode: e.target.value })} />
                <input value={u.unitName} onChange={e=>update(u._id, { unitName: e.target.value })} />
                <input value={u.unitCode} onChange={e=>update(u._id, { unitCode: e.target.value })} />
                <select value={u.yearSlug} onChange={e=>update(u._id, { yearSlug: e.target.value })}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button onClick={()=>remove(u._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Delete</button>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: .8 }}>Topics: {(u.topics||[]).join(', ') || '—'}</div>
              {u.resources?.length ? (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {u.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', border: '1px solid #e5e7eb', padding: '4px 8px', borderRadius: 6 }}>{r.type}: {r.title}</a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


