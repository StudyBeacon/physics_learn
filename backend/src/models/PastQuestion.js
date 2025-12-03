import mongoose from 'mongoose'

const PastQuestionSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      default: '' 
    },
    questionContent: { 
      type: String, 
      default: '' 
    },
    questions: [{
      questionNumber: { type: String, required: true },
      content: { type: String, required: true },
      images: [{
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String, default: '' },
        order: { type: Number, default: 0 }
      }]
    }],
    images: [{
      url: { type: String, required: true },
      publicId: { type: String },
      caption: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }],
    subjectCode: { 
      type: String, 
      required: true, 
      index: true 
    },
    yearSlug: { 
      type: String, 
      required: true, 
      enum: ['first', 'second', 'third', 'fourth'], 
      index: true 
    },
    examYear: { 
      type: String, 
      required: true, 
      trim: true 
    },
    examType: { 
      type: String, 
      required: true, 
      enum: ['midterm', 'final', 'internal', 'practical', 'other'],
      default: 'final'
    },
    pdfUrl: { 
      type: String, 
    
    },
    publicId: { 
      type: String 
    },
    fileSize: { 
      type: Number 
    },
    published: { 
      type: Boolean, 
      default: true 
    },
    downloadCount: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
)

// Index for efficient queries
PastQuestionSchema.index({ subjectCode: 1, yearSlug: 1, examYear: 1 })
PastQuestionSchema.index({ examType: 1, examYear: 1 })

export default mongoose.model('PastQuestion', PastQuestionSchema)
