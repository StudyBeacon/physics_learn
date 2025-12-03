import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'PhysicsLearn' },
    logoUrl: { type: String, default: '' },
    theme: { type: String, enum: ['light','dark','system'], default: 'system' },
    apiKeys: {
      analyticsKey: { type: String, default: '' },
      emailKey: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Setting', SettingSchema)


