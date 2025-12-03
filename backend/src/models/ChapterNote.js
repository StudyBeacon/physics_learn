import mongoose from 'mongoose'

const ChapterNoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subjectCode: { type: String, required: true, index: true },
    yearSlug: { type: String, required: true, enum: ['first','second','third','fourth'], index: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true, index: true },
    pdfUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    description: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ChapterNoteSchema.index({ subjectCode: 1, yearSlug: 1, chapterId: 1 })

export default mongoose.model('ChapterNote', ChapterNoteSchema)


