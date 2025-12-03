import PastQuestion from '../models/PastQuestion.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to parse question content into individual questions
const parseQuestions = (questionContent) => {
  if (!questionContent) return []
  
  const lines = questionContent.split('\n').map(line => line.trim()).filter(line => line)
  const questions = []
  let currentQuestion = null
  
  for (const line of lines) {
    // Check if line starts with a number (question number)
    const questionMatch = line.match(/^(\d+)\s*(.*)$/)
    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion) {
        questions.push(currentQuestion)
      }
      // Start new question
      currentQuestion = {
        questionNumber: questionMatch[1],
        content: questionMatch[2] || '',
        images: []
      }
    } else if (currentQuestion) {
      // Add content to current question
      currentQuestion.content += (currentQuestion.content ? '\n' : '') + line
    }
  }
  
  // Add the last question
  if (currentQuestion) {
    questions.push(currentQuestion)
  }
  
  return questions
}

// Get all past questions (public)
export const listPastQuestions = async (req, res) => {
  try {
    const { subjectCode, yearSlug, examYear, examType } = req.query
    const filter = { published: true }
    
    if (subjectCode) filter.subjectCode = subjectCode.toUpperCase()
    if (yearSlug) filter.yearSlug = yearSlug
    if (examYear) filter.examYear = examYear
    if (examType) filter.examType = examType
    
    const pastQuestions = await PastQuestion.find(filter)
      .sort({ examYear: -1, createdAt: -1 })
      .select('-publicId')
    
    res.json(pastQuestions)
  } catch (error) {
    console.error('Error listing past questions:', error)
    res.status(500).json({ message: 'Failed to fetch past questions' })
  }
}

// Get single past question (public)
export const getPastQuestion = async (req, res) => {
  try {
    const pastQuestion = await PastQuestion.findById(req.params.id)
      .select('-publicId')
    
    if (!pastQuestion) {
      return res.status(404).json({ message: 'Past question not found' })
    }
    
    // Increment download count
    await PastQuestion.findByIdAndUpdate(req.params.id, { 
      $inc: { downloadCount: 1 } 
    })
    
    res.json(pastQuestion)
  } catch (error) {
    console.error('Error getting past question:', error)
    res.status(500).json({ message: 'Failed to fetch past question' })
  }
}

// Create past question (admin only)
export const createPastQuestion = async (req, res) => {
  try {
    const { title, subjectCode, yearSlug, examYear, description, questionContent, published, questions } = req.body
    const uploadedImages = []
    
    if (!title || !subjectCode || !yearSlug || !examYear) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    if (!req.body.questionContent && (!questions || questions.length === 0)) {
      return res.status(400).json({ message: 'Question content is required' })
    }
    
    let uploaded
    if (req.file) {
      try {
        // Try Cloudinary first
        uploaded = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'raw',
              folder: 'past-questions',
              timeout: 30000
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
        const uploadsDir = path.join(__dirname, '../../uploads/past-questions')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const filename = `past-question-${Date.now()}-${req.file.originalname}`
        const filepath = path.join(uploadsDir, filename)
        fs.writeFileSync(filepath, req.file.buffer)
        
        uploaded = {
          secure_url: `http://localhost:5000/uploads/past-questions/${filename}`,
          public_id: `local-${filename}`
        }
      }
    } else if (req.body.pdfUrl) {
      uploaded = { 
        secure_url: req.body.pdfUrl, 
        public_id: req.body.publicId || '' 
      }
    } else {
      // No PDF file, just question content
      uploaded = { 
        secure_url: '', 
        public_id: '' 
      }
    }
    
    // Parse questions from content
    let parsedQuestions = []
    if (questions && Array.isArray(questions)) {
      // If questions are provided as structured data
      parsedQuestions = questions
    } else if (questionContent) {
      // Parse from question content text
      parsedQuestions = parseQuestions(questionContent)
    }
    
    // Handle image uploads and map them to questions
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
      
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        try {
          // Try Cloudinary first
          const uploaded = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'past-questions-images',
                timeout: 30000
              },
              (error, result) => {
                if (error) return reject(error)
                resolve(result)
              }
            )
            uploadStream.end(imageFile.buffer)
          })
          
          const imageData = {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
            caption: '',
            order: i
          }
          
          uploadedImages.push(imageData)
          
          // Try to map image to a specific question based on filename or order
          const questionIndex = Math.min(i, parsedQuestions.length - 1)
          if (parsedQuestions[questionIndex]) {
            parsedQuestions[questionIndex].images.push(imageData)
          }
        } catch (error) {
          console.error('Cloudinary image upload failed, using local storage:', error.message)
          // Fallback to local storage
          const uploadsDir = path.join(__dirname, '../../uploads/past-questions-images')
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
          }
          
          const filename = `image-${Date.now()}-${i}-${imageFile.originalname}`
          const filepath = path.join(uploadsDir, filename)
          fs.writeFileSync(filepath, imageFile.buffer)
          
          const imageData = {
            url: `http://localhost:5000/uploads/past-questions-images/${filename}`,
            publicId: `local-${filename}`,
            caption: '',
            order: i
          }
          
          uploadedImages.push(imageData)
          
          // Try to map image to a specific question based on filename or order
          const questionIndex = Math.min(i, parsedQuestions.length - 1)
          if (parsedQuestions[questionIndex]) {
            parsedQuestions[questionIndex].images.push(imageData)
          }
        }
      }
    }
    
    const pastQuestion = await PastQuestion.create({
      title,
      subjectCode: subjectCode.toUpperCase(),
      yearSlug,
      examYear,
      examType: 'final', // Default to final since we removed the field
      description: description || '',
      questionContent: questionContent || '',
      questions: parsedQuestions,
      pdfUrl: uploaded?.secure_url || '',
      publicId: uploaded?.public_id || '',
      fileSize: req.file?.size || 0,
      images: uploadedImages,
      published: published !== false
    })
    
    res.status(201).json(pastQuestion)
  } catch (error) {
    console.error('Error creating past question:', error)
    res.status(500).json({ 
      message: 'Failed to create past question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Update past question (admin only)
export const updatePastQuestion = async (req, res) => {
  try {
    const update = { ...req.body }
    
    if (req.file) {
      try {
        // Try Cloudinary first
        const uploaded = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'raw',
              folder: 'past-questions',
              timeout: 30000
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
        update.fileSize = req.file.size
      } catch (error) {
        console.error('Cloudinary upload failed, using local storage:', error.message)
        // Fallback to local storage
        const uploadsDir = path.join(__dirname, '../../uploads/past-questions')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const filename = `past-question-${Date.now()}-${req.file.originalname}`
        const filepath = path.join(uploadsDir, filename)
        fs.writeFileSync(filepath, req.file.buffer)
        
        update.pdfUrl = `http://localhost:5000/uploads/past-questions/${filename}`
        update.publicId = `local-${filename}`
        update.fileSize = req.file.size
      }
    }
    
    if (update.subjectCode) {
      update.subjectCode = update.subjectCode.toUpperCase()
    }
    
    const pastQuestion = await PastQuestion.findByIdAndUpdate(
      req.params.id, 
      update, 
      { new: true }
    )
    
    if (!pastQuestion) {
      return res.status(404).json({ message: 'Past question not found' })
    }
    
    res.json(pastQuestion)
  } catch (error) {
    console.error('Error updating past question:', error)
    res.status(500).json({ message: 'Failed to update past question' })
  }
}

// Delete past question (admin only)
export const deletePastQuestion = async (req, res) => {
  try {
    const pastQuestion = await PastQuestion.findById(req.params.id)
    if (!pastQuestion) {
      return res.status(404).json({ message: 'Past question not found' })
    }
    
    // Delete from Cloudinary if not a local file
    if (pastQuestion.publicId && !pastQuestion.publicId.startsWith('local-')) {
      try {
        await cloudinary.uploader.destroy(pastQuestion.publicId, { resource_type: 'raw' })
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        // Continue with database deletion even if Cloudinary fails
      }
    } else if (pastQuestion.publicId && pastQuestion.publicId.startsWith('local-')) {
      // Delete local file
      const filename = pastQuestion.publicId.substring(6) // Remove 'local-' prefix
      const filepath = path.join(__dirname, '../../uploads/past-questions', filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    }
    
    await PastQuestion.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (error) {
    console.error('Error deleting past question:', error)
    res.status(500).json({ message: 'Failed to delete past question' })
  }
}

// Get past questions by subject and year (for admin listing)
export const getPastQuestionsBySubject = async (req, res) => {
  try {
    const { subjectCode, yearSlug } = req.params
    const pastQuestions = await PastQuestion.find({
      subjectCode: subjectCode.toUpperCase(),
      yearSlug
    }).sort({ examYear: -1, createdAt: -1 })
    
    res.json(pastQuestions)
  } catch (error) {
    console.error('Error getting past questions by subject:', error)
    res.status(500).json({ message: 'Failed to fetch past questions' })
  }
}
