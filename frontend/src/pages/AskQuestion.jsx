import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AskQuestion({ isDark }) {
  const navigate = useNavigate()
  const [question, setQuestion] = React.useState('')
  const [semester, setSemester] = React.useState('First Semester')
  const [subject, setSubject] = React.useState('')
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!(typeof window !== 'undefined' && window.localStorage.getItem('token')))
  
  React.useEffect(() => {
    setIsLoggedIn(!!window.localStorage.getItem('token'))
  }, [])

  const semesters = [
    'First Year', 'Second Year', 'Third Year', 'Fourth Year',
    
  ]

  const subjects = [
    'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 
    'Quantum Mechanics', 'Statistical Physics', 'Mathematical Physics',
    'Nuclear Physics', 'Solid State Physics', 'Electronics'
  ]

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: isDark ? '#0b1220' : '#f8fafc', 
      minHeight: '80vh' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            color: isDark ? '#94a3b8' : '#6b7280', 
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
            <span>//</span>
            <a href="/help" style={{ color: 'inherit', textDecoration: 'none' }}>Page</a>
            <span>//</span>
            <span>Ask Question</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ 
          color: isDark ? '#e5e7eb' : '#111827', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          position: 'relative'
        }}>
          Ask Question
          <div style={{
            position: 'absolute',
            left: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)',
            opacity: 0.1,
            borderRadius: '50%',
            filter: 'blur(20px)'
          }}></div>
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem',
          '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
        }}>
          {/* Left Section */}
          <div>
            <h2 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.5rem', 
              marginBottom: '1rem' 
            }}>
              Have a Question?
            </h2>
            <p style={{ 
              color: isDark ? '#94a3b8' : '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              If you have a question related to the subjects listed below, feel free to ask. Our experts will do their best to provide you with an answer, but please note that a response is not guaranteed.
            </p>

            {/* Login Prompt */}
            {!isLoggedIn && (
              <div style={{
                background: isDark ? '#1e293b' : '#e0f2fe',
                border: isDark ? '1px solid #334155' : '1px solid #bae6fd',
                borderRadius: 8,
                padding: '1rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isDark ? '#334155' : '#bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#60a5fa' : '#0284c7',
                    fontSize: '1.2rem'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: isDark ? '#e5e7eb' : '#0c4a6e',
                      marginBottom: '0.25rem'
                    }}>
                      Must Login to Ask Question?
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: isDark ? '#94a3b8' : '#075985' 
                    }}>
                      You must login to ask any question related to physics.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  LOGIN
                </button>
              </div>
            )}

            {/* Question Form */}
            <form style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontWeight: 500
                }}>
                  Write a Question...
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '1rem',
                    border: isDark ? '1px solid #334155' : '1px solid #d1d5db',
                    borderRadius: 8,
                    background: isDark ? '#0f172a' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: isDark ? '#e5e7eb' : '#374151',
                    fontWeight: 500
                  }}>
                    Years
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: isDark ? '1px solid #334155' : '1px solid #d1d5db',
                      borderRadius: 8,
                      background: isDark ? '#0f172a' : 'white',
                      color: isDark ? '#e5e7eb' : '#111827',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: isDark ? '#e5e7eb' : '#374151',
                    fontWeight: 500
                  }}>
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: isDark ? '1px solid #334155' : '1px solid #d1d5db',
                      borderRadius: 8,
                      background: isDark ? '#0f172a' : 'white',
                      color: isDark ? '#e5e7eb' : '#111827',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isLoggedIn}
                style={{
                  width: '100%',
                  background: isLoggedIn ? '#2563eb' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 8,
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  fontSize: '1rem',
                  opacity: isLoggedIn ? 1 : 0.6
                }}
              >
                Submit Question
              </button>
            </form>
          </div>

          {/* Right Section - Guidelines */}
          <div>
            <h3 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.25rem', 
              marginBottom: '1.5rem' 
            }}>
              Guidelines
            </h3>
            <div style={{
              background: isDark ? '#0f172a' : '#f9fafb',
              border: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Question Guidelines */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  💬
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Question Guidelines
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Please ensure your question is clear and specific. Vague or unclear questions may be rejected.
                  </div>
                </div>
              </div>

              {/* Images Upload */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  🖼️
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Images Uploads
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    You may upload multiple images (maximum size: 2MB each) to support your question.
                  </div>
                </div>
              </div>

              {/* PDF File */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  📄
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    PDF File
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Please note that PDF uploads are not supported when submitting a question.
                  </div>
                </div>
              </div>

              {/* Email Notification */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  ✉️
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Email Notification
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    You will receive an email once your question has been answered.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

