import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    published: { type: Boolean, default: false },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)


