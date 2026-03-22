const Order = require('../models/Order');

// POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const newOrder = new Order({
            userId: req.user.id,
            items,
            totalAmount,
            shippingAddress
        });
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error creating order" });
    }
};

// GET /api/orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

module.exports = { createOrder, getUserOrders };
