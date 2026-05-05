const mongoose = require('mongoose');
const Product = require('../models/Product');

const addSampleNewCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const newProducts = [
      {
        name: "The Alchemist",
        description: "A novel by Paulo Coelho about following your dreams",
        price: 399,
        countInStock: 25,
        image: "https://m.media-amazon.com/images/I/71aFt4+OTOL._SY522_.jpg",
        category: "Books"
      },
      {
        name: "LEGO Creator 3-in-1 Deep Sea Creatures",
        description: "Build a crab, octopus or angler fish with this creative LEGO set",
        price: 2499,
        countInStock: 15,
        image: "https://m.media-amazon.com/images/I/81g9+5n7JEL._SX679_.jpg",
        category: "Toys & Games"
      }
    ];

    const created = await Product.insertMany(newProducts);
    console.log(`✅ Added ${created.length} sample products for new categories:`);
    created.forEach(product => {
      console.log(`   📦 ${product.name} (${product.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
    process.exit(1);
  }
};

addSampleNewCategories();