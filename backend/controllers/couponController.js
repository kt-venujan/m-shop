const Coupon = require('../models/Coupon');

// POST /api/coupons/validate  (public — used at checkout)
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required.' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code.' });

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }

    // Check max uses
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit.' });
    }

    // Check minimum order
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required for this coupon.`
      });
    }

    // Calculate discount
    const discount = coupon.discountType === 'percentage'
      ? (cartTotal * coupon.discountValue) / 100
      : coupon.discountValue;

    res.json({
      valid: true,
      couponId: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.min(discount, cartTotal), // never exceed cart total
    });
  } catch (err) {
    res.status(500).json({ message: 'Error validating coupon.' });
  }
};

// POST /api/coupons/use  (internal — called when order is placed)
const useCoupon = async (couponId) => {
  if (!couponId) return;
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
};

// Admin CRUD below ---

// GET /api/coupons (admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coupons.' });
  }
};

// POST /api/coupons (admin)
const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists.' });
    res.status(500).json({ message: 'Error creating coupon.' });
  }
};

// PUT /api/coupons/:id (admin)
const updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating coupon.' });
  }
};

// DELETE /api/coupons/:id (admin)
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting coupon.' });
  }
};

module.exports = { validateCoupon, useCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
