const router = require('express').Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getWishlist);
router.post('/:productId', verifyToken, addToWishlist);
router.delete('/:productId', verifyToken, removeFromWishlist);

module.exports = router;
