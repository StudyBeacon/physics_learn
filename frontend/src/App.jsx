import React from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom'

// Lazy-loaded Admin pages to avoid using CommonJS require in ESM
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminUsers = React.lazy(() => import('./pages/admin/Users.jsx'))
const AdminPosts = React.lazy(() => import('./pages/admin/Posts.jsx'))
const AdminSettings = React.lazy(() => import('./pages/admin/Settings.jsx'))
const AdminMaterials = React.lazy(() => import('./pages/admin/Materials.jsx'))
const AdminCatalog = React.lazy(() => import('./pages/admin/Catalog.jsx'))
const AdminNotes = React.lazy(() => import('./pages/admin/Notes.jsx'))
const AdminPastQuestions = React.lazy(() => import('./pages/admin/PastQuestions.jsx'))
const PastQuestions = React.lazy(() => import('./pages/PastQuestions.jsx'))
const PastQuestionDetail = React.lazy(() => import('./pages/PastQuestionDetail.jsx'))
// Units removed per request
const AdminChapters = React.lazy(() => import('./pages/admin/Chapters.jsx'))
const ChapterDetail = React.lazy(() => import('./pages/ChapterDetail.jsx'))
const AskQuestion = React.lazy(() => import('./pages/AskQuestion.jsx'))
const Contribute = React.lazy(() => import('./pages/Contribute.jsx'))
const ContactUs = React.lazy(() => import('./pages/ContactUs.jsx'))

// Navigation Component
function Navbar({ isDark }) {
  const [open, setOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!(typeof window !== 'undefined' && window.localStorage.getItem('token')))
  const [userRole, setUserRole] = React.useState(() => (typeof window !== 'undefined' && window.localStorage.getItem('role')) || 'viewer')
  const [userEmail, setUserEmail] = React.useState(() => (typeof window !== 'undefined' && window.localStorage.getItem('email')) || '')

  React.useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(!!window.localStorage.getItem('token'))
      setUserRole(window.localStorage.getItem('role') || 'viewer')
      setUserEmail(window.localStorage.getItem('email') || '')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const logout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('role')
    window.localStorage.removeItem('email')
    setIsLoggedIn(false)
    setMenuOpen(false)
    window.location.href = '/'
  }
  return (
    <nav style={{ 
      backgroundColor: isDark ? '#0a0a0a' : 'white', 
      padding: '1rem', 
      boxShadow: isDark ? '0 1px 0 #111' : '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isDark ? '#f5f5f5' : '#2563eb', textDecoration: 'none' }}>
          PhysicsLearn
        </a>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center' 
        }}>
          <div style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
            <button
              onMouseEnter={(e)=>{ setOpen(true); e.currentTarget.style.background = isDark ? '#161616' : '#f1f5f9' }}
              onMouseLeave={(e)=>{ e.currentTarget.style.background = 'transparent' }}
              onClick={() => setOpen(!open)}
              style={{
                color: isDark ? '#e5e5e5' : '#374151',
                padding: '0.5rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background .2s ease, color .2s ease, transform .15s ease'
              }}
              onFocus={(e)=>{e.currentTarget.style.transform='translateY(-1px)'}}
              onBlur={(e)=>{e.currentTarget.style.transform='translateY(0)'}}
            >
              Years ▾
            </button>
            {open && (
              <div style={{
                position: 'absolute',
                top: '2.25rem',
                left: 0,
                background: isDark ? '#0f0f0f' : 'white',
                boxShadow: isDark ? '0 1px 0 #111' : '0 6px 20px rgba(0,0,0,0.1)',
                borderRadius: 8,
                width: 220,
                padding: '0.5rem 0'
              }}>
                <a href="/year/first" style={{ display: 'block', padding: '0.5rem 1rem', color: isDark ? '#e5e5e5' : '#1f2937', textDecoration: 'none', borderRadius: 6 }} onMouseEnter={(e)=>e.currentTarget.style.background = isDark ? '#161616' : '#f3f4f6'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>First Year</a>
                <a href="/year/second" style={{ display: 'block', padding: '0.5rem 1rem', color: isDark ? '#e5e5e5' : '#1f2937', textDecoration: 'none', borderRadius: 6 }} onMouseEnter={(e)=>e.currentTarget.style.background = isDark ? '#161616' : '#f3f4f6'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>Second Year</a>
                <a href="/year/third" style={{ display: 'block', padding: '0.5rem 1rem', color: isDark ? '#e5e5e5' : '#1f2937', textDecoration: 'none', borderRadius: 6 }} onMouseEnter={(e)=>e.currentTarget.style.background = isDark ? '#161616' : '#f3f4f6'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>Third Year</a>
                <a href="/year/fourth" style={{ display: 'block', padding: '0.5rem 1rem', color: isDark ? '#e5e5e5' : '#1f2937', textDecoration: 'none', borderRadius: 6 }} onMouseEnter={(e)=>e.currentTarget.style.background = isDark ? '#161616' : '#f3f4f6'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>Fourth Year</a>
              </div>
            )}
          </div>
          <a href="/past-questions" className="nav-link" style={{ color: isDark ? '#e5e5e5' : '#374151', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, transition: 'background .2s ease, transform .15s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.background = isDark ? '#161616' : '#f1f5f9'; e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateY(0)'}}>Past Questions</a>
          <a href="/articles" className="nav-link" style={{ color: isDark ? '#e5e5e5' : '#374151', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, transition: 'background .2s ease, transform .15s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.background = isDark ? '#161616' : '#f1f5f9'; e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateY(0)'}}>Articles</a>
          <a href="/help" className="nav-link" style={{ color: isDark ? '#e5e5e5' : '#374151', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, transition: 'background .2s ease, transform .15s ease' }} onMouseEnter={(e)=>{e.currentTarget.style.background = isDark ? '#161616' : '#f1f5f9'; e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateY(0)'}}>Help</a>
          {!isLoggedIn ? (
            <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
              <a href="/login" style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                textDecoration: 'none' 
              }}>Login</a>
              <a href="/register" style={{ 
                backgroundColor: '#e5e7eb', 
                color: '#374151', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                textDecoration: 'none' 
              }}>Register</a>
            </div>
          ) : (
            <div style={{ marginLeft: '1rem', position: 'relative' }}>
              <button onClick={() => setMenuOpen(v=>!v)} aria-label="User menu" style={{
                width: 36, height: 36, borderRadius: '9999px', border: '1px solid #cbd5e1',
                background: isDark ? '#0f0f0f' : '#fff', color: isDark ? '#e5e7eb' : '#111827', cursor: 'pointer'
              }}>
                {(userEmail || 'U').charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 42, background: isDark ? '#0f0f0f' : '#fff',
                  border: isDark ? '1px solid #111' : '1px solid #e5e7eb', borderRadius: 8, minWidth: 220, boxShadow: isDark ? '0 1px 0 #111' : '0 10px 30px rgba(0,0,0,.08)'
                }}>
                  <div style={{ padding: '10px 12px', borderBottom: isDark ? '1px solid #111' : '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 600 }}>{userEmail || 'Logged in user'}</div>
                    <div style={{ fontSize: 12, opacity: .7 }}>Role: {userRole}</div>
                  </div>
                  <a href="/admin" style={{ display: userRole === 'admin' ? 'block' : 'none', padding: '10px 12px', textDecoration: 'none', color: isDark ? '#e5e5e5' : '#111827' }}>Admin Dashboard</a>
                  <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? '#e5e5e5' : '#111827' }}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

// Home Page Component
function Home({ isDark }) {
  return (
    <div style={{ 
      padding: '3rem 2rem', 
      background: isDark ? 'linear-gradient(135deg,#0b1220 0%, #0f172a 40%, #111827 100%)' : 'linear-gradient(135deg,#eef2ff 0%, #f8fafc 40%, #ecfeff 100%)',
      minHeight: '70vh' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <h1 style={{ 
            color: isDark ? '#e5e7eb' : '#0b1324', 
            fontSize: '3.5rem', 
            lineHeight: 1.1,
            marginBottom: '0.75rem',
            textAlign: 'left'
          }}>
            Welcome to PhysicsLearn
          </h1>
          <p style={{ 
            fontSize: '1.15rem', 
            color: isDark ? '#94a3b8' : '#475569', 
            marginBottom: '1.5rem',
            textAlign: 'left',
            maxWidth: '60ch'
          }}>
            Your comprehensive platform for BSC Physics studies. Access study materials, practice questions, and academic resources all in one place.
          </p>
          {/* Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '0 0 2rem 0' }}>
            <div style={{
              display: 'flex',
              gap: 8,
              background: isDark ? '#0b1220' : 'white',
              padding: 8,
              borderRadius: 9999,
              boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.45)' : '0 10px 25px rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: 560
            }}>
              <input
                placeholder="Search questions, topics, or subjects..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: 9999,
                  fontSize: 16,
                  background: 'transparent',
                  color: isDark ? '#e5e7eb' : '#0f172a'
                }}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 9999,
                  cursor: 'pointer',
                  transition: 'transform .15s ease, box-shadow .2s ease',
                  boxShadow: '0 6px 14px rgba(14,165,233,.35)'
                }}
                onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)'}}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* feature cards section removed per request */}
    
    </div>
  )
}

// Year Page
function YearPage({ isDark }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const titleMap = {
    first: 'First Year',
    second: 'Second Year', 
    third: 'Third Year',
    fourth: 'Fourth Year'
  }

  const curriculum = {
    first: [
      { 
        code: 'PHY101', 
        name: 'Mechanics, Thermodynamics, Statistical Physics, Electricity and Magnetism', 
        description: 'Core physics fundamentals covering mechanics, thermodynamics, statistical physics, and electromagnetism.',
        marks: 100, 
        nature: 'Theory',
        chapters: 12
      },
      { 
        code: 'PHY102', 
        name: 'Physics Laboratory', 
        description: 'Hands-on experiments and practical applications of physics concepts.',
        marks: 50, 
        nature: 'Practical',
        chapters: 8
      },
      { 
        code: 'MAT101', 
        name: 'Calculus', 
        description: 'Differential and integral calculus with applications to physics problems.',
        marks: 75, 
        nature: 'Theory',
        chapters: 10
      },
      { 
        code: 'MAT102', 
        name: 'Analytical Geometry Vector Analysis', 
        description: 'Vector algebra, coordinate systems, and analytical geometry.',
        marks: 75, 
        nature: 'Theory',
        chapters: 9
      },
      { 
        code: 'STA101', 
        name: 'Fundamentals of Statistics', 
        description: 'Basic statistical concepts, probability theory, and data analysis.',
        marks: 100, 
        nature: 'Theory',
        chapters: 11
      },
      { 
        code: 'STA102', 
        name: 'Statistics Practical', 
        description: 'Practical applications of statistical methods and data analysis.',
        marks: 50, 
        nature: 'Practical',
        chapters: 6
      },
      { 
        code: 'SC101',  
        name: 'Scientific Communication', 
        description: 'Technical writing, presentation skills, and scientific communication.',
        marks: 50, 
        nature: 'Theory',
        chapters: 7
      },
    ],
    second: [
      { 
        code: 'PHY201', 
        name: 'Optics, Modern Physics, Electronics', 
        description: 'Wave optics, quantum mechanics basics, and electronic circuits.',
        marks: 100, 
        nature: 'Theory',
        chapters: 14
      },
      { 
        code: 'PHY202', 
        name: 'Physics Laboratory', 
        description: 'Advanced physics experiments and measurements.',
        marks: 50, 
        nature: 'Practical',
        chapters: 9
      },
      { 
        code: 'MAT201', 
        name: 'Linear Algebra', 
        description: 'Vector spaces, matrices, eigenvalues, and linear transformations.',
        marks: 75, 
        nature: 'Theory',
        chapters: 12
      },
      { 
        code: 'MAT202', 
        name: 'Differential Equations', 
        description: 'Ordinary and partial differential equations with physics applications.',
        marks: 75, 
        nature: 'Theory',
        chapters: 11
      },
      { 
        code: 'STA201', 
        name: 'Applied Statistics', 
        description: 'Statistical methods applied to scientific and engineering problems.',
        marks: 50, 
        nature: 'Theory',
        chapters: 8
      },
      { 
        code: 'STA202', 
        name: 'Statistical Practical', 
        description: 'Computer-based statistical analysis and modeling.',
        marks: 50, 
        nature: 'Practical',
        chapters: 5
      },
      { 
        code: 'APS203', 
        name: 'Probability Inference', 
        description: 'Bayesian inference, hypothesis testing, and statistical decision theory.',
        marks: 100, 
        nature: 'Theory',
        chapters: 13
      },
    ],
    third: [
      { 
        code: 'PHY301', 
        name: 'Mathematical Physics & Classical Mechanics', 
        description: 'Advanced mathematical methods and classical mechanics principles.',
        marks: 100, 
        nature: 'Theory',
        chapters: 15
      },
      { 
        code: 'PHY302', 
        name: 'Physics Laboratory', 
        description: 'Advanced experimental techniques and data analysis.',
        marks: 50, 
        nature: 'Practical',
        chapters: 10
      },
      { 
        code: 'MAT301', 
        name: 'Computer Programming', 
        description: 'Programming fundamentals with focus on scientific computing.',
        marks: 75, 
        nature: 'Theory/Lab',
        chapters: 12
      },
      { 
        code: 'MAT302', 
        name: 'Real Analysis', 
        description: 'Rigorous treatment of calculus and mathematical analysis.',
        marks: 100, 
        nature: 'Theory',
        chapters: 14
      },
      { 
        code: 'MAT303', 
        name: 'Numerical Methods', 
        description: 'Numerical techniques for solving mathematical and physics problems.',
        marks: 150, 
        nature: 'Theory/Lab',
        chapters: 16
      },
      { 
        code: 'PHY305', 
        name: 'Space Science', 
        description: 'Astrophysics, cosmology, and space exploration fundamentals.',
        marks: 50, 
        nature: 'Theory',
        chapters: 9
      },
      { 
        code: 'RM305',  
        name: 'Research Methodology', 
        description: 'Research design, data collection, and scientific methodology.',
        marks: 100, 
        nature: 'Theory/Lab',
        chapters: 11
      },
    ],
    fourth: [
      { 
        code: 'PHY401', 
        name: 'Quantum Mechanics', 
        description: 'Advanced quantum theory, wave functions, and quantum systems.',
        marks: 100, 
        nature: 'Theory',
        chapters: 18
      },
      { 
        code: 'PHY402', 
        name: 'Physics Lab (General)', 
        description: 'Comprehensive physics experiments and research projects.',
        marks: 50, 
        nature: 'Practical',
        chapters: 12
      },
      { 
        code: 'PHY403', 
        name: 'Nuclear Physics & Solid State Physics', 
        description: 'Nuclear structure, radioactivity, and solid state properties.',
        marks: 100, 
        nature: 'Theory',
        chapters: 16
      },
      { 
        code: 'PHY405', 
        name: 'Physics Lab (Electronics)', 
        description: 'Electronic circuits, instrumentation, and measurements.',
        marks: 50, 
        nature: 'Practical',
        chapters: 8
      },
      { 
        code: 'PHY406', 
        name: 'Material Science OR Project Work', 
        description: 'Materials properties, characterization, or independent research project.',
        marks: 100, 
        nature: 'Research/Presentation',
        chapters: 10
      },
      { 
        code: 'PHY407', 
        name: 'Econophysics', 
        description: 'Application of physics methods to economic and financial systems.',
        marks: 50, 
        nature: 'Theory',
        chapters: 7
      },
      { 
        code: 'CM408', 
        name: 'Computational Course', 
        description: 'Advanced computational methods and simulations in physics.',
        marks: 50, 
        nature: 'Theory/Lab',
        chapters: 9
      },
    ],
  }

  const title = titleMap[slug] || 'Year'
  const [subjects, setSubjects] = React.useState([])
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/years/${slug}/subjects`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length) {
            setSubjects(data.map(s => ({ code: s.code, name: s.name, description: s.description || '', chapters: s.chapters || 0 })))
            return
          }
        }
        // fallback to static
        setSubjects(curriculum[slug] || [])
      } catch {
        setSubjects(curriculum[slug] || [])
      }
    })()
  }, [API_BASE, slug])

  const handleSubjectClick = (subject) => {
    const subjectSlug = subject.code.toLowerCase()
    navigate(`/year/${slug}/subject/${subjectSlug}`)
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: isDark ? '#0b1220' : '#f8fafc', minHeight: '70vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ color: isDark ? '#e5e7eb' : '#1e40af', fontSize: '2.2rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ fontSize: '1rem', color: isDark ? '#94a3b8' : '#4b5563', marginBottom: '2rem' }}>
          Select a subject to explore chapters and study materials.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {subjects.map((subject, idx) => (
            <div 
              key={subject.code + idx}
              style={{ 
                background: isDark ? '#0f172a' : 'white', 
                borderRadius: 16, 
                padding: '1.5rem', 
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.35)' : '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb'
              }}
              onClick={() => handleSubjectClick(subject)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: isDark ? '#93c5fd' : '#1e40af', 
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                {subject.name}
              </h3>
              
              <p style={{ 
                color: isDark ? '#9ca3af' : '#6b7280', 
                fontSize: '0.9rem', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {subject.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: isDark ? '#cbd5e1' : '#4b5563'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: 10, height: 10, background: '#334155', display: 'inline-block', borderRadius: 2 }}></span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{subject.code}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: 10, height: 10, background: '#334155', display: 'inline-block', borderRadius: 2 }}></span>
                  <span>Chapters: {subject.chapters}+</span>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <button style={{
                  background: isDark ? '#2563eb' : '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Subject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Subject Page Component
function SubjectPage({ isDark }) {
  const { yearSlug, subjectSlug } = useParams()
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [materials, setMaterials] = React.useState([])
  const [units, setUnits] = React.useState([])
  const [chapters, setChapters] = React.useState([])
  const [subject, setSubject] = React.useState(null)
  const [activeCat, setActiveCat] = React.useState('chapter')
  
  const titleMap = {
    first: 'First Year',
    second: 'Second Year', 
    third: 'Third Year',
    fourth: 'Fourth Year'
  }

  // Sample units/chapters for each subject
  const subjectUnits = {
    phy101: [
      { id: 1, title: 'Kinematics and Dynamics', description: 'Motion in one and two dimensions, Newton\'s laws' },
      { id: 2, title: 'Work, Energy and Power', description: 'Conservative forces, potential energy, power' },
      { id: 3, title: 'Rotational Motion', description: 'Angular momentum, torque, moment of inertia' },
      { id: 4, title: 'Thermodynamics', description: 'Laws of thermodynamics, heat engines, entropy' },
      { id: 5, title: 'Statistical Physics', description: 'Maxwell-Boltzmann distribution, quantum statistics' },
      { id: 6, title: 'Electric Fields', description: 'Coulomb\'s law, Gauss\'s law, electric potential' },
      { id: 7, title: 'Magnetic Fields', description: 'Biot-Savart law, Ampere\'s law, electromagnetic induction' },
      { id: 8, title: 'Maxwell\'s Equations', description: 'Electromagnetic waves, displacement current' },
    ],
    phy102: [
      { id: 1, title: 'Measurement and Error Analysis', description: 'Significant figures, error propagation' },
      { id: 2, title: 'Mechanics Experiments', description: 'Simple pendulum, projectile motion' },
      { id: 3, title: 'Thermodynamics Lab', description: 'Heat capacity, thermal conductivity' },
      { id: 4, title: 'Electricity Experiments', description: 'Ohm\'s law, RC circuits, magnetic fields' },
      { id: 5, title: 'Optics Lab', description: 'Reflection, refraction, interference' },
      { id: 6, title: 'Data Analysis', description: 'Graphing, curve fitting, statistical analysis' },
    ],
    mat101: [
      { id: 1, title: 'Limits and Continuity', description: 'Definition of limits, continuity theorems' },
      { id: 2, title: 'Derivatives', description: 'Chain rule, implicit differentiation, applications' },
      { id: 3, title: 'Integration', description: 'Fundamental theorem, integration techniques' },
      { id: 4, title: 'Applications of Calculus', description: 'Optimization, related rates, area/volume' },
      { id: 5, title: 'Series and Sequences', description: 'Convergence tests, Taylor series' },
      { id: 6, title: 'Multivariable Calculus', description: 'Partial derivatives, multiple integrals' },
    ],
    // Add more subjects as needed
  }

  const subjectInfo = {
    phy101: { name: 'Mechanics, Thermodynamics, Statistical Physics, Electricity and Magnetism', code: 'PHY101' },
    phy102: { name: 'Physics Laboratory', code: 'PHY102' },
    mat101: { name: 'Calculus', code: 'MAT101' },
    mat102: { name: 'Analytical Geometry Vector Analysis', code: 'MAT102' },
    sta101: { name: 'Fundamentals of Statistics', code: 'STA101' },
    sta102: { name: 'Statistics Practical', code: 'STA102' },
    sc101: { name: 'Scientific Communication', code: 'SC101' },
    phy201: { name: 'Optics, Modern Physics, Electronics', code: 'PHY201' },
    phy202: { name: 'Physics Laboratory', code: 'PHY202' },
    mat201: { name: 'Linear Algebra', code: 'MAT201' },
    mat202: { name: 'Differential Equations', code: 'MAT202' },
    sta201: { name: 'Applied Statistics', code: 'STA201' },
    sta202: { name: 'Statistical Practical', code: 'STA202' },
    aps203: { name: 'Probability Inference', code: 'APS203' },
    phy301: { name: 'Mathematical Physics & Classical Mechanics', code: 'PHY301' },
    phy302: { name: 'Physics Laboratory', code: 'PHY302' },
    mat301: { name: 'Computer Programming', code: 'MAT301' },
    mat302: { name: 'Real Analysis', code: 'MAT302' },
    mat303: { name: 'Numerical Methods', code: 'MAT303' },
    phy305: { name: 'Space Science', code: 'PHY305' },
    rm305: { name: 'Research Methodology', code: 'RM305' },
    phy401: { name: 'Quantum Mechanics', code: 'PHY401' },
    phy402: { name: 'Physics Lab (General)', code: 'PHY402' },
    phy403: { name: 'Nuclear Physics & Solid State Physics', code: 'PHY403' },
    phy405: { name: 'Physics Lab (Electronics)', code: 'PHY405' },
    phy406: { name: 'Material Science OR Project Work', code: 'PHY406' },
    phy407: { name: 'Econophysics', code: 'PHY407' },
    cm408: { name: 'Computational Course', code: 'CM408' },
  }

  const yearTitle = titleMap[yearSlug] || 'Year'
  const fallbackSubject = subjectInfo[subjectSlug] || { name: 'Subject', code: 'CODE' }
  // removed static fallback units; using API-driven units state

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/materials`)
        const data = await res.json()
        setMaterials(Array.isArray(data) ? data : [])
      } catch (e) {
        setMaterials([])
      }
    })()
  }, [API_BASE, yearSlug, subjectSlug])

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/chapters`)
        const data = await res.json()
        setChapters(Array.isArray(data) ? data : [])
      } catch (e) {
        setChapters([])
      }
    })()
  }, [API_BASE, yearSlug, subjectSlug])

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/units`)
        const data = await res.json()
        setUnits(Array.isArray(data) ? data : [])
      } catch (e) {
        setUnits([])
      }
    })()
  }, [API_BASE, yearSlug, subjectSlug])

  React.useEffect(() => {
    (async () => {
      try {
        // Load subject data to get syllabus from public endpoint
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/info`)
        const data = await res.json()
        setSubject(data)
      } catch (e) {
        setSubject(null)
      }
    })()
  }, [API_BASE, yearSlug, subjectSlug])

  return (
    <div style={{ padding: '2rem', backgroundColor: isDark ? '#0b1220' : '#f8fafc', minHeight: '70vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate(`/year/${yearSlug}`)}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#93c5fd' : '#1e40af',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            ← Back to {yearTitle}
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: isDark ? '#e5e7eb' : '#1e40af', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            {subject ? subject.name : fallbackSubject.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ 
              background: isDark ? '#111827' : '#dbeafe', 
              color: isDark ? '#93c5fd' : '#1e40af', 
              padding: '0.25rem 0.75rem', 
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              {subject ? subject.code : fallbackSubject.code}
            </span>
            <span style={{ color: isDark ? '#94a3b8' : '#6b7280', fontSize: '0.9rem' }}>
              {yearTitle}
            </span>
          </div>
          <p style={{ fontSize: '1rem', color: isDark ? '#94a3b8' : '#4b5563' }}>
            Explore chapters and study materials for {subject ? subject.name : fallbackSubject.name}.
          </p>
        </div>

        {/* Units grid removed: we now show materials organized by Chapters/Syllabus/Question Bank */}

        {/* Local sub-navbar: Chapters | Syllabus | Question Banks */}
        <div style={{ position: 'sticky', top: 64, zIndex: 5, background: isDark ? '#0b1220' : '#ffffff', borderBottom: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
            {[ 'chapter','syllabus','questionBank' ].map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                background: activeCat === cat ? (isDark ? '#111827' : '#f3f4f6') : 'transparent',
                color: isDark ? '#e5e7eb' : '#111827',
                border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                boxShadow: activeCat === cat ? (isDark ? 'inset 0 -2px 0 #2563eb' : 'inset 0 -2px 0 #0ea5e9') : 'none'
              }}>
                {cat === 'chapter' ? 'Chapters' : cat === 'syllabus' ? 'Syllabus' : 'Question Banks'}
              </button>
            ))}
          </div>
        </div>

        {/* Content for current tab */}
        <div style={{ marginTop: '1rem' }}>
          {activeCat === 'chapter' ? (
            chapters.length === 0 ? (
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No chapters yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                {chapters.map(ch => (
                  <li key={ch._id} onClick={()=>navigate(`/year/${yearSlug}/subject/${subjectSlug}/chapters/${ch._id}`)} style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: isDark ? '#e5e7eb' : '#111827' }}>{ch.title}</div>
                      {(ch.unitId?.unitName) ? (
                        <div style={{ fontSize: 12, opacity: .7 }}>Unit: {ch.unitId.unitName}</div>
                      ) : null}
                    </div>
                    <span style={{ color: isDark ? '#93c5fd' : '#2563eb', fontSize: 13, fontWeight: 600 }}>Read →</span>
                  </li>
                ))}
              </ul>
            )
          ) : activeCat === 'syllabus' ? (
            subject && subject.syllabus ? (
              <div style={{ 
                background: isDark ? '#0f0f0f' : '#fff', 
                border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb', 
                borderRadius: 12, 
                padding: '2.5rem',
                maxWidth: 1000,
                margin: '0 auto',
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: isDark ? '#e5e7eb' : '#111827' }}>
                    {subject.name}
                  </h1>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '1rem' }}>
                    Course Code: {subject.code} • {titleMap[yearSlug]} Year
                  </div>
                </div>

                <div style={{ 
                  lineHeight: '1.7', 
                  color: isDark ? '#d1d5db' : '#374151',
                  fontSize: '0.95rem'
                }}>
                  {formatSyllabus(subject.syllabus, isDark)}
                </div>
              </div>
            ) : (
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '2rem' }}>
                Syllabus not available yet.
              </p>
            )
          ) : (
            materials.filter(m => m.category === activeCat).length === 0 ? (
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No items yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                {materials.filter(m => m.category === activeCat).map(m => (
                  <li key={m._id} style={{ background: isDark ? '#0f0f0f' : '#fff', border: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: isDark ? '#e5e7eb' : '#111827' }}>{m.title}</div>
                      <div style={{ fontSize: 12, opacity: .7 }}>{m.type.toUpperCase()} • {m.subjectCode}</div>
                    </div>
                    <a href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: isDark ? '#2563eb' : '#0ea5e9', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>Open</a>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  )
}

// Login Page Component
function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [ok, setOk] = React.useState('')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setOk('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('email', data.user.email)
      setOk('Logged in successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc', 
      minHeight: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        <h1 style={{ 
          color: '#1e40af', 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          textAlign: 'center' 
        }}>
          Login
        </h1>
        {error && <div style={{ color: '#b91c1c', marginBottom: 10 }}>{error}</div>}
        {ok && <div style={{ color: '#065f46', marginBottom: 10 }}>{ok}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontWeight: '500' 
            }}>
              Email
            </label>
            <input 
              type="email" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontWeight: '500' 
            }}>
              Password
            </label>
            <input 
              type="password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1rem', 
              fontWeight: '500', 
              cursor: 'pointer' 
            }}
          >
            Login
          </button>
        </form>
        <p style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          color: '#6b7280' 
        }}>
          Don't have an account? <a href="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Register here</a>
        </p>
      </div>
    </div>
  )
}

// Register Page Component
function Register() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [ok, setOk] = React.useState('')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setOk('')
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('email', data.user.email)
      setOk('Account created successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc', 
      minHeight: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        <h1 style={{ 
          color: '#1e40af', 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          textAlign: 'center' 
        }}>
          Register
        </h1>
        {error && <div style={{ color: '#b91c1c', marginBottom: 10 }}>{error}</div>}
        {ok && <div style={{ color: '#065f46', marginBottom: 10 }}>{ok}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontWeight: '500' 
            }}>
              Full Name
            </label>
            <input 
              type="text" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your full name"
              value={name}
              onChange={e=>setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontWeight: '500' 
            }}>
              Email
            </label>
            <input 
              type="email" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontWeight: '500' 
            }}>
              Password
            </label>
            <input 
              type="password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Create a password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1rem', 
              fontWeight: '500', 
              cursor: 'pointer' 
            }}
          >
            Register
          </button>
        </form>
        <p style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          color: '#6b7280' 
        }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Login here</a>
        </p>
      </div>
    </div>
  )
}

// Footer Component
function Footer() {
  return (
    <footer style={{ background: '#0b1220', color: 'white', padding: '3rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#93c5fd', marginBottom: 8 }}>PhysicsLearn</div>
          <p style={{ color: '#cbd5e1', maxWidth: '45ch' }}>
            Resources for BSC Physics: notes, questions, articles and more. Learn faster with a curated curriculum.
          </p>
          <p style={{ color: '#94a3b8', marginTop: 10 }}>support@physicslearn.com</p>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Years</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1' }}>
            <li><a href="/year/first" style={{ color: 'inherit', textDecoration: 'none' }}>First Year</a></li>
            <li><a href="/year/second" style={{ color: 'inherit', textDecoration: 'none' }}>Second Year</a></li>
            <li><a href="/year/third" style={{ color: 'inherit', textDecoration: 'none' }}>Third Year</a></li>
            <li><a href="/year/fourth" style={{ color: 'inherit', textDecoration: 'none' }}>Fourth Year</a></li>
          </ul>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Links</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1' }}>
            <li><a href="/past-questions" style={{ color: 'inherit', textDecoration: 'none' }}>Past Questions</a></li>
            <li><a href="/articles" style={{ color: 'inherit', textDecoration: 'none' }}>Articles</a></li>
            <li><a href="/help" style={{ color: 'inherit', textDecoration: 'none' }}>Help</a></li>
          </ul>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Follow</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#1e293b', borderRadius: 8 }}></div>
            <div style={{ width: 36, height: 36, background: '#1e293b', borderRadius: 8 }}></div>
            <div style={{ width: 36, height: 36, background: '#1e293b', borderRadius: 8 }}></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '1.5rem auto 0', borderTop: '1px solid #1e293b', paddingTop: 12, color: '#94a3b8', textAlign: 'center' }}>
        © 2024 PhysicsLearn. All rights reserved.
      </div>
    </footer>
  )
}

// Function to format syllabus text with proper styling like hamrocsit.com
function formatSyllabus(text, isDark) {
  if (!text) return null
  
  const lines = text.split('\n')
  const elements = []
  let courseDetails = []
  let inCourseDetails = false
  
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
    // Course details - collect them for two-column layout
    else if (line.includes('Course Title:') || line.includes('Course no:') || line.includes('Semester:') || 
             line.includes('Nature of course:') || line.includes('Full Marks:') || line.includes('Pass Marks:') || 
             line.includes('Credit Hours:')) {
      courseDetails.push(line)
      inCourseDetails = true
    }
    // Section headers (Course Description, Course Objective, etc.)
    else if (line.includes('Course Description') || line.includes('Course Objective') || line.includes('Course Contents')) {
      // Render course details in two columns before section headers
      if (inCourseDetails && courseDetails.length > 0) {
        const leftDetails = courseDetails.filter(d => 
          d.includes('Course Title:') || d.includes('Course no:') || 
          d.includes('Semester:') || d.includes('Nature of course:')
        )
        const rightDetails = courseDetails.filter(d => 
          d.includes('Full Marks:') || d.includes('Pass Marks:') || d.includes('Credit Hours:')
        )
        
        elements.push(
          <div key={`course-details-${i}`} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: isDark ? '#1a1a1a' : '#f8f9fa',
            borderRadius: '8px',
            border: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
          }}>
            <div style={{ flex: 1 }}>
              {leftDetails.map((detail, idx) => {
                const [label, value] = detail.split(':').map(s => s.trim())
                return (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    marginBottom: '0.4rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      minWidth: '140px',
                      color: isDark ? '#e5e7eb' : '#374151'
                    }}>
                      {label}:
                    </span>
                    <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                      {value}
                    </span>
                  </div>
                )
              })}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              {rightDetails.map((detail, idx) => {
                const [label, value] = detail.split(':').map(s => s.trim())
                return (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginBottom: '0.4rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      minWidth: '100px',
                      color: isDark ? '#e5e7eb' : '#374151'
                    }}>
                      {label}:
                    </span>
                    <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                      {value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
        courseDetails = []
        inCourseDetails = false
      }
      
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
    // Unit headers (Unit 1, Unit 2, etc.)
    else if (line.match(/^Unit \d+\./)) {
      const parts = line.split('(')
      const unitTitle = parts[0].trim()
      const hours = parts[1] ? `(${parts[1]}` : ''
      
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
          {unitTitle} {hours}
        </div>
      )
    }
    // Sub-topics (indented with bullet points)
    else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      elements.push(
        <div key={i} style={{ 
          marginLeft: '1.5rem',
          marginBottom: '0.3rem',
          fontSize: '0.9rem',
          color: isDark ? '#d1d5db' : '#6b7280'
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
          textAlign: 'justify'
        }}>
          {line}
        </div>
      )
    }
  }
  
  return <div>{elements}</div>
}

// Main App Component
export default function App() {
  const [isDark, setIsDark] = React.useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
    return saved === 'dark'
  })

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', next ? 'dark' : 'light')
    }
  }

  return (
    <Router>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: isDark ? '#0b1220' : 'white'
      }}>
        <RouterAwareShell isDark={isDark}>
          <Navbar isDark={isDark} />
        </RouterAwareShell>
        <main style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              position: 'fixed',
              right: 8,
              top: '34%',
              transform: 'translateY(-34%)',
              zIndex: 1100,
              width: 56,
              height: 56,
              borderRadius: '9999px',
              border: 'none',
              background: 'transparent',
              color: isDark ? '#fbbf24' : '#0f172a',
              boxShadow: 'none',
              cursor: 'pointer'
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{isDark ? '🌙' : '☀️'}</span>
          </button>
          <React.Suspense fallback={<div />}> 
          <Routes>
            <Route path="/" element={<Home isDark={isDark} />} />
            <Route path="/admin/login" element={<AdminLogin isDark={isDark} />} />
            <Route path="/admin" element={<AdminLayout isDark={isDark} />} >
              <Route index element={<AdminDashboard isDark={isDark} />} />
              <Route path="users" element={<AdminUsers isDark={isDark} />} />
              <Route path="posts" element={<AdminPosts isDark={isDark} />} />
              <Route path="catalog" element={<AdminCatalog isDark={isDark} />} />
              <Route path="chapters" element={<AdminChapters isDark={isDark} />} />
              <Route path="notes" element={<AdminNotes isDark={isDark} />} />
              <Route path="past-questions" element={<AdminPastQuestions isDark={isDark} />} />
              <Route path="materials" element={<AdminMaterials isDark={isDark} />} />
              <Route path="settings" element={<AdminSettings isDark={isDark} />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
                <Route path="/year/:slug" element={<YearPage isDark={isDark} />} />
                <Route path="/year/:yearSlug/subject/:subjectSlug" element={<SubjectPage isDark={isDark} />} />
                <Route path="/year/:yearSlug/subject/:subjectSlug/chapters" element={<ChapterDetail isDark={isDark} />} />
                <Route path="/year/:yearSlug/subject/:subjectSlug/chapters/:chapterId" element={<ChapterDetail isDark={isDark} />} />
            <Route path="/past-questions" element={<PastQuestions isDark={isDark} />} />
            <Route path="/past-questions/:id" element={<PastQuestionDetail isDark={isDark} />} />
            <Route path="/articles" element={
              <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '70vh' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <h1 style={{ color: '#1e40af', fontSize: '2.5rem', marginBottom: '1rem' }}>Articles</h1>
                  <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>Educational articles and resources will be available here.</p>
                </div>
              </div>
            } />
            <Route path="/help" element={
              <div style={{ padding: '2rem', backgroundColor: isDark ? '#0b1220' : '#f8fafc', minHeight: '70vh' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <h1 style={{ color: isDark ? '#e5e7eb' : '#1e40af', fontSize: '2.5rem', marginBottom: '1rem' }}>Help & Support</h1>
                  <p style={{ fontSize: '1.2rem', color: isDark ? '#94a3b8' : '#4b5563' }}>Get help and support for using PhysicsLearn.</p>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href="/help/ask-question" style={{ 
                      padding: '1rem 2rem', 
                      background: '#2563eb', 
                      color: 'white', 
                      borderRadius: 8, 
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>Ask Question</a>
                    <a href="/help/contribute" style={{ 
                      padding: '1rem 2rem', 
                      background: '#10b981', 
                      color: 'white', 
                      borderRadius: 8, 
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>Contribute</a>
                    <a href="/help/contact" style={{ 
                      padding: '1rem 2rem', 
                      background: '#8b5cf6', 
                      color: 'white', 
                      borderRadius: 8, 
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>Contact Us</a>
                  </div>
                </div>
              </div>
            } />
            <Route path="/help/ask-question" element={<AskQuestion isDark={isDark} />} />
            <Route path="/help/contribute" element={<Contribute isDark={isDark} />} />
            <Route path="/help/contact" element={<ContactUs isDark={isDark} />} />
          </Routes>
          </React.Suspense>
        </main>
        <RouterAwareShell isDark={isDark}>
        <Footer />
        </RouterAwareShell>
      </div>
    </Router>
  )
}

function RouterAwareShell({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isChapterReader = /\/year\/.+\/subject\/.+\/chapters(\/.*)?$/.test(location.pathname)
  if (isAdmin || isChapterReader) return null
  return children
}