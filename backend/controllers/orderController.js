const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { useCoupon } = require('./couponController');
const { sendOrderConfirmation } = require('../services/emailService');

// POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, couponId } = req.body;

        // 1. Validate stock for all items before any changes
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Product "${item.name}" no longer exists.` });
            }
            if (product.stock !== undefined && product.stock !== null && product.stock < item.quantity) {
                return res.status(400).json({
                    message: `"${product.name}" only has ${product.stock} left in stock. Please reduce your quantity.`
                });
            }
        }

        // 2. Decrement stock for each item
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item._id,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }

        // 3. Create the order
        const newOrder = new Order({
            userId: req.user.id,
            items,
            totalAmount,
            shippingAddress,
        });
        const savedOrder = await newOrder.save();

        // 4. Increment coupon usage if one was applied
        if (couponId) {
            await useCoupon(couponId);
        }

        // 5. Send confirmation email (non-blocking)
        const user = await User.findById(req.user.id).select('email name');
        if (user?.email) {
            sendOrderConfirmation({
                toEmail: user.email,
                toName: user.name,
                order: savedOrder,
            });
        }

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

// PUT /api/orders/:id
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: "Only processing orders can be edited" });
        }

        if (req.body.shippingAddress) {
            order.shippingAddress = req.body.shippingAddress;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error updating order" });
    }
};

module.exports = { createOrder, getUserOrders, updateOrder };
