import React from 'react'

const YEARS = ['first','second','third','fourth']

export default function Catalog({ isDark }) {
  const [subjects, setSubjects] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({ code: '', name: '', description: '', yearSlug: 'first', chapters: 0, syllabus: '' })
  const [yearFilter, setYearFilter] = React.useState('all')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [editingSubject, setEditingSubject] = React.useState(null)
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' })
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admin/catalog/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      showToast('Failed to load subjects', 'error')
    }
    setLoading(false)
  }
  React.useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const url = editingSubject 
        ? `${API_BASE}/admin/catalog/subjects/${editingSubject._id}`
        : `${API_BASE}/admin/catalog/subjects`
      const method = editingSubject ? 'PUT' : 'POST'
      
      await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' }, 
        body: JSON.stringify(form) 
      })
      
      showToast(editingSubject ? 'Subject updated successfully' : 'Subject added successfully')
      setForm({ code: '', name: '', description: '', yearSlug: 'first', chapters: 0, syllabus: '' })
      setEditingSubject(null)
      setShowForm(false)
      load()
    } catch (error) {
      showToast('Failed to save subject', 'error')
    }
  }

  const editSubject = (subject) => {
    setForm({
      code: subject.code,
      name: subject.name,
      description: subject.description || '',
      yearSlug: subject.yearSlug,
      chapters: subject.chapters || 0,
      syllabus: subject.syllabus || ''
    })
    setEditingSubject(subject)
    setShowForm(true)
  }

  const remove = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }
    try {
      await fetch(`${API_BASE}/admin/catalog/subjects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
      showToast('Subject deleted successfully')
      load()
    } catch (error) {
      showToast('Failed to delete subject', 'error')
    }
  }

  const filteredSubjects = subjects.filter(subject => {
    const matchesYear = yearFilter === 'all' || subject.yearSlug === yearFilter
    const matchesSearch = searchTerm === '' || 
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesYear && matchesSearch
  })

  return (
    <div style={{ color: isDark ? '#e5e5e5' : '#0f172a' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          padding: '12px 16px',
          borderRadius: 8,
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Subjects</h2>
        <button 
          onClick={() => { setShowForm(true); setEditingSubject(null); setForm({ code: '', name: '', description: '', yearSlug: 'first', chapters: 0 }) }}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          + Add Subject
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        background: isDark ? '#0f0f0f' : '#f8fafc', 
        padding: '1rem', 
        borderRadius: 12, 
        marginBottom: '1.5rem',
        border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Year:</label>
            <select 
              value={yearFilter} 
              onChange={e=>setYearFilter(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                background: isDark ? '#111827' : 'white',
                color: isDark ? '#e5e7eb' : '#111827',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y.charAt(0).toUpperCase() + y.slice(1)} Year</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Search:</label>
            <input 
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                background: isDark ? '#111827' : 'white',
                color: isDark ? '#e5e7eb' : '#111827',
                fontSize: '0.9rem',
                minWidth: 200
              }}
            />
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div style={{ 
        background: isDark ? '#0f0f0f' : 'white', 
        borderRadius: 12, 
        border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
            Loading subjects...
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '120px 1fr 100px 80px 120px', 
              gap: '1rem',
              padding: '1rem',
              background: isDark ? '#111827' : '#f8fafc',
              borderBottom: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              <div>Code</div>
              <div>Name</div>
              <div>Year</div>
              <div>Chapters</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            <div>
              {filteredSubjects.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {searchTerm || yearFilter !== 'all' ? 'No subjects match your filters' : 'No subjects found. Add your first subject!'}
                </div>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <div 
                    key={subject._id} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '120px 1fr 100px 80px 120px', 
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: index < filteredSubjects.length - 1 ? (isDark ? '1px solid #1f2937' : '1px solid #e5e7eb') : 'none',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: isDark ? '#93c5fd' : '#2563eb' }}>
                      {subject.code}
                    </div>
                    <div style={{ color: isDark ? '#e5e7eb' : '#111827' }}>
                      {subject.name}
                    </div>
                    <div style={{ 
                      background: isDark ? '#1f2937' : '#f3f4f6', 
                      color: isDark ? '#e5e7eb' : '#374151',
                      padding: '4px 8px', 
                      borderRadius: 6, 
                      fontSize: '0.8rem',
                      textAlign: 'center'
                    }}>
                      {subject.yearSlug.charAt(0).toUpperCase() + subject.yearSlug.slice(1)}
                    </div>
                    <div style={{ textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                      {subject.chapters || 0}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => editSubject(subject)}
                        style={{
                          background: 'transparent',
                          border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                          color: isDark ? '#e5e7eb' : '#374151',
                          padding: '4px 10px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => remove(subject._id, subject.name)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          padding: '4px 10px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: isDark ? '#0f0f0f' : 'white',
            borderRadius: 12,
            padding: '2rem',
            width: '90%',
            maxWidth: 500,
            border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button 
                onClick={() => { setShowForm(false); setEditingSubject(null) }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: isDark ? '#9ca3af' : '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  Subject Code
                </label>
                <input 
                  placeholder="e.g., PHY101" 
                  value={form.code} 
                  onChange={e=>setForm({ ...form, code: e.target.value })} 
                  required 
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                    background: isDark ? '#111827' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  Subject Name
                </label>
                <input 
                  placeholder="e.g., Mechanics and Thermodynamics" 
                  value={form.name} 
                  onChange={e=>setForm({ ...form, name: e.target.value })} 
                  required 
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                    background: isDark ? '#111827' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    Year
                  </label>
                  <select 
                    value={form.yearSlug} 
                    onChange={e=>setForm({ ...form, yearSlug: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 8,
                      border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                      background: isDark ? '#111827' : 'white',
                      color: isDark ? '#e5e7eb' : '#111827',
                      fontSize: '0.9rem'
                    }}
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y.charAt(0).toUpperCase() + y.slice(1)} Year</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    Chapters
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={form.chapters} 
                    onChange={e=>setForm({ ...form, chapters: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: 8,
                      border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                      background: isDark ? '#111827' : 'white',
                      color: isDark ? '#e5e7eb' : '#111827',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea 
                  placeholder="Brief description of the subject..." 
                  value={form.description} 
                  onChange={e=>setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                    background: isDark ? '#111827' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  Syllabus
                </label>
                <textarea 
                  placeholder="Enter syllabus content in text format..." 
                  value={form.syllabus} 
                  onChange={e=>setForm({ ...form, syllabus: e.target.value })}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                    background: isDark ? '#111827' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                />
                <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>
                  Enter syllabus content in plain text format. This will be displayed on the student-facing syllabus tab.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => { setShowForm(false); setEditingSubject(null) }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                    background: 'transparent',
                    color: isDark ? '#e5e7eb' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 8,
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


