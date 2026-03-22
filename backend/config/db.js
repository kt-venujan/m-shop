const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("📦 Connected to the Cloud Warehouse!");
    } catch (err) {
        console.log("❌ Warehouse connection failed:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
