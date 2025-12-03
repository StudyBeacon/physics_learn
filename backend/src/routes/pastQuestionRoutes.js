import express from 'express'
import multer from 'multer'
import auth, { requireRole } from '../middleware/authMiddleware.js'
import { 
  listPastQuestions, 
  getPastQuestion, 
  createPastQuestion, 
  updatePastQuestion, 
  deletePastQuestion,
  getPastQuestionsBySubject 
} from '../controllers/pastQuestionController.js'

const router = express.Router()
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
})

// Public routes
router.get('/', listPastQuestions)
router.get('/:id', getPastQuestion)
router.get('/subject/:subjectCode/:yearSlug', getPastQuestionsBySubject)

// Admin-only routes
router.use(auth, requireRole(['admin']))

// Require AJAX header for admin operations
const requireAjaxHeader = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const h = req.get('X-Requested-With')
    if (h !== 'XMLHttpRequest') {
      return res.status(400).json({ message: 'Missing X-Requested-With header' })
    }
  }
  next()
}
router.use(requireAjaxHeader)

router.post('/', upload.fields([{ name: 'images', maxCount: 10 }]), createPastQuestion)
router.put('/:id', upload.fields([{ name: 'images', maxCount: 10 }]), updatePastQuestion)
router.delete('/:id', deletePastQuestion)

export default router
