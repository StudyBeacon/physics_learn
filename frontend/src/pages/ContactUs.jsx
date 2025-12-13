import React from 'react'

export default function ContactUs({ isDark }) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [message, setMessage] = React.useState('')

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
            <span>Contact Us</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ 
          color: isDark ? '#e5e7eb' : '#111827', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          position: 'relative'
        }}>
          Contact Us
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
          {/* Left Section - Contact Form */}
          <div>
            <h2 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.5rem', 
              marginBottom: '1rem' 
            }}>
              Get In Touch
            </h2>
            <p style={{ 
              color: isDark ? '#94a3b8' : '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              If you have any issue or query related to content or tech related stuff then please feel free to contact us. We are always ready to help you.
            </p>

            {/* Messenger Alert */}
            <div style={{
              background: '#fce7f3',
              border: '1px solid #f9a8d4',
              borderRadius: 8,
              padding: '1rem 1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                color: '#9f1239',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                Currently we don't receive messages from this form. Please use messenger chatbox to contact our team directly.
              </div>
              <button
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                💬 Message Us
              </button>
            </div>

            {/* Contact Form */}
            <form>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontWeight: 500
                }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
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
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  Your Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
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
                  Write Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
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

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ✈️ Send Message
              </button>
            </form>
          </div>

          {/* Right Section - Contact Information */}
          <div>
            <h3 style={{ 
              color: isDark ? '#e5e7eb' : '#111827', 
              fontSize: '1.25rem', 
              marginBottom: '1.5rem' 
            }}>
              Contact Information
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
              {/* Email */}
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
                  ✉️
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Email Us
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    <a 
                      href="mailto:info@physicslearn.com" 
                      style={{ 
                        color: isDark ? '#60a5fa' : '#0284c7',
                        textDecoration: 'none'
                      }}
                    >
                      info@physicslearn.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
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
                  📞
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Text/Call Us
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    <a 
                      href="tel:+9779800000000" 
                      style={{ 
                        color: isDark ? '#60a5fa' : '#0284c7',
                        textDecoration: 'none'
                      }}
                    >
                      +977 9800000000
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
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
                  📍
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Address
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Damak, Jhapa Nepal
                  </div>
                </div>
              </div>

              {/* Support */}
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
                  🎧
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDark ? '#e5e7eb' : '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Support
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: isDark ? '#94a3b8' : '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    24/7 Support
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

