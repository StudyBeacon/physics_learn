import React from 'react'

const roles = ['admin','editor','viewer']

export default function Users({ isDark }) {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filterRole, setFilterRole] = React.useState('all')
  const [selected, setSelected] = React.useState({})
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }
  React.useEffect(() => { load() }, [])

  const updateRole = async (id, role) => {
    await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ role })
    })
    load()
  }

  const remove = async (id) => {
    await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
    load()
  }

  const bulkChangeRole = async (role) => {
    const ids = Object.keys(selected).filter(id => selected[id])
    await Promise.all(ids.map(id => fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify({ role })
    })))
    setSelected({})
    load()
  }

  const bulkDelete = async () => {
    const ids = Object.keys(selected).filter(id => selected[id])
    if (!ids.length) return
    if (!confirm(`Delete ${ids.length} user(s)?`)) return
    await Promise.all(ids.map(id => fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })))
    setSelected({})
    load()
  }

  return (
    <div>
      <h2>Users</h2>
      {loading ? 'Loading…' : (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <strong>Filter:</strong>
            <select value={filterRole} onChange={e=>setFilterRole(e.target.value)}>
              <option value="all">All</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ flex: 1 }} />
            <button onClick={()=>bulkChangeRole('viewer')}>Set Viewer</button>
            <button onClick={()=>bulkChangeRole('editor')}>Set Editor</button>
            <button onClick={()=>bulkChangeRole('admin')}>Set Admin</button>
            <button onClick={bulkDelete} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Delete Selected</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th><input type="checkbox" checked={users.length>0 && users.every(u=>selected[u._id])} onChange={e=>setSelected(users.reduce((acc,u)=>({ ...acc, [u._id]: e.target.checked }), {}))} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => filterRole==='all' ? true : u.role===filterRole).map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td><input type="checkbox" checked={!!selected[u._id]} onChange={e=>setSelected({ ...selected, [u._id]: e.target.checked })} /></td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e)=>updateRole(u._id, e.target.value)}>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={()=>remove(u._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


