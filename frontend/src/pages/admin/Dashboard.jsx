import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ isDark }) {
  const [stats, setStats] = React.useState(null)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const navigate = useNavigate()
  React.useEffect(() => {
    (async () => {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setStats(data)
    })()
  }, [])

  const cardStyle = { background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 12, padding: 16, cursor: 'pointer' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={()=>navigate('/admin/posts')} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>Add Post</button>
          <button onClick={()=>navigate('/admin/users')} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>Create User</button>
          <button onClick={()=>navigate('/admin/catalog')} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>Add Subject</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 12 }}>
        <div onClick={()=>navigate('/admin/users')} style={cardStyle}>
          <div style={{ opacity: .7 }}>Users</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.users ?? '—'}</div>
        </div>
        <div onClick={()=>navigate('/admin/posts')} style={cardStyle}>
          <div style={{ opacity: .7 }}>Posts</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.posts ?? 0}</div>
        </div>
        <div onClick={()=>navigate('/admin/materials')} style={cardStyle}>
          <div style={{ opacity: .7 }}>Materials</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.materials ?? 0}</div>
        </div>
        <div onClick={()=>navigate('/admin/chapters')} style={cardStyle}>
          <div style={{ opacity: .7 }}>Chapters</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.chapters ?? 0}</div>
        </div>
      </div>

      {/* System health - lightweight checks placeholder */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
        <div style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ opacity: .7 }}>Backend</div>
          <div style={{ fontSize: 14 }}>{API_BASE}</div>
        </div>
        <div style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ opacity: .7 }}>Auth</div>
          <div style={{ fontSize: 14 }}>Protected routes enabled</div>
        </div>
      </div>
    </div>
  )
}


