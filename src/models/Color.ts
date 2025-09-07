import mongoose from 'mongoose'

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hexCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const Color = mongoose.models.Color || mongoose.model('Color', ColorSchema)
