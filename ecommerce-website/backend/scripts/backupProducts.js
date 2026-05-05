const mongoose = require('mongoose');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const backupProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const products = await Product.find({}).sort({ createdAt: -1 });
    const backupData = {
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    };

    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const filename = `products_backup_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(backupDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Products backup saved to: ${filepath}`);
    console.log(`📊 Total products backed up: ${products.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    process.exit(1);
  }
};

backupProducts();