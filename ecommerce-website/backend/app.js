const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const { requireAdmin } = require('./middleware/adminMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Seed endpoint
app.post('/api/seed', requireAdmin, async (req, res) => {
  try {
    const seed = require('./seed/products');
    const Product = require('./models/Product');

    await Product.deleteMany({});
    const created = await Product.insertMany(seed);

    res.json({ seeded: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Serve frontend in production (expects frontend build in ../frontend/dist)
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

module.exports = app;
