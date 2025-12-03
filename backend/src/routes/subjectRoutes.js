import express from 'express';
import Material from '../models/Material.js'
import Unit from '../models/Unit.js'
import Chapter from '../models/Chapter.js'
import CatalogSubject from '../models/CatalogSubject.js'
import { createSubject, getSubject } from '../controllers/subjectController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createSubject);
router.get('/:id', getSubject);

export default router;

// Public: list materials by year + subject code
router.get('/:yearSlug/:subjectCode/materials', async (req, res) => {
  const { yearSlug, subjectCode } = req.params
  const list = await Material.find({ yearSlug, subjectCode: subjectCode.toUpperCase(), published: true }).sort({ createdAt: -1 })
  res.json(list)
})

// Public: list units for a subject
router.get('/:yearSlug/:subjectCode/units', async (req, res) => {
  const { yearSlug, subjectCode } = req.params
  const list = await Unit.find({ yearSlug, subjectCode: subjectCode.toUpperCase() }).sort({ unitCode: 1 })
  res.json(list)
})

// Public: list chapters for a subject
router.get('/:yearSlug/:subjectCode/chapters', async (req, res) => {
  const { yearSlug, subjectCode } = req.params
  const { unitId } = req.query
  
  let query = { yearSlug, subjectCode: subjectCode.toUpperCase(), published: true }
  if (unitId) query.unitId = unitId
  
  const list = await Chapter.find(query)
    .populate('unitId', 'unitName unitCode')
    .sort({ order: 1, createdAt: 1 })
  res.json(list)
})

// Public: get single chapter
router.get('/:yearSlug/:subjectCode/chapters/:chapterId', async (req, res) => {
  const { chapterId } = req.params
  const chapter = await Chapter.findById(chapterId)
    .populate('subjectId', 'name code')
    .populate('unitId', 'unitName unitCode')
  
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' })
  res.json(chapter)
})

// Public: get subject info by year and subject code
router.get('/:yearSlug/:subjectCode/info', async (req, res) => {
  const { yearSlug, subjectCode } = req.params
  
  const subject = await CatalogSubject.findOne({ 
    yearSlug, 
    code: subjectCode.toUpperCase() 
  })
  
  if (!subject) return res.status(404).json({ message: 'Subject not found' })
  res.json(subject)
})