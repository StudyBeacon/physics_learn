import Subject from '../models/Subject.js';
import Year from '../models/Year.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const createSubject = asyncHandler(async (req, res) => {
  const { title, content, yearId } = req.body;
  
  // Verify year exists
  const year = await Year.findById(yearId);
  if (!year) {
    throw new AppError('Year not found', 404);
  }

  const subject = new Subject({ title, content, year: yearId });
  await subject.save();
  
  await Year.findByIdAndUpdate(yearId, { $push: { subjects: subject._id } });
  
  res.status(201).json({
    message: 'Subject created successfully',
    subject
  });
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate('year', 'name');
  if (!subject) {
    throw new AppError('Subject not found', 404);
  }
  res.json(subject);
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true, runValidators: true }
  );
  
  if (!subject) {
    throw new AppError('Subject not found', 404);
  }
  
  res.json({
    message: 'Subject updated successfully',
    subject
  });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  
  if (!subject) {
    throw new AppError('Subject not found', 404);
  }
  
  // Remove from year
  await Year.findByIdAndUpdate(subject.year, { $pull: { subjects: subject._id } });
  
  res.json({
    message: 'Subject deleted successfully'
  });
});