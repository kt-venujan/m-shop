const Product = require('../models/Product');

// GET /api/products
const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

module.exports = { getAllProducts };
