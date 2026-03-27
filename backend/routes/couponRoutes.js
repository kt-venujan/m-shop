const router = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');

// Public — validate a coupon code at checkout (must be logged in)
router.post('/validate', verifyToken, validateCoupon);

// Admin only — manage coupons
router.get('/', verifyAdmin, getAllCoupons);
router.post('/', verifyAdmin, createCoupon);
router.put('/:id', verifyAdmin, updateCoupon);
router.delete('/:id', verifyAdmin, deleteCoupon);

module.exports = router;
