const mongoose = require('mongoose');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const restoreProducts = async (backupFile) => {
  try {
    if (!backupFile) {
      console.log('❌ Please provide a backup file path');
      console.log('Usage: node scripts/restoreProducts.js <backup-file.json>');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const filepath = path.resolve(backupFile);
    if (!fs.existsSync(filepath)) {
      console.log('❌ Backup file not found:', filepath);
      process.exit(1);
    }

    const backupData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    console.log(`📁 Loading backup from: ${backupData.timestamp}`);
    console.log(`📊 Products to restore: ${backupData.products.length}`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Restore products
    const restoredProducts = await Product.insertMany(backupData.products);
    console.log(`✅ Successfully restored ${restoredProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    process.exit(1);
  }
};

// Get backup file from command line argument
const backupFile = process.argv[2];
restoreProducts(backupFile);