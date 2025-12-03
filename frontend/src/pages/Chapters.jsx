import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Chapters({ isDark }) {
  const { yearSlug, subjectSlug } = useParams()
  const navigate = useNavigate()
  const [chapters, setChapters] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [selectedUnit, setSelectedUnit] = React.useState('')
  const [units, setUnits] = React.useState([])
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const loadChapters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedUnit) params.append('unitId', selectedUnit)
      
      const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/chapters?${params}`)
      const data = await res.json()
      setChapters(data)
    } catch (error) {
      console.error('Failed to load chapters:', error)
    }
    setLoading(false)
  }

  const loadUnits = async () => {
    try {
      const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/units`)
      const data = await res.json()
      setUnits(data)
    } catch (error) {
      console.error('Failed to load units:', error)
    }
  }

  React.useEffect(() => { loadChapters() }, [yearSlug, subjectSlug, selectedUnit, API_BASE])
  React.useEffect(() => { loadUnits() }, [yearSlug, subjectSlug, API_BASE])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#dcfce7'
      case 'intermediate': return '#fef3c7'
      case 'advanced': return '#fecaca'
      default: return '#f3f4f6'
    }
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: isDark ? '#0b1220' : '#f8fafc', minHeight: '70vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate(`/year/${yearSlug}/subject/${subjectSlug}`)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#93c5fd' : '#2563eb',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back to Subject
          </button>
          <h1 style={{ 
            color: isDark ? '#e5e7eb' : '#1e40af', 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            fontWeight: '700'
          }}>
            Chapters
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: isDark ? '#94a3b8' : '#4b5563',
            margin: 0
          }}>
            Explore all chapters and start your learning journey
          </p>
        </div>

        {/* Unit Filter */}
        {units.length > 0 && (
          <div style={{ 
            background: isDark ? '#0f172a' : 'white', 
            padding: '1rem', 
            borderRadius: 12, 
            marginBottom: '2rem',
            border: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#111827'
            }}>
              Filter by Unit:
            </label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: 8,
                border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                background: isDark ? '#111827' : 'white',
                color: isDark ? '#e5e7eb' : '#111827',
                fontSize: '1rem',
                minWidth: 200
              }}
            >
              <option value="">All Units</option>
              {units.map(unit => (
                <option key={unit._id} value={unit._id}>
                  {unit.unitName} ({unit.unitCode})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chapters Grid */}
        {loading ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: '1.1rem'
          }}>
            Loading chapters...
          </div>
        ) : chapters.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: isDark ? '#9ca3af' : '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>No chapters yet</h3>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {selectedUnit ? 'No chapters found for this unit.' : 'Chapters will appear here once they are added.'}
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {chapters.map(chapter => (
              <div 
                key={chapter._id}
                style={{
                  background: isDark ? '#0f172a' : 'white',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '1.5rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => navigate(`/year/${yearSlug}/subject/${subjectSlug}/chapters/${chapter._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Chapter Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    color: isDark ? '#e5e7eb' : '#111827',
                    lineHeight: '1.3'
                  }}>
                    {chapter.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {chapter.description}
                  </p>
                </div>

                {/* Chapter Meta */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  alignItems: 'center', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: getDifficultyBg(chapter.difficulty),
                    color: getDifficultyColor(chapter.difficulty),
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {chapter.difficulty}
                  </span>
                  
                  {chapter.unitId && (
                    <span style={{
                      background: isDark ? '#1e293b' : '#f1f5f9',
                      color: isDark ? '#94a3b8' : '#64748b',
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {chapter.unitId.unitName}
                    </span>
                  )}

                  <span style={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '0.8rem'
                  }}>
                    {chapter.questionCount} questions
                  </span>

                  {chapter.estimatedTime > 0 && (
                    <span style={{
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontSize: '0.8rem'
                    }}>
                      {chapter.estimatedTime}min
                    </span>
                  )}
                </div>

                {/* Topics */}
                {chapter.topics && chapter.topics.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: isDark ? '#94a3b8' : '#64748b',
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}>
                      Topics:
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap' 
                    }}>
                      {chapter.topics.slice(0, 3).map((topic, index) => (
                        <span key={index} style={{
                          background: isDark ? '#1e293b' : '#f1f5f9',
                          color: isDark ? '#94a3b8' : '#64748b',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: '0.7rem'
                        }}>
                          {topic}
                        </span>
                      ))}
                      {chapter.topics.length > 3 && (
                        <span style={{
                          color: isDark ? '#94a3b8' : '#64748b',
                          fontSize: '0.7rem'
                        }}>
                          +{chapter.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {chapter.tags && chapter.tags.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap' 
                    }}>
                      {chapter.tags.map((tag, index) => (
                        <span key={index} style={{
                          background: isDark ? '#1e293b' : '#f1f5f9',
                          color: isDark ? '#94a3b8' : '#64748b',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{
                    color: isDark ? '#93c5fd' : '#2563eb',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Start Learning →
                  </span>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
