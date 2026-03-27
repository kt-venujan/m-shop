const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true }, // e.g. 10 = 10% or Rs. 10
  minOrderAmount: { type: Number, default: 0 },    // minimum cart value to apply
  maxUses: { type: Number, default: null },         // null = unlimited
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },         // null = never expires
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', couponSchema);
