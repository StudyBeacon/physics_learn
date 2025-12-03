import React from 'react'

// Try to use react-pdf if available; otherwise, fall back to iframe
let ReactPDF = null
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  // Lazy require to avoid crash if the package isn't installed
  // This will be bundled only if dependency exists
  // eslint-disable-next-line global-require
  ReactPDF = require('react-pdf')
  // eslint-disable-next-line global-require
  const pdfjs = require('react-pdf').pdfjs
  // Use CDN worker as a safe default
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
} catch (e) {
  ReactPDF = null
}

export default function PdfViewer({ url, isDark }) {
  const [scale, setScale] = React.useState(1.1)
  const [numPages, setNumPages] = React.useState(null)

  if (!url || url === null || url === undefined || url.trim() === '') {
    return null
  }

  if (!ReactPDF) {
    // Fallback: Use PDF.js viewer like hamrocsit.com
    const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`
    return (
      <div style={{ width: '100%', height: '100%', background: isDark ? '#0b1220' : '#ffffff' }}>
        <iframe 
          src={pdfJsUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="PDF Viewer"
          onError={(e) => console.error('PDF.js viewer error:', e)}
        />
      </div>
    )
  }

  const { Document, Page } = ReactPDF

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', padding: '6px 10px', borderBottom: isDark ? '1px solid #1f2937' : '1px solid #e5e7eb' }}>
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} style={btnStyle(isDark)}>-</button>
        <div style={{ minWidth: 56, textAlign: 'center', opacity: .8 }}>{Math.round(scale * 100)}%</div>
        <button onClick={() => setScale(s => Math.min(3, s + 0.1))} style={btnStyle(isDark)}>+</button>
        <a href={url} target="_blank" rel="noreferrer" style={{ ...btnStyle(isDark), textDecoration: 'none' }}>Download</a>
      </div>
      {/* Scrollable PDF */}
      <div style={{ flex: 1, overflow: 'auto', background: isDark ? '#0b1220' : '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Document 
            file={url} 
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n)
            }} 
            onLoadError={(error) => {
              console.error('PDF load error:', error)
            }}
            loading={<div style={{ opacity: .7 }}>Loading PDF…</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} width={Math.min(1200, Math.floor(window.innerWidth * 0.9))} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}

function btnStyle(isDark) {
  return {
    border: isDark ? '1px solid #1f2937' : '1px solid #cbd5e1',
    background: 'transparent',
    color: isDark ? '#e5e7eb' : '#111827',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer'
  }
}


