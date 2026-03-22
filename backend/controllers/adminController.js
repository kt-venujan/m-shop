const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const products = await Product.countDocuments();
        const orders = await Order.countDocuments();
        const users = await User.countDocuments();
        const allOrders = await Order.find();
        const revenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        res.json({ products, orders, users, revenue });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching all orders" });
    }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating order status" });
    }
};

// POST /api/admin/products
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ message: "Error creating product" });
    }
};

// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating product" });
    }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

module.exports = { getStats, getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct, getAllUsers };
