const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { type: String, default: 'Uncategorized' },
  stock: { type: Number, default: 100 },
  image: String,
  modelUrl: String
});

// We "export" it so other files can "import" it
module.exports = mongoose.model('Product', productSchema);