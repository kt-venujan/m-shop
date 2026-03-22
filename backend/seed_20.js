const mongoose = require('mongoose');

const connectDB = require('./config/db');

// Connect to Cloud Database
connectDB();

const Product = require('./models/Product');

const products = [
  {
    name: "Sony Noise Cancelling Headphones",
    price: 35000,
    description: "Industry-leading noise cancellation headphones.",
    category: "Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Apple Watch Series 9",
    price: 95000,
    description: "Advanced health tracking smartwatch.",
    category: "Electronics",
    stock: 30,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Razer DeathAdder Gaming Mouse",
    price: 15000,
    description: "High-precision optical gaming mouse.",
    category: "Electronics",
    stock: 120,
    image: "https://images.unsplash.com/photo-1527814050087-1473cd6d34e9?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Samsung 4K Ultra HD Monitor",
    price: 75000,
    description: "27-inch stunning 4K IPS display.",
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Vintage Pilot Leather Jacket",
    price: 25000,
    description: "Genuine brown leather jacket for men.",
    category: "Clothing",
    stock: 15,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Premium Cotton T-Shirt",
    price: 2500,
    description: "Breathable 100% organic cotton tee.",
    category: "Clothing",
    stock: 200,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Levi's Classic Blue Denim",
    price: 8500,
    description: "Straight-fit timeless denim jeans.",
    category: "Clothing",
    stock: 80,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Nike Air Zoom Pegasus",
    price: 32000,
    description: "Lightweight and responsive running shoes.",
    category: "Clothing",
    stock: 45,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "L'Oreal Vitamin C Serum",
    price: 4500,
    description: "Radiance boosting face serum.",
    category: "Beauty",
    stock: 100,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "MAC Ruby Woo Lipstick",
    price: 3800,
    description: "The iconic matte red lipstick.",
    category: "Beauty",
    stock: 60,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "CeraVe Moisturizing Cream",
    price: 5200,
    description: "Hydrating cream with ceramides for dry skin.",
    category: "Beauty",
    stock: 150,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Chanel Coco Mademoiselle",
    price: 48000,
    description: "Luxury fragrance for women.",
    category: "Beauty",
    stock: 20,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Minimalist Ceramic Vase",
    price: 3500,
    description: "Elegant white vase for home decor.",
    category: "Home & Garden",
    stock: 40,
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf4dd74e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "LED Nordic Desk Lamp",
    price: 6500,
    description: "Adjustable warm light reading lamp.",
    category: "Home & Garden",
    stock: 35,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Velvet Throw Pillow",
    price: 2200,
    description: "Soft decorative throw pillow cover.",
    category: "Home & Garden",
    stock: 85,
    image: "https://images.unsplash.com/photo-1574634534894-89d0235334e6?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Masterpiece Art Books Selection",
    price: 8000,
    description: "A gorgeous coffee table book.",
    category: "Home & Garden",
    stock: 20,
    image: "https://images.unsplash.com/photo-1544604862-23b09228eb38?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Liforme Yoga Mat",
    price: 18000,
    description: "Eco-friendly anti-slip workout mat.",
    category: "Sports",
    stock: 55,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Bowflex SelectTech Dumbbells",
    price: 45000,
    description: "Adjustable dumbbell set for home gym.",
    category: "Sports",
    stock: 12,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69d4fa8e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Wilson Pro Staff Tennis Racket",
    price: 28000,
    description: "Professional grade tennis racket.",
    category: "Sports",
    stock: 25,
    image: "https://images.unsplash.com/photo-1622599511051-16f55a1234d0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "HydroFlask Stainless Steel Bottle",
    price: 4500,
    description: "Insulated 32oz water bottle.",
    category: "Sports",
    stock: 90,
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  try {
    for (const p of products) {
      const newProduct = new Product(p);
      await newProduct.save();
    }
    console.log(`Done seeding ${products.length} new category products!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
