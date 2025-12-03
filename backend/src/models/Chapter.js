import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogSubject', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: false }, // Optional - chapters can belong to units or directly to subjects
  yearSlug: { type: String, required: true }, // e.g., 'first', 'second'
  subjectCode: { type: String, required: true }, // e.g., 'PHY101'
  topics: [{ type: String }], // Array of topic strings for deeper breakdown
  questionCount: { type: Number, default: 0 },
  resources: [{
    type: { type: String, enum: ['note', 'diagram', 'video', 'link', 'pdf'], required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' }
  }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedTime: { type: Number, default: 0 }, // in minutes
  tags: [{ type: String }], // e.g., ['Numerical-heavy', 'Conceptual', 'Practical']
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 }, // For ordering chapters within a subject/unit
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient queries
chapterSchema.index({ subjectId: 1, order: 1 });
chapterSchema.index({ yearSlug: 1, subjectCode: 1 });
chapterSchema.index({ unitId: 1 });

export default mongoose.model('Chapter', chapterSchema);
