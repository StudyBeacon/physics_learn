import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
title: { type: String, required: true },
content: String, // could be URL, markdown, or HTML
year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' }
});

export default mongoose.model('Subject', subjectSchema);