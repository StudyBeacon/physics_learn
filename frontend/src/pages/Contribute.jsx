import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contribute({ isDark }) {
  const navigate = useNavigate()
  const [contribution, setContribution] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [semester, setSemester] = React.useState('First Semester')
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!(typeof window !== 'undefined' && window.localStorage.getItem('token')))
  
  React.useEffect(() => {
    setIsLoggedIn(!!window.localStorage.getItem('token'))
  }, [])

  const semesters = [
    'First Year', 'Second Year', 'Third Year', 'Fourth Year',
    
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
            <span>Contribute Assets</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ 
          color: isDark ? '#e5e7eb' : '#111827', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          position: 'relative'
        }}>
          Contribute Assets
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
          gap: '2rem'
        }}>
          {/* Left Section */}
          <div>
            <h2 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.5rem', 
              marginBottom: '1rem' 
            }}>
              Contribute Assets
            </h2>
            <p style={{ 
              color: isDark ? '#94a3b8' : '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Share your Physics study materials on PhysicsLearn and help guide the next generation of learners.
            </p>

            {/* Email Contact */}
            <div style={{
              background: isDark ? '#1e293b' : '#e0f2fe',
              border: isDark ? '1px solid #334155' : '1px solid #bae6fd',
              borderRadius: 8,
              padding: '1rem 1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                color: isDark ? '#e5e7eb' : '#0c4a6e',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
                If you have anything to contribute, Please mail us directly at{' '}
                <a 
                  href="mailto:info@physicslearn.com" 
                  style={{ 
                    color: isDark ? '#60a5fa' : '#0284c7',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  info@physicslearn.com
                </a>
              </div>
            </div>

            {/* Login Prompt */}
            {!isLoggedIn && (
              <div style={{
                background: isDark ? '#1e293b' : '#f3f4f6',
                border: isDark ? '1px solid #334155' : '1px solid #d1d5db',
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
                    background: isDark ? '#334155' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#60a5fa' : '#2563eb',
                    fontSize: '1.2rem'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: isDark ? '#e5e7eb' : '#111827',
                      marginBottom: '0.25rem'
                    }}>
                      Must Login to Contribute?
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: isDark ? '#94a3b8' : '#6b7280' 
                    }}>
                      You must login to contribute any assets related to physics study material.
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

            {/* Contribution Form */}
            <form style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontWeight: 500
                }}>
                  What you are contributing..
                </label>
                <input
                  type="text"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="Describe what you're contributing..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: isDark ? '1px solid #334155' : '1px solid #d1d5db',
                    borderRadius: 8,
                    background: isDark ? '#0f172a' : 'white',
                    color: isDark ? '#e5e7eb' : '#111827',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontWeight: 500
                }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or description..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
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

              <div style={{ marginBottom: '1.5rem' }}>
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
                Contribute Assets
              </button>
            </form>
          </div>

          {/* Right Section - Accepted Content */}
          <div>
            <h3 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.25rem', 
              marginBottom: '1.5rem' 
            }}>
              Accepted Content
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
              {/* Study Materials */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  📚
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Study Materials
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Only study materials related to the Physics curriculum will be accepted.
                  </div>
                </div>
              </div>

              {/* Images */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#fee2e2',
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
                    Images
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    You may upload multiple images (Max size: 2MB per image).
                  </div>
                </div>
              </div>

              {/* PDF File */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#f3e8ff',
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
                    Multiple PDF files can be submitted (Max size: 10MB per file).
                  </div>
                </div>
              </div>

              {/* Confirmation Email */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isDark ? '#1e293b' : '#dbeafe',
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
                    Confirmation Email
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    You will receive a confirmation email with the download links to your submitted assets once they are approved.
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

