const mongoose = require('mongoose');
const Product = require('./models/Product');

// Default local DB fallback if env not set
const DB_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-shop';

const newProducts = [
  { name: '100pcs Wire Connectors Terminals', price: 12.99, description: 'Electrical Circuitry & Parts', category: 'Electrical Circuitry & Parts', image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=500&q=80' },
  { name: '128GB High Speed Micro SD Card', price: 19.99, description: 'Micro SD Cards', category: 'Micro SD Cards', image: 'https://images.unsplash.com/photo-1624434207284-727cf0e6ea8e?w=500&q=80' },
  { name: 'Universal Laptop Power Cord Adaptor', price: 15.50, description: 'Power Cord & Adaptors', category: 'Power Cord & Adaptors', image: 'https://images.unsplash.com/photo-1588665796263-dfcb15eeff3c?w=500&q=80' },
  { name: 'Wireless Over-The-Ear Headphones ANC', price: 89.99, description: 'Over-The-Ear Headphones', category: 'Over-The-Ear Headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' },
  { name: 'Smart Parking Sensor Dashboard Gadget', price: 34.00, description: 'Parking Gadgets', category: 'Parking Gadgets', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80' },
  { name: 'Universal Dishwasher Replacement Parts', price: 22.99, description: 'Dishwasher Parts & Accessories', category: 'Dishwasher Parts & Accessories', image: 'https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=500&q=80' },
  { name: 'LED String Lights Seasonal Decor', price: 14.99, description: 'Seasonal & Decorative', category: 'Seasonal & Decorative', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80' },
  { name: 'Festive Bunting Bags Set', price: 9.99, description: 'Bunting Bags', category: 'Bunting Bags', image: 'https://images.unsplash.com/photo-1606214306060-1463943d63b0?w=500&q=80' },
  { name: 'Office Stationery Fasteners Clip Set', price: 5.50, description: 'Stationery Fasteners', category: 'Stationery Fasteners', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80' },
  { name: 'Classic Literature Books Collection', price: 45.00, description: 'Literature', category: 'Literature', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&q=80' },
  { name: 'Winter Warm Down Jacket', price: 120.00, description: 'Down Jackets', category: 'Down Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { name: 'Modern Minimalist Table Lamp text-white', price: 39.99, description: 'Table Lamps', category: 'Table Lamps', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { name: 'Vintage Baseball Hats & Caps', price: 18.00, description: 'Hats & Caps', category: 'Hats & Caps', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80' },
  { name: 'High-Speed Wi-Fi Power Router', price: 65.00, description: 'Power Routers', category: 'Power Routers', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80' },
  { name: 'Retro Popcorn Maker Machine', price: 49.99, description: 'Popcorn Makers', category: 'Popcorn Makers', image: 'https://images.unsplash.com/photo-1572177439369-0268ec3b2354?w=500&q=80' },
  { name: 'Masterpiece Art Books Selection', price: 55.00, description: 'Art Books', category: 'Art Books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80' }
];

mongoose.connect(DB_URL).then(async () => {
  console.log('Connected to DB...');
  let i = 0;
  for (let prod of newProducts) {
    const existing = await Product.findOne({ name: prod.name });
    if (!existing) {
      const p = new Product(prod);
      await p.save();
      console.log(`Saved: ${p.name}`);
      i++;
    }
  }
  console.log(`Done seeding ${i} new category products!`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
