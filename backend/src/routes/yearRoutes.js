import express from 'express';
import { getAllYears, getYear, createYear } from '../controllers/yearController.js';
import CatalogSubject from '../models/CatalogSubject.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllYears);
router.get('/:slug', getYear);
router.post('/', auth, createYear); // protected

// Public: list catalog subjects for a given year slug
router.get('/:slug/subjects', async (req, res) => {
  const { slug } = req.params;
  const subjects = await CatalogSubject.find({ yearSlug: slug }).sort({ code: 1 });
  res.json(subjects);
});

export default router;