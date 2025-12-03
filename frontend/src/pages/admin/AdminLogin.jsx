import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin({ isDark }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_role', data.user.role)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#0a0a0a' : '#f6f7fb' }}>
      <form onSubmit={submit} style={{ width: 360, background: isDark ? '#0f0f0f' : '#fff', color: isDark ? '#e5e5e5' : '#0f172a', padding: 24, borderRadius: 12, border: isDark ? '1px solid #111' : '1px solid #e5e7eb' }}>
        <h2 style={{ marginBottom: 12 }}>Admin Login</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 10, margin: '6px 0 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}/>
        <label>Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 10, margin: '6px 0 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}/>
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  )
}


