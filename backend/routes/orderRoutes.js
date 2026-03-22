const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, getUserOrders, updateOrder } = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.put('/:id', verifyToken, updateOrder);

module.exports = router;
