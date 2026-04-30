import express from 'express';
import auth, { requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { adminLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { createUserSchema, updateUserSchema, createPostSchema, updatePostSchema } from '../validation/schemas.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Setting from '../models/Setting.js';
import Material from '../models/Material.js';
import CatalogSubject from '../models/CatalogSubject.js';
import Unit from '../models/Unit.js';
import Chapter from '../models/Chapter.js';

const router = express.Router();

// All routes protected and admin-only
router.use(auth, requireRole(['admin']));
router.use(adminLimiter);

// Require X-Requested-With for state-changing requests as a simple CSRF-like signal
const requireAjaxHeader = (req, res, next) => {
  if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    const h = req.get('X-Requested-With');
    if (h !== 'XMLHttpRequest') return res.status(400).json({ message: 'Missing X-Requested-With' });
  }
  next();
}
router.use(requireAjaxHeader)

// Stats
router.get('/stats', asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();
  const materials = await (await import('../models/Material.js')).default.countDocuments();
  const chapters = await Chapter.countDocuments();
  res.json({ users, posts, materials, chapters });
}));

// Users CRUD
router.get('/users', asyncHandler(async (req, res) => {
  const list = await User.find().select('-password');
  res.json(list);
}));

router.post('/users', validate(createUserSchema), asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already in use', 400);
  
  const bcrypt = (await import('bcryptjs')).default;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed, role: role || 'viewer' });
  
  res.status(201).json({ 
    message: 'User created successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

router.put('/users/:id', validate(updateUserSchema), asyncHandler(async (req, res) => {
  const { name, role } = req.body;
  const update = {};
  if (name) update.name = name;
  if (role) update.role = role;
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  
  res.json({
    message: 'User updated successfully',
    user
  });
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  
  res.json({ message: 'User deleted successfully' });
}));

// Posts CRUD
router.get('/posts', asyncHandler(async (req, res) => {
  const list = await Post.find().sort({ createdAt: -1 })
  res.json(list)
}))

router.post('/posts', validate(createPostSchema), asyncHandler(async (req, res) => {
  const { title, description, imageUrl, published } = req.body
  const post = await Post.create({ title, description, imageUrl, published: !!published, authorId: req.user?.id })
  res.status(201).json({ message: 'Post created successfully', post })
}))

router.put('/posts/:id', validate(updatePostSchema), asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  if (!post) throw new AppError('Post not found', 404)
  res.json({ message: 'Post updated successfully', post })
}))

router.delete('/posts/:id', asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id)
  if (!post) throw new AppError('Post not found', 404)
  res.json({ message: 'Post deleted successfully' })
}))

// Settings: get single settings doc (create if missing) and update
router.get('/settings', asyncHandler(async (req, res) => {
  let settings = await Setting.findOne()
  if (!settings) settings = await Setting.create({})
  res.json(settings)
}))

router.put('/settings', asyncHandler(async (req, res) => {
  const update = req.body || {}
  const settings = await Setting.findOneAndUpdate({}, update, { new: true, upsert: true })
  res.json({ message: 'Settings updated successfully', settings })
}))

// Materials CRUD (admin)
router.get('/materials', asyncHandler(async (req, res) => {
  const list = await Material.find().sort({ createdAt: -1 })
  res.json(list)
}))

router.post('/materials', asyncHandler(async (req, res) => {
  const { title, url, subjectCode, yearSlug, type, published } = req.body
  if (!title || !url || !subjectCode || !yearSlug) throw new AppError('Missing required fields', 400)
  const mat = await Material.create({ title, url, subjectCode: subjectCode.toUpperCase(), yearSlug, type: type || 'pdf', published: published !== false })
  res.status(201).json({ message: 'Material created successfully', material: mat })
}))

router.put('/materials/:id', asyncHandler(async (req, res) => {
  const mat = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!mat) throw new AppError('Material not found', 404)
  res.json({ message: 'Material updated successfully', material: mat })
}))

router.delete('/materials/:id', asyncHandler(async (req, res) => {
  const mat = await Material.findByIdAndDelete(req.params.id)
  if (!mat) throw new AppError('Material not found', 404)
  res.json({ message: 'Material deleted successfully' })
}))

// Catalog Subjects (admin) - manage year/subjects listing shown to users
router.get('/catalog/subjects', asyncHandler(async (req, res) => {
  const list = await CatalogSubject.find().sort({ yearSlug: 1, code: 1 })
  res.json(list)
}))

router.post('/catalog/subjects', asyncHandler(async (req, res) => {
  const { code, name, description, yearSlug, chapters } = req.body
  if (!code || !name || !yearSlug) throw new AppError('Missing required fields', 400)
  const s = await CatalogSubject.create({ code: code.toUpperCase(), name, description, yearSlug, chapters: chapters || 0 })
  res.status(201).json({ message: 'Subject created successfully', subject: s })
}))

router.put('/catalog/subjects/:id', asyncHandler(async (req, res) => {
  const s = await CatalogSubject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!s) throw new AppError('Subject not found', 404)
  res.json({ message: 'Subject updated successfully', subject: s })
}))

router.delete('/catalog/subjects/:id', asyncHandler(async (req, res) => {
  const s = await CatalogSubject.findByIdAndDelete(req.params.id)
  if (!s) throw new AppError('Subject not found', 404)
  res.json({ message: 'Subject deleted successfully' })
}))

// Units CRUD (admin)
router.get('/units', asyncHandler(async (req, res) => {
  const { yearSlug, subjectCode } = req.query
  const q = {}
  if (yearSlug) q.yearSlug = yearSlug
  if (subjectCode) q.subjectCode = subjectCode
  const list = await Unit.find(q).sort({ subjectCode: 1, unitCode: 1 })
  res.json(list)
}))

router.post('/units', asyncHandler(async (req, res) => {
  const unit = await Unit.create(req.body)
  res.status(201).json({ message: 'Unit created successfully', unit })
}))

router.put('/units/:id', asyncHandler(async (req, res) => {
  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!unit) throw new AppError('Unit not found', 404)
  res.json({ message: 'Unit updated successfully', unit })
}))

router.delete('/units/:id', asyncHandler(async (req, res) => {
  const unit = await Unit.findByIdAndDelete(req.params.id)
  if (!unit) throw new AppError('Unit not found', 404)
  res.json({ message: 'Unit deleted successfully' })
}))

// Chapters CRUD (admin)
router.get('/chapters', asyncHandler(async (req, res) => {
  const { yearSlug, subjectCode, unitId } = req.query;
  let query = {};
  
  if (yearSlug) query.yearSlug = yearSlug;
  if (subjectCode) query.subjectCode = subjectCode;
  if (unitId) query.unitId = unitId;
  
  const list = await Chapter.find(query)
    .populate('subjectId', 'name code')
    .populate('unitId', 'unitName unitCode')
    .sort({ order: 1, createdAt: 1 });
  res.json(list);
}))

router.post('/chapters', asyncHandler(async (req, res) => {
  const { title, description, subjectId, unitId, yearSlug, subjectCode, topics, resources, difficulty, estimatedTime, tags, order } = req.body;
  
  if (!title || !description || !subjectId || !yearSlug || !subjectCode) {
    throw new AppError('Missing required fields', 400);
  }
  
  const chapter = await Chapter.create({
    title,
    description,
    subjectId,
    unitId: unitId || null,
    yearSlug,
    subjectCode: subjectCode.toUpperCase(),
    topics: topics || [],
    resources: resources || [],
    difficulty: difficulty || 'beginner',
    estimatedTime: estimatedTime || 0,
    tags: tags || [],
    order: order || 0
  });
  
  res.status(201).json({ message: 'Chapter created successfully', chapter });
}))

router.put('/chapters/:id', asyncHandler(async (req, res) => {
  const update = { ...req.body }
  // Normalize unitId: allow clearing with empty string
  if (Object.prototype.hasOwnProperty.call(update, 'unitId')) {
    if (!update.unitId) update.unitId = null
  }
  if (Object.prototype.hasOwnProperty.call(update, 'subjectCode') && update.subjectCode) {
    update.subjectCode = String(update.subjectCode).toUpperCase()
  }
  const chapter = await Chapter.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!chapter) throw new AppError('Chapter not found', 404);
  res.json({ message: 'Chapter updated successfully', chapter });
}))

router.delete('/chapters/:id', asyncHandler(async (req, res) => {
  const chapter = await Chapter.findByIdAndDelete(req.params.id);
  if (!chapter) throw new AppError('Chapter not found', 404);
  res.json({ message: 'Chapter deleted successfully' });
}))

export default router;


