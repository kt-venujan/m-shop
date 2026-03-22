const mongoose = require('mongoose');
const Product = require('./models/Product');

const DB_URL = "mongodb+srv://client1:5555@cluster0.oe4h6ch.mongodb.net/?appName=Cluster0";

const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
  ],
  'Clothing': [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    'https://images.unsplash.com/photo-1434389678232-023fb5c03a3d?w=800&q=80',
    'https://images.unsplash.com/photo-1556821840-a353d264f26b?w=800&q=80'
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=800&q=80',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    'https://images.unsplash.com/photo-1526508082664-51e9bca937e2?w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80'
  ],
  'Default': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ]
};

async function seedImages() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB...");

    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    let updatedCount = 0;
    
    for (let product of products) {
      if (!product.image || product.image.trim() === '') {
        const categoryList = categoryImages[product.category] || categoryImages['Default'];
        // Pick a random image from the category list
        const randomImgUrl = categoryList[Math.floor(Math.random() * categoryList.length)];
        
        product.image = randomImgUrl;
        await product.save();
        console.log(`✅ Assigned image to: ${product.name}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Success! Added images to ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seedImages();
