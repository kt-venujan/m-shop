const fs = require('fs');
const path = require('path');

const files = [
  'e:\\mern-shop\\frontend\\src\\pages\\admin\\AdminSettings.jsx',
  'e:\\mern-shop\\frontend\\src\\pages\\admin\\AdminReviews.jsx',
  'e:\\mern-shop\\frontend\\src\\pages\\admin\\AdminProducts.jsx',
  'e:\\mern-shop\\frontend\\src\\components\\ProductList.jsx',
  'e:\\mern-shop\\frontend\\src\\components\\ProductDetails.jsx',
  'e:\\mern-shop\\frontend\\src\\components\\Account.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.startsWith\('\/'\)/g, ".startsWith('/uploads')");
  fs.writeFileSync(file, content);
  console.log(`Fixed ${path.basename(file)}`);
});
