import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PastQuestions({ isDark }) {
  const { yearSlug, subjectCode } = useParams()
  const navigate = useNavigate()
  const [pastQuestions, setPastQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    examYear: '',
    examType: ''
  })
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(subjectCode || '')
  const [selectedYear, setSelectedYear] = useState(yearSlug || '')

  const examTypes = [
    { value: '', label: 'All Types' },
    { value: 'midterm', label: 'Midterm' },
    { value: 'final', label: 'Final' },
    { value: 'internal', label: 'Internal' },
    { value: 'practical', label: 'Practical' },
    { value: 'other', label: 'Other' }
  ]

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: 'first', label: 'First Year' },
    { value: 'second', label: 'Second Year' },
    { value: 'third', label: 'Third Year' },
    { value: 'fourth', label: 'Fourth Year' }
  ]

  useEffect(() => {
    loadSubjects()
    loadPastQuestions()
  }, [selectedSubject, selectedYear, filters])

  const loadSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/catalog`)
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  const loadPastQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedSubject) params.append('subjectCode', selectedSubject)
      if (selectedYear) params.append('yearSlug', selectedYear)
      if (filters.examYear) params.append('examYear', filters.examYear)
      if (filters.examType) params.append('examType', filters.examType)

      const response = await fetch(`${API_BASE}/past-questions?${params}`)
      const data = await response.json()
      setPastQuestions(data)
    } catch (error) {
      console.error('Error loading past questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getExamTypeColor = (type) => {
    const colors = {
      midterm: '#f59e0b',
      final: '#dc2626',
      internal: '#059669',
      practical: '#7c3aed',
      other: '#6b7280'
    }
    return colors[type] || '#6b7280'
  }

  const getYearColor = (year) => {
    const colors = {
      first: '#3b82f6',
      second: '#10b981',
      third: '#f59e0b',
      fourth: '#ef4444'
    }
    return colors[year] || '#6b7280'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#0f172a' : '#f8fafc',
      padding: '20px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            margin: '0 0 8px 0',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }}>
            Past Questions
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: isDark ? '#94a3b8' : '#64748b',
            margin: 0
          }}>
            Access previous year question papers to practice and prepare for your exams
          </p>
        </div>

        {/* Filters */}
        <div style={{
          background: isDark ? '#1e293b' : '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 20px 0',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }}>
            Filter Questions
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                color: isDark ? '#e2e8f0' : '#374151'
              }}>
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#111827',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject.code}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                color: isDark ? '#e2e8f0' : '#374151'
              }}>
                Academic Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#111827',
                  fontSize: '0.9rem'
                }}
              >
                {yearOptions.map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                color: isDark ? '#e2e8f0' : '#374151'
              }}>
                Exam Type
              </label>
              <select
                value={filters.examType}
                onChange={(e) => setFilters({...filters, examType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#111827',
                  fontSize: '0.9rem'
                }}
              >
                {examTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                color: isDark ? '#e2e8f0' : '#374151'
              }}>
                Exam Year
              </label>
              <input
                type="text"
                value={filters.examYear}
                onChange={(e) => setFilters({...filters, examYear: e.target.value})}
                placeholder="e.g., 2023, 2022"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#111827',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: isDark ? '#94a3b8' : '#64748b'
          }}>
            <div style={{ fontSize: '1.1rem' }}>Loading past questions...</div>
          </div>
        ) : pastQuestions.length === 0 ? (
          <div style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
          }}>
            <div style={{ 
              fontSize: '1.2rem', 
              color: isDark ? '#94a3b8' : '#64748b',
              marginBottom: '8px'
            }}>
              No past questions found
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: isDark ? '#64748b' : '#94a3b8'
            }}>
              Try adjusting your filters or check back later for new uploads
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {pastQuestions.map((question) => (
              <div
                key={question._id}
                style={{
                  background: isDark ? '#1e293b' : '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = isDark 
                    ? '0 10px 25px -3px rgba(0, 0, 0, 0.4)' 
                    : '0 10px 25px -3px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = isDark 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => navigate(`/past-questions/${question._id}`)}
              >
                {/* Header */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      background: getYearColor(question.yearSlug) + '20',
                      color: getYearColor(question.yearSlug)
                    }}>
                      {question.yearSlug.charAt(0).toUpperCase() + question.yearSlug.slice(1)} Year
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      background: getExamTypeColor(question.examType) + '20',
                      color: getExamTypeColor(question.examType)
                    }}>
                      {question.examType.charAt(0).toUpperCase() + question.examType.slice(1)}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    margin: '0 0 4px 0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    lineHeight: '1.4'
                  }}>
                    {question.title}
                  </h3>
                  
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#64748b',
                    marginBottom: '8px'
                  }}>
                    {question.subjectCode} • {question.examYear}
                  </div>
                </div>

                {/* Description */}
                {question.description && (
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#cbd5e1' : '#4b5563',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    {question.description}
                  </div>
                )}

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: isDark ? '#94a3b8' : '#64748b'
                  }}>
                    {question.downloadCount || 0} downloads
                    {question.fileSize && ` • ${formatFileSize(question.fileSize)}`}
                  </div>
                  
                  <div style={{
                    padding: '6px 12px',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    View Questions
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
