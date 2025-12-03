import Year from '../models/Year.js';
import Subject from '../models/Subject.js';

export const getAllYears = async (req, res) => {
const years = await Year.find().populate('subjects');
res.json(years);
};


export const getYear = async (req, res) => {
const year = await Year.findOne({ slug: req.params.slug }).populate('subjects');
if (!year) return res.status(404).json({ message: 'Year not found' });
res.json(year);
};


export const createYear = async (req, res) => {
const { title, slug, description } = req.body;
const year = new Year({ title, slug, description });
await year.save();
res.json(year);
};