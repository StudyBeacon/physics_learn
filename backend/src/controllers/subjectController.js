import Subject from '../models/Subject.js';
import Year from '../models/Year.js';

export const createSubject = async (req, res) => {
const { title, content, yearId } = req.body;
const subject = new Subject({ title, content, year: yearId });
await subject.save();
await Year.findByIdAndUpdate(yearId, { $push: { subjects: subject._id } });
res.json(subject);
};


export const getSubject = async (req, res) => {
const subject = await Subject.findById(req.params.id);
if (!subject) return res.status(404).json({ message: 'Subject not found' });
res.json(subject);
};