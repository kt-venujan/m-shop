const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cartRoutes = require('./routes/cartRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const couponRoutes = require('./routes/couponRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://m-shopme.netlify.app" // 👈 Add your Netlify link here!
  ],
  credentials: true
}));

// Connect to Database
connectDB();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);

// Serve images statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Centralized error handler (must be last)
app.use(errorMiddleware);

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server is running on http://localhost:5000");
});

