const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// All admin routes require an admin user
router.use(requireAdmin);

// GET /api/admin/users - list users
router.get('/users', async (req, res) => {
  try {
    // support pagination: ?page=1&limit=20
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    // explicitly project only safe fields to avoid leaking password/passwordHash or other sensitive data
    const users = await User.find()
      .select('name email role createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: { users, page, pages: Math.ceil(total / limit), total } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/admin/users/:id/role - change a user's role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body || {};
    if (!role || !['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    // Use findByIdAndUpdate to avoid running save-time validators (some legacy users may lack passwordHash)
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Role updated', data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/admin/users/:id - update user details (name, email)
router.patch('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (Object.keys(update).length === 0) return res.status(400).json({ success: false, message: 'No update fields provided' });
    // Use findByIdAndUpdate to avoid triggering save validators on legacy docs
    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/admin/analytics - extended stats for charts
router.get('/analytics', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    // total revenue
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

    // revenue by day for last 30 days
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 30);

    const revenueByDay = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: past, $lte: today } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$paidAt' }
          },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // order status distribution
    const statusCountsAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusCounts = {};
    statusCountsAgg.forEach(s => { statusCounts[s._id] = s.count; });

    // products by category
    const catAgg = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const productsByCategory = {};
    catAgg.forEach(c => { productsByCategory[c._id] = c.count; });

    res.json({
      success: true,
      data: {
        users,
        products,
        orders,
        revenue,
        revenueByDay,
        statusCounts,
        productsByCategory
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
