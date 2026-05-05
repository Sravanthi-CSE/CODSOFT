const mongoose = require('mongoose');
const Product = require('../models/Product');

const listProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const products = await Product.find({}).sort({ category: 1, name: 1 });

    console.log('\n📦 PRODUCTS INVENTORY');
    console.log('='.repeat(80));

    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    let totalProducts = 0;
    let totalValue = 0;

    Object.keys(categories).sort().forEach(category => {
      console.log(`\n🗂️ ${category} (${categories[category].length} products)`);
      console.log('-'.repeat(40));

      categories[category].forEach(product => {
        console.log(`  📦 ${product.name}`);
        console.log(`     💰 ₹${product.price} | 📦 ${product.countInStock} in stock`);
        if (product.image) {
          console.log(`     🖼️  Image: ${product.image}`);
        }
        console.log(`     🆔 ${product._id}`);
        console.log('');
        totalProducts++;
        totalValue += product.price * product.countInStock;
      });
    });

    console.log('='.repeat(80));
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   Total Inventory Value: ₹${totalValue.toFixed(2)}`);
    console.log(`   Categories: ${Object.keys(categories).length}`);
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing products:', error);
    process.exit(1);
  }
};

listProducts();