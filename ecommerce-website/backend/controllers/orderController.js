const Order = require('../models/Order');
const Cart = require('../models/Cart');

// create an order from cart or explicit items
exports.createOrder = async (req, res) => {
  try {
    const { useCart = true, items: itemsBody, shippingAddress, paymentMethod, paymentResult } = req.body || {};

    let items = [];
    if (useCart) {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart || !cart.items.length) return res.status(400).json({ success: false, message: 'Cart empty' });
      items = cart.items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
        image: i.product.image
      }));
    } else {
      if (!itemsBody || !itemsBody.length) return res.status(400).json({ success: false, message: 'items required' });
      items = itemsBody;
    }

    const itemsPrice = items.reduce((s, it) => s + (it.price * it.qty), 0);
    const taxPrice = 0;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;


    // Set status and payment fields
    let status = 'Pending';
    let isPaid = false;
    let paidAt = undefined;

    // If payment is successful (simulated for UPI/CARD), mark as paid and set status to Processing
    if (
      paymentMethod === 'UPI' || paymentMethod === 'CARD' ||
      (paymentResult && (paymentResult.status === 'succeeded' || paymentResult.status === 'paid'))
    ) {
      isPaid = true;
      paidAt = new Date();
      status = 'Processing';
    }

    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status,
      isPaid,
      paidAt
    });

    await order.save();

    if (useCart) await Cart.deleteOne({ user: req.user.id });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get single order; accessible by owner or admin
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// admin: list all orders
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// admin: update order status (and optionally mark paid/delivered)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid, paidAt, isDelivered, deliveredAt } = req.body || {};
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (status) order.status = status;
    if (typeof isPaid === 'boolean') order.isPaid = isPaid;
    if (paidAt) order.paidAt = paidAt;
    if (typeof isDelivered === 'boolean') order.isDelivered = isDelivered;
    if (deliveredAt) order.deliveredAt = deliveredAt;

    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};