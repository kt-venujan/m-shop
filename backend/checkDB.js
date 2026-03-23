const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

async function check() {
  await connectDB();
  const products = await Product.find({ image: { $regex: /localhost:5000/ } });
  console.log("Products with localhost images:", products.length);
  
  const users = await User.find({ avatar: { $regex: /localhost:5000/ } });
  console.log("Users with localhost avatars:", users.length);

  mongoose.connection.close();
}

check();
