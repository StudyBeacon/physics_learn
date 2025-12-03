import React from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'

const getToken = () => localStorage.getItem('admin_token')
const getRole = () => localStorage.getItem('admin_role')

export default function AdminLayout({ isDark }) {
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() => {
    const t = getToken()
    const r = getRole()
    if (!t || r !== 'admin') navigate('/admin/login')
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_role')
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0a0a0a' : '#f6f7fb', color: isDark ? '#e5e5e5' : '#0f172a' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: isDark ? '#0f0f0f' : '#fff', borderBottom: isDark ? '1px solid #111' : '1px solid #e5e7eb', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
          <strong>Admin • PhysicsLearn</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin') ? '2px solid #2563eb' : '2px solid transparent' }}>Dashboard</Link>
            <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/users') ? '2px solid #2563eb' : '2px solid transparent' }}>Users</Link>
            <Link to="/admin/catalog" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/catalog') ? '2px solid #2563eb' : '2px solid transparent' }}>Subjects</Link>
            <Link to="/admin/chapters" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/chapters') ? '2px solid #2563eb' : '2px solid transparent' }}>Chapters</Link>
            <Link to="/admin/notes" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/notes') ? '2px solid #2563eb' : '2px solid transparent' }}>Notes</Link>
            <Link to="/admin/past-questions" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/past-questions') ? '2px solid #2563eb' : '2px solid transparent' }}>Past Questions</Link>
            <Link to="/admin/posts" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/posts') ? '2px solid #2563eb' : '2px solid transparent' }}>Posts</Link>
            <Link to="/admin/settings" style={{ textDecoration: 'none', color: 'inherit', padding: '6px 10px', borderRadius: 8, borderBottom: isActive('/admin/settings') ? '2px solid #2563eb' : '2px solid transparent' }}>Settings</Link>
            <button onClick={logout} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>Logout</button>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1200, margin: '16px auto', padding: '0 16px' }}>
        <Outlet />
      </main>
    </div>
  )
}


