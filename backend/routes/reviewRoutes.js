const express = require('express');
const router = express.Router();
const {
    createReview,
    getProductReviews,
    getMyReviews,
    getAllReviewsAdmin,
    updateApproval,
    deleteReview
} = require('../controllers/reviewController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public
router.get('/product/:productId', getProductReviews);

// Protected (Customers)
router.post('/', verifyToken, createReview);
router.get('/my', verifyToken, getMyReviews);

// Protected (Admin only)
router.get('/admin', verifyAdmin, getAllReviewsAdmin);
router.put('/:id/approve', verifyAdmin, updateApproval);

// Protected (Admin or Owner)
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
