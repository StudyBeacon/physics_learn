import ChapterNote from '../models/ChapterNote.js'
import Chapter from '../models/Chapter.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const listNotes = async (req, res) => {
  const { yearSlug, subjectCode, chapterId } = req.query
  const query = {}
  if (yearSlug) query.yearSlug = yearSlug
  if (subjectCode) query.subjectCode = subjectCode.toUpperCase()
  if (chapterId) query.chapterId = chapterId
  const notes = await ChapterNote.find(query).sort({ createdAt: -1 })
  res.json(notes)
}

export const getNote = async (req, res) => {
  const note = await ChapterNote.findById(req.params.id)
  if (!note) return res.status(404).json({ message: 'Not found' })
  res.json(note)
}

export const createNote = async (req, res) => {
  const { title, subjectCode, yearSlug, chapterId, description, published } = req.body
  if (!title || !subjectCode || !yearSlug || !chapterId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }
  const chapter = await Chapter.findById(chapterId)
  if (!chapter) return res.status(400).json({ message: 'Invalid chapterId' })

  let uploaded
  if (req.file) {
    try {
      // Try Cloudinary first
      uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            resource_type: 'raw', 
            folder: 'chapter-notes',
            timeout: 30000 // 30 seconds timeout
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        uploadStream.end(req.file.buffer)
      })
    } catch (error) {
      console.error('Cloudinary upload failed, using local storage:', error.message)
      // Fallback to local storage
      const uploadsDir = path.join(__dirname, '../../uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const filename = `note-${Date.now()}-${req.file.originalname}`
      const filepath = path.join(uploadsDir, filename)
      fs.writeFileSync(filepath, req.file.buffer)
      
      uploaded = { 
        secure_url: `http://localhost:5000/uploads/${filename}`,
        public_id: `local-${filename}`
      }
    }
  } else if (req.body.pdfUrl) {
    uploaded = { secure_url: req.body.pdfUrl, public_id: req.body.publicId || '' }
  } else {
    return res.status(400).json({ message: 'PDF file is required' })
  }

  const note = await ChapterNote.create({
    title,
    subjectCode: subjectCode.toUpperCase(),
    yearSlug,
    chapterId,
    pdfUrl: uploaded.secure_url,
    publicId: uploaded.public_id || '',
    description: description || '',
    published: published !== false
  })
  res.status(201).json(note)
}

export const updateNote = async (req, res) => {
  const { title, subjectCode, yearSlug, chapterId, description, published } = req.body
  const update = {}
  if (title !== undefined) update.title = title
  if (subjectCode !== undefined) update.subjectCode = subjectCode.toUpperCase()
  if (yearSlug !== undefined) update.yearSlug = yearSlug
  if (chapterId !== undefined) update.chapterId = chapterId
  if (description !== undefined) update.description = description
  if (published !== undefined) update.published = published

  let uploaded
  if (req.file) {
    try {
      // Try Cloudinary first
      uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            resource_type: 'raw', 
            folder: 'chapter-notes',
            timeout: 30000 // 30 seconds timeout
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        uploadStream.end(req.file.buffer)
      })
      update.pdfUrl = uploaded.secure_url
      update.publicId = uploaded.public_id || ''
    } catch (error) {
      console.error('Cloudinary upload failed, using local storage:', error.message)
      // Fallback to local storage
      const uploadsDir = path.join(__dirname, '../../uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const filename = `note-${Date.now()}-${req.file.originalname}`
      const filepath = path.join(uploadsDir, filename)
      fs.writeFileSync(filepath, req.file.buffer)
      
      update.pdfUrl = `http://localhost:5000/uploads/${filename}`
      update.publicId = `local-${filename}`
    }
  }

  const note = await ChapterNote.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!note) return res.status(404).json({ message: 'Not found' })
  res.json(note)
}

export const deleteNote = async (req, res) => {
  try {
    const note = await ChapterNote.findById(req.params.id)
    if (!note) return res.status(404).json({ message: 'Not found' })
    
    if (note.publicId) {
      try {
        await cloudinary.uploader.destroy(note.publicId, { resource_type: 'raw' })
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        // Continue with database deletion even if Cloudinary fails
      }
    }
    
    await ChapterNote.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ message: 'Failed to delete note' })
  }
}


