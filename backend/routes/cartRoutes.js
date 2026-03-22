const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, cartController.getUserCart);
router.post('/add', verifyToken, cartController.addToCart);
router.put('/update', verifyToken, cartController.updateQuantity);
router.delete('/clear', verifyToken, cartController.clearCart);
router.delete('/remove/:productId', verifyToken, cartController.removeFromCart);
router.post('/sync', verifyToken, cartController.syncCart);

module.exports = router;
