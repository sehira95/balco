import mongoose from 'mongoose'

const ProductTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const ProductType = mongoose.models.ProductType || mongoose.model('ProductType', ProductTypeSchema)
