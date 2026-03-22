const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);

module.exports = router;
