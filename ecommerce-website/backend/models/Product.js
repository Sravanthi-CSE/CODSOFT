const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  // restrict categories to a known set for filtering
  category: {
    type: String,
    enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys & Games'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);