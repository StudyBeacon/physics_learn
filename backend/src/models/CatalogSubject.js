import mongoose from 'mongoose'

const CatalogSubjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    yearSlug: { type: String, required: true, enum: ['first','second','third','fourth'], index: true },
    chapters: { type: Number, default: 0 },
    syllabus: { type: String, default: '' }, // Text-based syllabus content
  },
  { timestamps: true }
)

CatalogSubjectSchema.index({ yearSlug: 1, code: 1 }, { unique: true })

export default mongoose.model('CatalogSubject', CatalogSubjectSchema)


