import express from 'express';
import auth, { requireRole } from '../middleware/authMiddleware.js';
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
router.get('/stats', async (req, res) => {
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();
  const materials = await (await import('../models/Material.js')).default.countDocuments();
  const chapters = await Chapter.countDocuments();
  res.json({ users, posts, materials, chapters });
});

// Users CRUD
router.get('/users', async (req, res) => {
  const list = await User.find().select('-password');
  res.json(list);
});

router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already used' });
  const bcrypt = (await import('bcryptjs')).default;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed, role: role || 'viewer' });
  res.status(201).json({ id: user._id });
});

router.put('/users/:id', async (req, res) => {
  const { name, role } = req.body;
  const update = {};
  if (name) update.name = name;
  if (role) update.role = role;
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Posts CRUD
router.get('/posts', async (req, res) => {
  const list = await Post.find().sort({ createdAt: -1 })
  res.json(list)
})

router.post('/posts', async (req, res) => {
  const { title, description, imageUrl, published } = req.body
  if (!title) return res.status(400).json({ message: 'Title is required' })
  const post = await Post.create({ title, description, imageUrl, published: !!published, authorId: req.user?.id })
  res.status(201).json(post)
})

router.put('/posts/:id', async (req, res) => {
  const { title, description, imageUrl, published } = req.body
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, description, imageUrl, published },
    { new: true }
  )
  if (!post) return res.status(404).json({ message: 'Not found' })
  res.json(post)
})

router.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

// Settings: get single settings doc (create if missing) and update
router.get('/settings', async (req, res) => {
  let settings = await Setting.findOne()
  if (!settings) settings = await Setting.create({})
  res.json(settings)
})

router.put('/settings', async (req, res) => {
  const update = req.body || {}
  const settings = await Setting.findOneAndUpdate({}, update, { new: true, upsert: true })
  res.json(settings)
})

// Materials CRUD (admin)
router.get('/materials', async (req, res) => {
  const list = await Material.find().sort({ createdAt: -1 })
  res.json(list)
})

router.post('/materials', async (req, res) => {
  const { title, url, subjectCode, yearSlug, type, published } = req.body
  if (!title || !url || !subjectCode || !yearSlug) return res.status(400).json({ message: 'Missing fields' })
  const mat = await Material.create({ title, url, subjectCode: subjectCode.toUpperCase(), yearSlug, type: type || 'pdf', published: published !== false })
  res.status(201).json(mat)
})

router.put('/materials/:id', async (req, res) => {
  const mat = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!mat) return res.status(404).json({ message: 'Not found' })
  res.json(mat)
})

router.delete('/materials/:id', async (req, res) => {
  await Material.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

// Catalog Subjects (admin) - manage year/subjects listing shown to users
router.get('/catalog/subjects', async (req, res) => {
  const list = await CatalogSubject.find().sort({ yearSlug: 1, code: 1 })
  res.json(list)
})

router.post('/catalog/subjects', async (req, res) => {
  const { code, name, description, yearSlug, chapters } = req.body
  if (!code || !name || !yearSlug) return res.status(400).json({ message: 'Missing fields' })
  const s = await CatalogSubject.create({ code: code.toUpperCase(), name, description, yearSlug, chapters: chapters || 0 })
  res.status(201).json(s)
})

router.put('/catalog/subjects/:id', async (req, res) => {
  const s = await CatalogSubject.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!s) return res.status(404).json({ message: 'Not found' })
  res.json(s)
})

router.delete('/catalog/subjects/:id', async (req, res) => {
  await CatalogSubject.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

// Units CRUD (admin)
router.get('/units', async (req, res) => {
  const { yearSlug, subjectCode } = req.query
  const q = {}
  if (yearSlug) q.yearSlug = yearSlug
  if (subjectCode) q.subjectCode = subjectCode
  const list = await Unit.find(q).sort({ subjectCode: 1, unitCode: 1 })
  res.json(list)
})

router.post('/units', async (req, res) => {
  const unit = await Unit.create(req.body)
  res.status(201).json(unit)
})

router.put('/units/:id', async (req, res) => {
  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!unit) return res.status(404).json({ message: 'Not found' })
  res.json(unit)
})

router.delete('/units/:id', async (req, res) => {
  await Unit.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

// Chapters CRUD (admin)
router.get('/chapters', async (req, res) => {
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
});

router.post('/chapters', async (req, res) => {
  const { title, description, subjectId, unitId, yearSlug, subjectCode, topics, resources, difficulty, estimatedTime, tags, order } = req.body;
  
  if (!title || !description || !subjectId || !yearSlug || !subjectCode) {
    return res.status(400).json({ message: 'Missing required fields' });
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
  
  res.status(201).json(chapter);
});

router.put('/chapters/:id', async (req, res) => {
  const update = { ...req.body }
  // Normalize unitId: allow clearing with empty string
  if (Object.prototype.hasOwnProperty.call(update, 'unitId')) {
    if (!update.unitId) update.unitId = null
  }
  if (Object.prototype.hasOwnProperty.call(update, 'subjectCode') && update.subjectCode) {
    update.subjectCode = String(update.subjectCode).toUpperCase()
  }
  const chapter = await Chapter.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
  res.json(chapter);
});

router.delete('/chapters/:id', async (req, res) => {
  await Chapter.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;


