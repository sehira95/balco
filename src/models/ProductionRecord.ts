import mongoose from 'mongoose'

const ProductionRecordSchema = new mongoose.Schema({
  productType: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductType', required: true },
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true },
  shift: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
  operator: { type: String, required: true },
  notes: { type: String },
  quality: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// İndeksler performans için
ProductionRecordSchema.index({ date: -1 })
ProductionRecordSchema.index({ productType: 1, color: 1 })
ProductionRecordSchema.index({ createdAt: -1 })

export const ProductionRecord = mongoose.models.ProductionRecord || mongoose.model('ProductionRecord', ProductionRecordSchema)
