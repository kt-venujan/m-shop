const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');

// Add a new review (Customer action - default to unapproved)
exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        
        // Ensure user hasn't already reviewed this product
        const existingReview = await Review.findOne({ user: req.user.id, product });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        const newReview = new Review({
            user: req.user.id,
            product,
            rating,
            comment,
            isApproved: false 
        });

        await newReview.save();
        res.status(201).json({ message: 'Review submitted successfully. It will be visible once approved by an admin.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get explicitly approved reviews for a specific Product ID (Public storefront action)
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, isApproved: true })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the authenticated user's personal review history
exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('product', 'name image price')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Superadmin - Fetch ALL reviews across the system
exports.getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('product', 'name image')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Superadmin - Force approve/deny state
exports.updateApproval = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        review.isApproved = req.body.isApproved;
        await review.save();
        res.json({ message: `Review successfully ${review.isApproved ? 'approved' : 'rejected'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Superadmin or review owner - Delete review entirely
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Security gate
        if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();
        res.json({ message: 'Review permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
