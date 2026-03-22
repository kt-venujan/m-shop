const Cart = require('../models/Cart');

// Get user's cart
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.json([]);
    }
    // Map items so that the frontend sees the exact identically shaped product objects with a quantity field
    const mappedItems = cart.items
      .filter(item => item.product != null) // Avoid deleted products breaking the cart
      .map(item => ({
        ...item.product.toObject(),
        quantity: item.quantity
      }));
    
    res.json(mappedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [{ product: productId, quantity }] });
      await cart.save();
      return res.status(201).json(cart);
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Item not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// Sync local storage cart to database on login
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body; // array of { productId, quantity }
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Merge items
    items.forEach(localItem => {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === localItem.productId);
      if (itemIndex > -1) {
        // Assume user wants the max of what was added or local quantity, or just add them. Let's add them.
        cart.items[itemIndex].quantity += localItem.quantity;
      } else {
        cart.items.push({ product: localItem.productId, quantity: localItem.quantity });
      }
    });

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error syncing cart' });
  }
};
