const mongoose = require('mongoose');
const Product = require('./models/product');

const DB_URL = "mongodb+srv://client1:5555@cluster0.oe4h6ch.mongodb.net/?appName=Cluster0";

const seedProducts = [
  // Electronics
  { name: 'Quantum Pro Laptop', price: 1299.99, description: 'High-performance laptop for professionals with 32GB RAM and 1TB SSD.', category: 'Electronics', stock: 15 },
  { name: 'Sonic Wireless Headphones', price: 299.00, description: 'Noise-canceling over-ear headphones with 40-hour battery life.', category: 'Electronics', stock: 40 },
  
  // Clothing
  { name: 'Classic Denim Jacket', price: 89.50, description: 'Vintage wash denim jacket with a comfortable, relaxed fit.', category: 'Clothing', stock: 100 },
  { name: 'Performance Running Shirt', price: 34.99, description: 'Moisture-wicking, breathable athletic shirt for long runs.', category: 'Clothing', stock: 200 },
  
  // Home & Garden
  { name: 'Ceramic Pour-Over Coffee Maker', price: 45.00, description: 'Elegant ceramic pour-over set for the perfect morning brew.', category: 'Home & Garden', stock: 35 },
  { name: 'Indoor Bonsai Tree', price: 65.00, description: 'Beautifully shaped mature Juniper bonsai with a decorative ceramic pot.', category: 'Home & Garden', stock: 10 },
  
  // Beauty
  { name: 'Hydrating Facial Serum', price: 55.00, description: 'Vitamin C and Hyaluronic acid serum for glowing skin.', category: 'Beauty', stock: 85 },
  { name: 'Aromatherapy Bath Bombs (Set of 6)', price: 28.00, description: 'Handcrafted essential oil bath bombs for ultimate relaxation.', category: 'Beauty', stock: 150 },
  
  // Sports
  { name: 'Pro Yoga Mat', price: 79.00, description: 'Non-slip, eco-friendly cork yoga mat with alignment lines.', category: 'Sports', stock: 60 },
  { name: 'Adjustable Dumbbell Set', price: 199.00, description: 'Space-saving dumbbells adjustable from 5 to 52.5 lbs each.', category: 'Sports', stock: 20 },
];

async function runSeed() {
  try {
    await mongoose.connect(DB_URL);
    console.log("📦 Connected to Database.");
    
    // Clear existing products so we don't have duplicates on consecutive runs
    await Product.deleteMany({});
    console.log("🧹 Cleared existing products.");
    
    // Insert new seeded products
    await Product.insertMany(seedProducts);
    console.log("✅ Successfully seeded the database!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();
