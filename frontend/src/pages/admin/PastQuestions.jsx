import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PastQuestions({ isDark }) {
  const [pastQuestions, setPastQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subjectCode: '',
    yearSlug: 'first',
    examYear: '',
    description: '',
    questionContent: '',
    published: true
  })
  const [images, setImages] = useState([])
  const [questions, setQuestions] = useState([])
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])


  const yearOptions = [
    { value: 'first', label: 'First Year' },
    { value: 'second', label: 'Second Year' },
    { value: 'third', label: 'Third Year' },
    { value: 'fourth', label: 'Fourth Year' }
  ]

  useEffect(() => {
    loadPastQuestions()
    loadSubjects()
  }, [])

  const loadPastQuestions = async () => {
    setLoading(true)
    try {
      // Use public endpoint for listing (no auth required)
      const response = await fetch(`${API_BASE}/past-questions`)
      const data = await response.json()
      setPastQuestions(data)
    } catch (error) {
      console.error('Error loading past questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjects = async () => {
    try {
      // Load subjects from all years using public API
      const years = ['first', 'second', 'third', 'fourth']
      const allSubjects = []
      
      for (const year of years) {
        try {
          const response = await fetch(`${API_BASE}/years/${year}/subjects`)
          const data = await response.json()
          if (Array.isArray(data)) {
            allSubjects.push(...data)
          }
        } catch (error) {
          console.error(`Error loading subjects for ${year}:`, error)
        }
      }
      
      setSubjects(allSubjects)
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  // Filter subjects by selected year
  const getFilteredSubjects = () => {
    return subjects.filter(subject => subject.yearSlug === formData.yearSlug)
  }

  // Helper functions for managing questions
  const addQuestion = () => {
    setQuestions([...questions, { questionNumber: '', content: '', images: [] }])
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addQuestionImage = (questionIndex, files) => {
    const updatedQuestions = [...questions]
    const newImages = Array.from(files)
    updatedQuestions[questionIndex].images = [...updatedQuestions[questionIndex].images, ...newImages]
    setQuestions(updatedQuestions)
  }

  const removeQuestionImage = (questionIndex, imageIndex) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].images = updatedQuestions[questionIndex].images.filter((_, i) => i !== imageIndex)
    setQuestions(updatedQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.questionContent.trim() && questions.length === 0) {
      alert('Please provide question content or add individual questions')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })
      
      // Add structured questions if available
      if (questions.length > 0) {
        formDataToSend.append('questions', JSON.stringify(questions))
      }
      
      // Add general images
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })
      
      // Add question-specific images
      questions.forEach((question, questionIndex) => {
        question.images.forEach((image, imageIndex) => {
          formDataToSend.append(`images`, image)
        })
      })

      const url = editingId 
        ? `${API_BASE}/past-questions/${editingId}`
        : `${API_BASE}/past-questions`
      
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formDataToSend
      })

      if (response.ok) {
        alert(editingId ? 'Past question updated successfully!' : 'Past question uploaded successfully!')
        setShowForm(false)
        setEditingId(null)
        setFormData({
          title: '',
          subjectCode: '',
          yearSlug: 'first',
          examYear: '',
          description: '',
          questionContent: '',
          published: true
        })
        setImages([])
        setQuestions([])
        loadPastQuestions()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error submitting past question:', error)
      alert('Error uploading past question')
    }
  }

  const handleEdit = (pastQuestion) => {
    setFormData({
      title: pastQuestion.title,
      subjectCode: pastQuestion.subjectCode,
      yearSlug: pastQuestion.yearSlug,
      examYear: pastQuestion.examYear,
      examType: pastQuestion.examType,
      description: pastQuestion.description || '',
      questionContent: pastQuestion.questionContent || '',
      published: pastQuestion.published
    })
    setEditingId(pastQuestion._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this past question?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/past-questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (response.ok) {
        alert('Past question deleted successfully!')
        loadPastQuestions()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting past question:', error)
      alert('Error deleting past question')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Past Questions</h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Upload Past Question
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: isDark ? '#1a1a1a' : '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem' }}>
              {editingId ? 'Edit Past Question' : 'Upload Past Question'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                  placeholder="e.g., Physics Final Exam 2023"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Year *
                </label>
                <select
                  value={formData.yearSlug}
                  onChange={(e) => {
                    setFormData({...formData, yearSlug: e.target.value, subjectCode: ''})
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Subject *
                </label>
                <select
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({...formData, subjectCode: e.target.value})}
                  required
                  disabled={!formData.yearSlug}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem',
                    opacity: !formData.yearSlug ? 0.6 : 1
                  }}
                >
                  <option value="">{formData.yearSlug ? 'Select Subject' : 'Select Year First'}</option>
                  {getFilteredSubjects().map(subject => (
                    <option key={subject._id} value={subject.code}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Exam Year *
                </label>
                <input
                  type="text"
                  value={formData.examYear}
                  onChange={(e) => setFormData({...formData, examYear: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                  placeholder="e.g., 2023, 2022, 2021"
                />
              </div>


              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                  placeholder="Optional description..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Question Content *
                </label>
                <textarea
                  value={formData.questionContent}
                  onChange={(e) => setFormData({...formData, questionContent: e.target.value})}
                  rows="15"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Paste the question paper content here (like hamrocsit format)..."
                />
                <div style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280', marginTop: '4px' }}>
                  Paste the full question paper content here. This will be displayed directly on the website like hamrocsit.com
                </div>
              </div>

              {/* Individual Questions Section */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    Individual Questions (Alternative to bulk content)
                  </label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    style={{
                      padding: '6px 12px',
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    + Add Question
                  </button>
                </div>
                
                {questions.length > 0 && (
                  <div style={{ 
                    background: isDark ? '#1f2937' : '#f9fafb', 
                    borderRadius: '6px', 
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    {questions.map((question, index) => (
                      <div key={index} style={{ 
                        marginBottom: '16px', 
                        padding: '12px', 
                        background: isDark ? '#111827' : '#ffffff',
                        borderRadius: '4px',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                            Question {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            style={{
                              padding: '4px 8px',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Question Number (e.g., 10, 11, 12)"
                            value={question.questionNumber}
                            onChange={(e) => updateQuestion(index, 'questionNumber', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                              borderRadius: '4px',
                              background: isDark ? '#111827' : '#ffffff',
                              color: isDark ? '#f9fafb' : '#111827',
                              fontSize: '0.8rem',
                              marginBottom: '8px'
                            }}
                          />
                          <textarea
                            placeholder="Question content..."
                            value={question.content}
                            onChange={(e) => updateQuestion(index, 'content', e.target.value)}
                            rows="3"
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                              borderRadius: '4px',
                              background: isDark ? '#111827' : '#ffffff',
                              color: isDark ? '#f9fafb' : '#111827',
                              fontSize: '0.8rem',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                            Images for this question:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => addQuestionImage(index, e.target.files)}
                            style={{
                              width: '100%',
                              padding: '4px 6px',
                              border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                              borderRadius: '4px',
                              background: isDark ? '#111827' : '#ffffff',
                              color: isDark ? '#f9fafb' : '#111827',
                              fontSize: '0.8rem'
                            }}
                          />
                          {question.images.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              <div style={{ fontSize: '0.7rem', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>
                                Images ({question.images.length}):
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {question.images.map((img, imgIndex) => (
                                  <div key={imgIndex} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '2px 6px',
                                    background: isDark ? '#374151' : '#e5e7eb',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem'
                                  }}>
                                    <span style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                                      {img.name.length > 15 ? img.name.substring(0, 15) + '...' : img.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeQuestionImage(index, imgIndex)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#dc2626',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem'
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                  General Question Images (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '0.9rem'
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280', marginTop: '4px' }}>
                  Upload general images that apply to the entire question paper (cover page, instructions, etc.)
                  <br />
                  <strong>Note:</strong> For question-specific images, use the individual question sections above.
                </div>
                {images.length > 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', background: isDark ? '#1f2937' : '#f3f4f6', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                      Selected images ({images.length}):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                      {images.map((img, index) => (
                        <div key={index} style={{ 
                          border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                          borderRadius: '4px',
                          padding: '8px',
                          background: isDark ? '#111827' : '#ffffff',
                          textAlign: 'center'
                        }}>
                          <div style={{ 
                            fontSize: '0.7rem', 
                            color: isDark ? '#d1d5db' : '#6b7280',
                            marginBottom: '4px',
                            fontWeight: '500'
                          }}>
                            Image {index + 1}
                          </div>
                          <div style={{ 
                            fontSize: '0.6rem', 
                            color: isDark ? '#9ca3af' : '#9ca3af',
                            wordBreak: 'break-all'
                          }}>
                            {img.name.length > 15 ? img.name.substring(0, 15) + '...' : img.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  />
                  Published
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      title: '',
                      subjectCode: '',
                      yearSlug: '',
                      examYear: '',
                      description: '',
                      questionContent: '',
                      published: true
                    })
                    setImages([])
                    setQuestions([])
                  }}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: 'transparent',
                    color: isDark ? '#f9fafb' : '#111827',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {editingId ? 'Update' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading past questions...</div>
        </div>
      ) : (
        <div style={{
          background: isDark ? '#1a1a1a' : '#ffffff',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          overflow: 'hidden'
        }}>
          {pastQuestions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
              No past questions uploaded yet.
            </div>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: isDark ? '#111827' : '#f9fafb', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Subject</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Year</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Exam Year</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Downloads</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastQuestions.map((pastQuestion) => (
                    <tr key={pastQuestion._id} style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: '500' }}>{pastQuestion.title}</div>
                        {pastQuestion.description && (
                          <div style={{ fontSize: '0.8rem', color: isDark ? '#9ca3af' : '#6b7280', marginTop: '2px' }}>
                            {pastQuestion.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{pastQuestion.subjectCode}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem', textTransform: 'capitalize' }}>{pastQuestion.yearSlug}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{pastQuestion.examYear}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem', textTransform: 'capitalize' }}>{pastQuestion.examType}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{pastQuestion.downloadCount || 0}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          background: pastQuestion.published ? '#dcfce7' : '#fef3c7',
                          color: pastQuestion.published ? '#166534' : '#92400e'
                        }}>
                          {pastQuestion.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a
                            href={pastQuestion.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '4px 8px',
                              background: '#2563eb',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleEdit(pastQuestion)}
                            style={{
                              padding: '4px 8px',
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pastQuestion._id)}
                            style={{
                              padding: '4px 8px',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
