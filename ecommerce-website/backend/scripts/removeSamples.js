const mongoose = require('mongoose');
const Product = require('../models/Product');

const removeSamples = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    await Product.deleteMany({ name: { $in: ['Sample T-Shirt', 'Wireless Headphones', 'Coffee Mug'] } });
    console.log('Sample products removed');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

removeSamples();