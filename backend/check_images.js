const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./models/Product');
const DB_URL = "mongodb+srv://client1:5555@cluster0.oe4h6ch.mongodb.net/?appName=Cluster0";

async function check() {
  await mongoose.connect(DB_URL);
  const products = await Product.find({});
  let out = `Total Products: ${products.length}\n`;
  products.forEach(p => {
    out += `- ${p.name} (${p.category}): ${p.image}\n`;
  });
  fs.writeFileSync('images_utf8.txt', out, 'utf8');
  console.log('Saved to images_utf8.txt');
  process.exit(0);
}
check();
