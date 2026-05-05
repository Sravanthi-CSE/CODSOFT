const Product = require('../models/Product');

// fetch a list of products with optional filtering/query parameters
exports.getAllProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Math.min(100, Number(limit)));

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json({ success: true, data: { products, page: pageNum, pages: Math.ceil(total / perPage), total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get one product by id
exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// create a product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, image, category } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category || !['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys & Games'].includes(category)) {
      return res.status(400).json({ success: false, message: 'Valid category is required' });
    }
    if (price === undefined || price < 0) {
      return res.status(400).json({ success: false, message: 'Valid price is required' });
    }
    if (countInStock === undefined || countInStock < 0) {
      return res.status(400).json({ success: false, message: 'Valid stock count is required' });
    }

    // Image URL validation (optional but if provided, should be valid)
    if (image && image.trim()) {
      try {
        new URL(image.trim());
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid image URL format' });
      }
    }

    const product = new Product({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      countInStock: Number(countInStock),
      image: image ? image.trim() : '',
      category
    });

    const created = await product.save();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    // Validation for provided fields
    if (updates.name && !updates.name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name cannot be empty' });
    }
    if (updates.category && !['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys & Games'].includes(updates.category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }
    if (updates.price !== undefined && updates.price < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative' });
    }
    if (updates.countInStock !== undefined && updates.countInStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock count cannot be negative' });
    }

    // Image URL validation (optional but if provided, should be valid)
    if (updates.image && updates.image.trim()) {
      try {
        new URL(updates.image.trim());
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid image URL format' });
      }
    }

    // Trim string fields
    if (updates.name) updates.name = updates.name.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.image) updates.image = updates.image.trim();

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};