import mongoose from 'mongoose'

const MaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true }, // PDF or external link
    subjectCode: { type: String, required: true, index: true }, // e.g., PHY101
    yearSlug: { type: String, required: true, enum: ['first','second','third','fourth'] },
    type: { type: String, enum: ['pdf','link'], default: 'pdf' },
    category: { type: String, enum: ['chapter','syllabus','questionBank'], default: 'chapter', index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Material', MaterialSchema)


