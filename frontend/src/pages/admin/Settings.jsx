import React from 'react'

export default function Settings({ isDark }) {
  const [settings, setSettings] = React.useState({ siteName: '', logoUrl: '', theme: 'system', apiKeys: { analyticsKey: '', emailKey: '' } })
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const load = async () => {
    const res = await fetch(`${API_BASE}/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setSettings({ siteName: data.siteName || '', logoUrl: data.logoUrl || '', theme: data.theme || 'system', apiKeys: data.apiKeys || { analyticsKey: '', emailKey: '' } })
  }
  React.useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(settings)
    })
    load()
  }

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={save} style={{ display: 'grid', gap: 10, marginTop: 12, maxWidth: 520 }}>
        <label>Site Name</label>
        <input value={settings.siteName} onChange={e=>setSettings({ ...settings, siteName: e.target.value })} />
        <label>Logo URL</label>
        <input value={settings.logoUrl} onChange={e=>setSettings({ ...settings, logoUrl: e.target.value })} />
        <label>Theme</label>
        <select value={settings.theme} onChange={e=>setSettings({ ...settings, theme: e.target.value })}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <fieldset style={{ border: '1px solid #e5e7eb', padding: 10, borderRadius: 8 }}>
          <legend>API Keys</legend>
          <label>Analytics Key</label>
          <input value={settings.apiKeys.analyticsKey} onChange={e=>setSettings({ ...settings, apiKeys: { ...settings.apiKeys, analyticsKey: e.target.value } })} />
          <label>Email Key</label>
          <input value={settings.apiKeys.emailKey} onChange={e=>setSettings({ ...settings, apiKeys: { ...settings.apiKeys, emailKey: e.target.value } })} />
        </fieldset>
        <button type="submit" style={{ width: 160 }}>Save</button>
      </form>
    </div>
  )
}


