const router = require('express').Router();
const { verifyAdmin } = require('../middleware/auth');
const {
    getStats,
    getAllOrders,
    updateOrderStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllUsers
} = require('../controllers/adminController');

// Dashboard stats
router.get('/stats', verifyAdmin, getStats);

// Order management
router.get('/orders', verifyAdmin, getAllOrders);
router.put('/orders/:id/status', verifyAdmin, updateOrderStatus);

// Product management
router.post('/products', verifyAdmin, createProduct);
router.put('/products/:id', verifyAdmin, updateProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);

// User management
router.get('/users', verifyAdmin, getAllUsers);

module.exports = router;
