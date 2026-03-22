const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://client1:5555@cluster0.oe4h6ch.mongodb.net/?appName=Cluster0";

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
