import React from 'react'

const YEARS = ['first','second','third','fourth']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export default function Chapters({ isDark }) {
  const [chapters, setChapters] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [subjects, setSubjects] = React.useState([])
  const [units, setUnits] = React.useState([])
  const [form, setForm] = React.useState({ 
    title: '', 
    description: '', 
    subjectId: '', 
    unitId: '', 
    yearSlug: 'first', 
    subjectCode: '', 
    topics: [], 
    resources: [], 
    pdfUrl: '',
    difficulty: 'beginner', 
    estimatedTime: 0, 
    tags: [], 
    order: 0 
  })
  const [filter, setFilter] = React.useState({ yearSlug: 'all', subjectCode: '', unitId: '' })
  const [showForm, setShowForm] = React.useState(false)
  const [editingChapter, setEditingChapter] = React.useState(null)
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' })
  const token = localStorage.getItem('admin_token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // Removed legacy client-side Cloudinary upload. Use Admin → Notes for uploads.

  const loadChapters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.yearSlug !== 'all') params.append('yearSlug', filter.yearSlug)
      if (filter.subjectCode) params.append('subjectCode', filter.subjectCode)
      if (filter.unitId) params.append('unitId', filter.unitId)
      
      const res = await fetch(`${API_BASE}/admin/chapters?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setChapters(data)
    } catch (error) {
      showToast('Failed to load chapters', 'error')
    }
    setLoading(false)
  }

  const loadSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/catalog/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }

  const loadUnits = async (yearSlug, subjectCode) => {
    if (!yearSlug || !subjectCode) {
      setUnits([])
      return
    }
    try {
      const res = await fetch(`${API_BASE}/admin/units?yearSlug=${yearSlug}&subjectCode=${subjectCode}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setUnits(data)
    } catch (error) {
      console.error('Failed to load units:', error)
      setUnits([])
    }
  }

  React.useEffect(() => { loadChapters() }, [filter, API_BASE, token])
  React.useEffect(() => { loadSubjects() }, [API_BASE, token])
  React.useEffect(() => { 
    if (form.yearSlug && form.subjectCode) {
      loadUnits(form.yearSlug, form.subjectCode)
    }
  }, [form.yearSlug, form.subjectCode, API_BASE, token])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const url = editingChapter
        ? `${API_BASE}/admin/chapters/${editingChapter._id}`
        : `${API_BASE}/admin/chapters`
      const method = editingChapter ? 'PUT' : 'POST'

      // Backend requires description, yearSlug, subjectCode
      const nonPdfResources = (form.resources || []).filter(r => r.type !== 'pdf')
      const mergedResources = form.pdfUrl && form.pdfUrl.trim()
        ? [...nonPdfResources, { type: 'pdf', title: form.title || 'PDF', url: form.pdfUrl.trim() }]
        : nonPdfResources

      const payload = {
        ...form,
        resources: mergedResources,
        description: form.description && form.description.trim() ? form.description : form.title,
      }

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(payload)
      })

      showToast(editingChapter ? 'Chapter updated successfully' : 'Chapter created successfully')
      setForm({ title: '', description: '', subjectId: '', unitId: '', yearSlug: 'first', subjectCode: '', topics: [], resources: [], pdfUrl: '', difficulty: 'beginner', estimatedTime: 0, tags: [], order: 0 })
      setEditingChapter(null)
      setShowForm(false)
      loadChapters()
    } catch (error) {
      showToast('Failed to save chapter', 'error')
    }
  }

  const editChapter = (chapter) => {
    setForm({
      title: chapter.title,
      description: chapter.description,
      subjectId: chapter.subjectId._id || chapter.subjectId,
      unitId: chapter.unitId?._id || chapter.unitId || '',
      yearSlug: chapter.yearSlug,
      subjectCode: chapter.subjectCode,
      topics: chapter.topics || [],
      resources: chapter.resources || [],
      pdfUrl: (chapter.resources||[]).find(r=>r.type==='pdf')?.url || '',
      difficulty: chapter.difficulty || 'beginner',
      estimatedTime: chapter.estimatedTime || 0,
      tags: chapter.tags || [],
      order: chapter.order || 0
    })
    setEditingChapter(chapter)
    setShowForm(true)
  }

  const remove = async (id, title) => {
    if (!confirm(`Are you sure you want to delete chapter "${title}"? This action cannot be undone.`)) {
      return
    }
    try {
      await fetch(`${API_BASE}/admin/chapters/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } })
      showToast('Chapter deleted successfully')
      loadChapters()
    } catch (error) {
      showToast('Failed to delete chapter', 'error')
    }
  }

  const filteredChapters = chapters.filter(chapter => {
    const matchesYear = filter.yearSlug === 'all' || chapter.yearSlug === filter.yearSlug
    const matchesSubject = !filter.subjectCode || chapter.subjectCode.toLowerCase().includes(filter.subjectCode.toLowerCase())
    const matchesUnit = !filter.unitId || chapter.unitId?._id === filter.unitId
    return matchesYear && matchesSubject && matchesUnit
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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Chapter Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditingChapter(null); setForm({ title: '', description: '', subjectId: '', unitId: '', yearSlug: 'first', subjectCode: '', topics: [], resources: [], difficulty: 'beginner', estimatedTime: 0, tags: [], order: 0 }) }}
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
          + Add Chapter
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
              value={filter.yearSlug}
              onChange={e => setFilter({ ...filter, yearSlug: e.target.value })}
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
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Subject:</label>
            <input
              type="text"
              placeholder="Search by subject code..."
              value={filter.subjectCode}
              onChange={e => setFilter({ ...filter, subjectCode: e.target.value })}
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

      {/* Chapters List */}
      <div style={{
        background: isDark ? '#0f0f0f' : 'white',
        borderRadius: 12,
        border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
            Loading chapters...
          </div>
        ) : (
          <>
            {filteredChapters.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                No chapters found. Add your first chapter!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
                {filteredChapters.map(chapter => (
                  <div key={chapter._id} style={{
                    background: isDark ? '#111827' : '#f8fafc',
                    border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: isDark ? '#e5e7eb' : '#111827' }}>
                          {chapter.title}
                        </h3>
                        <p style={{ margin: '0.5rem 0', color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.9rem' }}>
                          {chapter.description}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          <span style={{
                            background: isDark ? '#1f2937' : '#e5e7eb',
                            color: isDark ? '#e5e7eb' : '#374151',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {chapter.yearSlug.charAt(0).toUpperCase() + chapter.yearSlug.slice(1)} • {chapter.subjectCode}
                          </span>
                          {chapter.unitId && (
                            <span style={{
                              background: isDark ? '#1f2937' : '#e5e7eb',
                              color: isDark ? '#e5e7eb' : '#374151',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {chapter.unitId.unitName}
                            </span>
                          )}
                          <span style={{
                            background: chapter.difficulty === 'beginner' ? '#dcfce7' : chapter.difficulty === 'intermediate' ? '#fef3c7' : '#fecaca',
                            color: chapter.difficulty === 'beginner' ? '#166534' : chapter.difficulty === 'intermediate' ? '#92400e' : '#991b1b',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {chapter.difficulty}
                          </span>
                          <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.8rem' }}>
                            {chapter.questionCount} questions • {chapter.estimatedTime}min
                          </span>
                        </div>
                        {chapter.topics.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
                              Topics: {chapter.topics.join(', ')}
                            </span>
                          </div>
                        )}
                        {chapter.tags.length > 0 && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {chapter.tags.map(tag => (
                              <span key={tag} style={{
                                background: isDark ? '#1f2937' : '#e5e7eb',
                                color: isDark ? '#9ca3af' : '#6b7280',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: '0.7rem'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => editChapter(chapter)}
                          style={{
                            background: 'transparent',
                            border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                            color: isDark ? '#e5e7eb' : '#374151',
                            padding: '6px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(chapter._id, chapter.title)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {(chapter.resources||[]).some(r=>r.type==='pdf') && (
                      <div style={{ fontSize: 12, opacity: .8 }}>PDF attached</div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingChapter(null) }}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    Chapter Title
                  </label>
                  <input
                    placeholder="e.g., Introduction to Mechanics"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
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
                    Subject
                  </label>
                  <select
                    value={form.subjectId}
                    onChange={e => {
                      const subject = subjects.find(s => s._id === e.target.value)
                      setForm({ 
                        ...form, 
                        subjectId: e.target.value, 
                        yearSlug: subject?.yearSlug || form.yearSlug,
                        subjectCode: subject?.code || form.subjectCode
                      })
                    }}
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
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>
              </div>

              {/* Optional: attach an existing PDF by URL (uploads live in Admin → Notes) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  PDF URL (optional)
                </label>
                <input
                  placeholder="https://example.com/file.pdf"
                  value={form.pdfUrl}
                  onChange={e => setForm({ ...form, pdfUrl: e.target.value })}
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
                <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>Paste an existing PDF URL if you have one. To upload a file from your computer, use Admin → Notes.</div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingChapter(null) }}
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
                  {editingChapter ? 'Update Chapter' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
