const User = require('../models/User');

// GET /api/wishlist - get current user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// POST /api/wishlist/:productId - add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating wishlist' });
  }
};

// DELETE /api/wishlist/:productId - remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { wishlist: req.params.productId }
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating wishlist' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
