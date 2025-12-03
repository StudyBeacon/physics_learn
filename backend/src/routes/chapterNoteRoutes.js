import express from 'express'
import multer from 'multer'
import auth, { requireRole } from '../middleware/authMiddleware.js'
import { listNotes, getNote, createNote, updateNote, deleteNote } from '../controllers/chapterNoteController.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })

// Public list endpoints (filterable)
router.get('/', listNotes)
router.get('/:id', getNote)

// Admin-only below
router.use(auth, requireRole(['admin']))

const requireAjaxHeader = (req, res, next) => {
  if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    const h = req.get('X-Requested-With')
    if (h !== 'XMLHttpRequest') return res.status(400).json({ message: 'Missing X-Requested-With' })
  }
  next()
}
router.use(requireAjaxHeader)

router.post('/', upload.single('file'), createNote)
router.put('/:id', upload.single('file'), updateNote)
router.delete('/:id', deleteNote)

export default router


