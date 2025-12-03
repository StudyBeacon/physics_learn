import React from 'react'
import PdfViewer from '../components/PdfViewer.jsx'
import { useParams, useNavigate } from 'react-router-dom'

export default function ChapterDetail({ isDark }) {
  const { yearSlug, subjectSlug, chapterId } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('study')
  const [isMobile, setIsMobile] = React.useState(false)
  const role = typeof window !== 'undefined' ? (window.localStorage.getItem('role') || 'viewer') : 'viewer'
  const [focusMode, setFocusMode] = React.useState(false)
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [chaptersList, setChaptersList] = React.useState([])
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [bookmarked, setBookmarked] = React.useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const raw = window.localStorage.getItem('bookmarks_chapters')
      const arr = raw ? JSON.parse(raw) : []
      return arr.includes(chapterId)
    } catch { return false }
  })
  const [fallbackPdfUrl, setFallbackPdfUrl] = React.useState(null)
  const [notePdfUrl, setNotePdfUrl] = React.useState(null)
  const [lastChapterId, setLastChapterId] = React.useState(null)
  const [pdfBlob, setPdfBlob] = React.useState(null)
  
  // Function to convert PDF URL to blob URL to prevent downloads
  const convertToBlobUrl = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      return blobUrl
    } catch (error) {
      console.error('Failed to convert to blob URL:', error)
      return url // Fallback to original URL
    }
  }
  
  // Debug: log when notePdfUrl changes
  React.useEffect(() => {
  }, [notePdfUrl])
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const loadChapter = async () => {
    setLoading(true)
    try {
      if (!chapterId) {
        // Fetch list and redirect to first chapter if available
        const listRes = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/chapters`)
        const list = await listRes.json()
        if (Array.isArray(list) && list.length) {
          navigate(`/year/${yearSlug}/subject/${subjectSlug}/chapters/${list[0]._id}`, { replace: true })
          return
        } else {
          setChapter(null)
          setLoading(false)
          return
        }
      } else {
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/chapters/${chapterId}`)
        const data = await res.json()
        setChapter(data)
      }
    } catch (error) {
      console.error('Failed to load chapter:', error)
    }
    setLoading(false)
  }

  React.useEffect(() => { loadChapter() }, [yearSlug, subjectSlug, chapterId, API_BASE])
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/chapters`)
        const data = await res.json()
        setChaptersList(Array.isArray(data) ? data : [])
      } catch { setChaptersList([]) }
    })()
  }, [API_BASE, yearSlug, subjectSlug])

  // Prefer Chapter Notes PDF, then fallback to materials
  React.useEffect(() => {
    (async () => {
      try {
        if (!chapter) return
        
        
        // Check if this is the same chapter (prevent unnecessary re-renders)
        if (lastChapterId === chapter._id) {
          return
        }
        
        // Clear PDF state immediately when changing chapters
        // Clean up previous blob URL
        if (notePdfUrl && notePdfUrl.startsWith('blob:')) {
          URL.revokeObjectURL(notePdfUrl)
        }
        setNotePdfUrl(null)
        setFallbackPdfUrl(null)
        setLastChapterId(chapter._id)
        
        // Small delay to ensure state is cleared
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Load chapter notes for this specific chapter
        try {
          const nres = await fetch(`${API_BASE}/chapter-notes?chapterId=${chapter._id}&yearSlug=${yearSlug}&subjectCode=${subjectSlug}`)
          const nlist = await nres.json()
          if (Array.isArray(nlist) && nlist.length && nlist[0].pdfUrl) {
            setNotePdfUrl(nlist[0].pdfUrl)
            return
          } else {
            // Explicitly set to null to ensure no PDF is shown
            setNotePdfUrl(null)
          }
        } catch (e) {
          console.error('Failed to load chapter notes:', e)
          setNotePdfUrl(null)
        }
        
        // Only load fallback materials if no chapter notes found
        const res = await fetch(`${API_BASE}/subjects/${yearSlug}/${subjectSlug}/materials`)
        const list = await res.json()
        if (Array.isArray(list) && list.length) {
          const pdfItem = list.find(m => (m.category === 'chapter') && (m.url && m.url.toLowerCase().endsWith('.pdf')) && (m.title?.toLowerCase().includes((chapter.title||'').toLowerCase()) || true))
          if (pdfItem?.url) {
            setFallbackPdfUrl(pdfItem.url)
          } else {
            setFallbackPdfUrl(null)
          }
        } else {
          setFallbackPdfUrl(null)
        }
      } catch {
        console.error('Error in chapter effect')
        setNotePdfUrl(null)
        setFallbackPdfUrl(null)
      }
    })()
  }, [API_BASE, yearSlug, subjectSlug, chapter])

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Clear PDF state when component unmounts
  React.useEffect(() => {
    return () => {
      setNotePdfUrl(null)
      setFallbackPdfUrl(null)
    }
  }, [])

  React.useEffect(() => {
    const el = document.getElementById('reader-scroll')
    if (!el) return
    const onScroll = () => {
      const h = el.scrollHeight - el.clientHeight
      const p = h > 0 ? (el.scrollTop / h) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, p)))
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [activeTab, chapter])

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'f' || e.key === 'F')) setFocusMode(v=>!v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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

  const getResourceIcon = (type) => null

  if (loading) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center', 
        color: isDark ? '#9ca3af' : '#6b7280',
        fontSize: '1.1rem'
      }}>
        Loading chapter...
      </div>
    )
  }

  if (!chapter) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center', 
        color: isDark ? '#9ca3af' : '#6b7280'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Chapter not found</h3>
        <p style={{ margin: 0, fontSize: '1rem' }}>
          The chapter you're looking for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: isDark ? '#0b1220' : '#f8fafc', color: isDark ? '#e5e7eb' : '#111827', display: 'grid', gridTemplateColumns: isMobile || focusMode ? '1fr' : '320px 1fr' }}>
      {/* Left: Chapters only */}
      {!focusMode && (
      <aside style={{ height: '100vh', overflow: 'auto', borderRight: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb', padding: '1rem', background: isDark ? '#121212' : '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Chapters</div>
          {/* Back moved to header for better discoverability */}
        </div>
        {Array.isArray(chaptersList) && chaptersList.length ? (
          chaptersList.map(ch => (
            <button key={ch._id} onClick={()=>navigate(`/year/${yearSlug}/subject/${subjectSlug}/chapters/${ch._id}`)} style={{
              width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: 'inherit', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 6, borderLeft: ch._id===chapterId ? `3px solid ${isDark ? '#3b82f6' : '#2563eb'}` : '3px solid transparent', fontWeight: ch._id===chapterId ? 600 : 500
            }}>
              <div style={{ fontWeight: 600 }}>{ch.title}</div>
              {Array.isArray(ch.topics) && ch.topics.length ? (
                <div style={{ fontSize: 12, opacity: .7, marginTop: 2 }}>{ch.topics.slice(0,3).join(', ')}{ch.topics.length>3?` +${ch.topics.length-3}`:''}</div>
              ) : null}
            </button>
          ))
        ) : (
          <div style={{ opacity: .7 }}>No chapters yet.</div>
        )}
      </aside>
      )}

      {/* Right: Full-screen study area */}
      <main style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 14px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: isDark ? '#0b1220' : '#ffffff', zIndex: 10 }}>
          {/* Back button - left, prominent */}
          <button onClick={()=>history.back()} aria-label="Back" title="Back"
            style={{ width: 36, height: 36, borderRadius: 8, border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s ease' }}
            onMouseEnter={(e)=>{ e.currentTarget.style.background = isDark ? '#0f172a' : '#f1f5f9' }}
            onMouseLeave={(e)=>{ e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke={isDark ? '#e5e7eb' : '#111827'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div style={{ fontWeight: 700, fontSize: 18, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chapter.title}</div>

          {/* Focus toggle - icon button like YouTube */}
          <button onClick={()=>setFocusMode(v=>!v)} aria-pressed={focusMode} aria-label="Focus mode" title="Focus (F)"
            style={{ width: 36, height: 36, borderRadius: 9999, border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1', background: focusMode ? (isDark ? '#2563eb' : '#2563eb') : 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s ease' }}
            onMouseEnter={(e)=>{ if(!focusMode){ e.currentTarget.style.background = isDark ? '#0f172a' : '#f1f5f9' }}}
            onMouseLeave={(e)=>{ if(!focusMode){ e.currentTarget.style.background = 'transparent' }}}
          >
            {/* Simple theater-mode icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="7" width="18" height="10" rx="2" ry="2" fill="none" stroke={focusMode ? '#ffffff' : (isDark ? '#e5e7eb' : '#111827')} strokeWidth="2"/>
              <rect x="6" y="9" width="12" height="6" rx="1" ry="1" fill={focusMode ? '#ffffff' : 'none'} stroke={focusMode ? '#ffffff' : 'none'}/>
            </svg>
          </button>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, width: '100%', background: isDark ? '#111827' : '#f3f4f6' }}>
          <div style={{ width: `${scrollProgress}%`, height: '100%', background: isDark ? '#3b82f6' : '#2563eb', transition: 'width .15s linear' }}></div>
        </div>
        <div id="reader-scroll" style={{ flex: 1, overflow: 'auto', background: isDark ? '#0f172a' : '#ffffff' }}>
          {(() => {
            
            if (chapter.resources && chapter.resources.length) {
              const pdf = chapter.resources.find(r => (r.type==='pdf') || (r.url && r.url.toLowerCase().endsWith('.pdf')))
              if (pdf) {
                return (
                  <div style={{ height: 'calc(100vh - 120px)' }}>
                    <PdfViewer url={pdf.url} isDark={isDark} />
                  </div>
                )
              }
            }
            
            if (notePdfUrl && notePdfUrl.trim() !== '') {
              return (
                <div style={{ height: 'calc(100vh - 120px)', background: '#ffffff' }}>
                  <PdfViewer key={`note-${chapter._id}-${notePdfUrl}`} url={notePdfUrl} isDark={isDark} />
                </div>
              )
            }
            
            if (fallbackPdfUrl && fallbackPdfUrl.trim() !== '') {
              return (
                <div style={{ height: 'calc(100vh - 120px)' }}>
                  <PdfViewer key={`fallback-${fallbackPdfUrl}`} url={fallbackPdfUrl} isDark={isDark} />
                </div>
              )
            }
            
            if (chapter.resources && chapter.resources.length) {
              return (
                <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
                  {chapter.resources.map((r, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.title}</div>
                      <div style={{ fontSize: 14, opacity: .8 }}>{r.description}</div>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, textDecoration: 'none', border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1', padding: '6px 10px', borderRadius: 6, color: 'inherit' }}>Open</a>
                    </div>
                  ))}
                </div>
              )
            }
            
            return (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: .85 }}>
                <div>No study materials available yet.</div>
                {(role === 'admin' || role === 'editor') && (
                  <a href="/admin/materials" style={{ marginTop: 12, textDecoration: 'none', border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1', padding: '6px 10px', borderRadius: 6, color: 'inherit' }}>Upload Material</a>
                )}
              </div>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
