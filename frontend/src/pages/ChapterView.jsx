import React from 'react'
import { useParams } from 'react-router-dom'

export default function ChapterView({ isDark }) {
  const { chapterId } = useParams()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [chapter, setChapter] = React.useState(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/materials`) // reuse list then filter (public endpoint not needed now)
        const data = await res.json()
        const found = Array.isArray(data) ? data.find(m => m._id === chapterId) : null
        setChapter(found || null)
      } catch (e) {
        setChapter(null)
      }
    })()
  }, [API_BASE, chapterId])

  if (!chapter) return <div style={{ padding: '2rem', color: isDark ? '#e5e7eb' : '#111827' }}>Loading…</div>

  return (
    <div style={{ padding: '2rem', minHeight: '70vh', background: isDark ? '#0b1220' : '#f8fafc' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ color: isDark ? '#e5e7eb' : '#111827' }}>{chapter.title}</h1>
        <div style={{ marginTop: 16 }}>
          <iframe title="chapter-pdf" src={chapter.url} style={{ width: '100%', height: '80vh', border: '1px solid #e5e7eb', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  )
}


