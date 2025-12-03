import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema({
title: { type: String, required: true },
slug: { type: String, required: true, unique: true },
description: String,
subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
});

export default mongoose.model('Year', yearSchema);