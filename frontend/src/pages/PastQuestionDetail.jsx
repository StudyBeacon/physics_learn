import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PastQuestionDetail({ isDark }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pastQuestion, setPastQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedQuestions, setRelatedQuestions] = useState([])

  useEffect(() => {
    loadPastQuestion()
    loadRelatedQuestions()
  }, [id])

  const loadPastQuestion = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/past-questions/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPastQuestion(data)
      } else {
        navigate('/past-questions')
      }
    } catch (error) {
      console.error('Error loading past question:', error)
      navigate('/past-questions')
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedQuestions = async () => {
    if (!pastQuestion) return
    
    try {
      const params = new URLSearchParams()
      params.append('subjectCode', pastQuestion.subjectCode)
      params.append('yearSlug', pastQuestion.yearSlug)
      
      const response = await fetch(`${API_BASE}/past-questions?${params}`)
      const data = await response.json()
      // Filter out current question and sort by exam year
      const related = data
        .filter(q => q._id !== id)
        .sort((a, b) => b.examYear.localeCompare(a.examYear))
        .slice(0, 10)
      setRelatedQuestions(related)
    } catch (error) {
      console.error('Error loading related questions:', error)
    }
  }

  const formatQuestionContent = (content) => {
    if (!content) return null

    const lines = content.split('\n')
    const elements = []
    let currentSection = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) {
        elements.push(<div key={i} style={{ height: '0.5rem' }} />)
        continue
      }

      // University/Institute headers
      if (line.includes('University') || line.includes('Institute') || line.includes('Bachelor')) {
        elements.push(
          <div key={i} style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#111827',
            marginBottom: '0.5rem'
          }}>
            {line}
          </div>
        )
      }
      // Course details
      else if (line.includes('Course Title:') || line.includes('Course no:') || line.includes('Semester:') ||
               line.includes('Nature of course:') || line.includes('Full Marks:') || line.includes('Pass Marks:') ||
               line.includes('Credit Hours:') || line.includes('Time:')) {
        elements.push(
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
            fontSize: '0.9rem'
          }}>
            <span style={{
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#374151'
            }}>
              {line}
            </span>
          </div>
        )
      }
      // Section headers (SECTION A, SECTION B, etc.)
      else if (line.match(/^SECTION\s+[A-Z]/i)) {
        currentSection = line
        elements.push(
          <div key={i} style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#111827',
            marginTop: '1.5rem',
            marginBottom: '0.8rem',
            paddingBottom: '0.3rem',
            borderBottom: isDark ? '2px solid #374151' : '2px solid #e5e7eb'
          }}>
            {line}
          </div>
        )
      }
      // Instructions
      else if (line.includes('Attempt any') || line.includes('Candidates are required') || 
               line.includes('The figures in the margin') || line.includes('General Instructions')) {
        elements.push(
          <div key={i} style={{
            fontSize: '0.9rem',
            color: isDark ? '#d1d5db' : '#6b7280',
            marginBottom: '0.6rem',
            fontStyle: 'italic'
          }}>
            {line}
          </div>
        )
      }
      // Question numbers (1., 2., 3., etc.)
      else if (line.match(/^\d+\./)) {
        elements.push(
          <div key={i} style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: isDark ? '#e5e7eb' : '#111827',
            marginTop: '1.2rem',
            marginBottom: '0.6rem',
            paddingLeft: '0.5rem',
            borderLeft: isDark ? '4px solid #3b82f6' : '4px solid #1e40af'
          }}>
            {line}
          </div>
        )
      }
      // Regular paragraphs
      else {
        elements.push(
          <div key={i} style={{
            marginBottom: '0.6rem',
            fontSize: '0.9rem',
            color: isDark ? '#d1d5db' : '#6b7280',
            textAlign: 'justify',
            lineHeight: '1.6'
          }}>
            {line}
          </div>
        )
      }
    }

    return <div>{elements}</div>
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

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: isDark ? '#0f172a' : '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          fontSize: '1.2rem', 
          color: isDark ? '#94a3b8' : '#64748b'
        }}>
          Loading question paper...
        </div>
      </div>
    )
  }

  if (!pastQuestion) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: isDark ? '#0f172a' : '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          fontSize: '1.2rem', 
          color: isDark ? '#94a3b8' : '#64748b'
        }}>
          Question paper not found
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#0f172a' : '#f8fafc',
      display: 'flex'
    }}>
      {/* Left Sidebar - Related Questions */}
      <div style={{
        width: '300px',
        background: isDark ? '#1e293b' : '#ffffff',
        borderRight: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        padding: '20px',
        overflowY: 'auto',
        maxHeight: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: '600', 
          margin: '0 0 20px 0',
          color: isDark ? '#f1f5f9' : '#0f172a'
        }}>
          Other Question Papers
        </h3>
        
        {relatedQuestions.length === 0 ? (
          <div style={{ 
            fontSize: '0.9rem', 
            color: isDark ? '#94a3b8' : '#64748b'
          }}>
            No other question papers found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {relatedQuestions.map((question) => (
              <div
                key={question._id}
                onClick={() => navigate(`/past-questions/${question._id}`)}
                style={{
                  padding: '12px',
                  background: isDark ? '#334155' : '#f8fafc',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: question._id === id ? `4px solid #2563eb` : `4px solid transparent`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? '#475569' : '#f1f5f9'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  marginBottom: '4px'
                }}>
                  {question.title}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: isDark ? '#94a3b8' : '#64748b'
                }}>
                  {question.examYear} • {question.examType}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <button
                onClick={() => navigate('/past-questions')}
                style={{
                  padding: '8px 12px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                  borderRadius: '6px',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ← Back to Past Questions
              </button>
              
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: getYearColor(pastQuestion.yearSlug) + '20',
                color: getYearColor(pastQuestion.yearSlug)
              }}>
                {pastQuestion.yearSlug.charAt(0).toUpperCase() + pastQuestion.yearSlug.slice(1)} Year
              </span>
              
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: getExamTypeColor(pastQuestion.examType) + '20',
                color: getExamTypeColor(pastQuestion.examType)
              }}>
                {pastQuestion.examType.charAt(0).toUpperCase() + pastQuestion.examType.slice(1)}
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              color: isDark ? '#f1f5f9' : '#0f172a'
            }}>
              {pastQuestion.title}
            </h1>
            
            <div style={{ 
              fontSize: '1rem', 
              color: isDark ? '#94a3b8' : '#64748b',
              marginBottom: '8px'
            }}>
              {pastQuestion.subjectCode} • {pastQuestion.examYear}
            </div>
            
            {pastQuestion.description && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: isDark ? '#cbd5e1' : '#4b5563',
                lineHeight: '1.5'
              }}>
                {pastQuestion.description}
              </div>
            )}
          </div>

          {/* Question Content */}
          <div style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            padding: '40px',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {pastQuestion.questionContent ? (
              <div>
                {formatQuestionContent(pastQuestion.questionContent)}
                
                {/* Display Images */}
                {pastQuestion.images && pastQuestion.images.length > 0 && (
                  <div style={{ marginTop: '30px' }}>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      margin: '0 0 20px 0',
                      color: isDark ? '#f1f5f9' : '#0f172a'
                    }}>
                      Question Images
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                      gap: '20px' 
                    }}>
                      {pastQuestion.images
                        .sort((a, b) => a.order - b.order)
                        .map((image, index) => (
                        <div key={index} style={{
                          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: isDark ? '#0f172a' : '#f8fafc'
                        }}>
                          <img
                            src={image.url}
                            alt={image.caption || `Question image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }}
                          />
                          <div style={{ 
                            display: 'none',
                            padding: '20px',
                            textAlign: 'center',
                            color: isDark ? '#94a3b8' : '#64748b'
                          }}>
                            Image failed to load
                          </div>
                          {image.caption && (
                            <div style={{
                              padding: '12px',
                              fontSize: '0.9rem',
                              color: isDark ? '#cbd5e1' : '#4b5563',
                              borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
                            }}>
                              {image.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: isDark ? '#94a3b8' : '#64748b'
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                  Question content not available
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  This question paper may only be available as a PDF download
                </div>
                {pastQuestion.pdfUrl && (
                  <a
                    href={pastQuestion.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      padding: '12px 24px',
                      background: '#2563eb',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            textAlign: 'center',
            color: isDark ? '#94a3b8' : '#64748b',
            fontSize: '0.9rem'
          }}>
            Downloaded {pastQuestion.downloadCount || 0} times
            {pastQuestion.pdfUrl && (
              <span style={{ margin: '0 8px' }}>•</span>
            )}
            {pastQuestion.pdfUrl && (
              <a
                href={pastQuestion.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none' }}
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
