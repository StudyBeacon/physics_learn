import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['note','diagram','video','link'], default: 'note' },
  title: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false })

const unitSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  yearSlug: { type: String, required: true, enum: ['first','second','third','fourth'] },
  unitCode: { type: String, required: true },
  unitName: { type: String, required: true },
  topics: { type: [String], default: [] },
  resources: { type: [resourceSchema], default: [] },
  estimatedTimeMin: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'medium' },
  tags: { type: [String], default: [] },
  published: { type: Boolean, default: true }
}, { timestamps: true })

unitSchema.index({ subjectCode: 1, unitCode: 1 }, { unique: true })

export default mongoose.model('Unit', unitSchema)


