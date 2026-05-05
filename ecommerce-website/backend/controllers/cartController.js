const Cart = require('../models/Cart');
const Product = require('../models/Product');

// return cart for current user (populated)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json({ success: true, data: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// add single item or array of items to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, qty = 1, items } = req.body || {};

    // batch add support
    if (items && Array.isArray(items)) {
      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) cart = new Cart({ user: req.user.id, items: [] });

      for (const it of items) {
        const pid = it.product || it.productId;
        const q = Number(it.qty || 1);
        if (!pid) continue;
        const product = await Product.findById(pid);
        if (!product) continue;

        const idx = cart.items.findIndex(i => i.product.toString() === product._id.toString());
        if (idx >= 0) cart.items[idx].qty = Math.min(product.countInStock, (cart.items[idx].qty || 0) + q);
        else cart.items.push({ product: product._id, qty: q });
      }

      await cart.save();
      const populated = await Cart.findById(cart._id).populate('items.product');
      return res.json({ success: true, data: populated });
    }

    // single-item
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [{ product: product._id, qty }] });
    } else {
      const idx = cart.items.findIndex(i => i.product.toString() === product._id.toString());
      if (idx >= 0) cart.items[idx].qty = Math.min(product.countInStock, (cart.items[idx].qty || 0) + Number(qty));
      else cart.items.push({ product: product._id, qty });
    }
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update quantity of product in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body || {};
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.product.toString() === productId.toString());
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (qty <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].qty = Number(qty);

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// remove a product from cart by id
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId.toString());
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// clean up invalid cart items (items with null product references or deleted products)
exports.cleanCart = async (req, res) => {
  try {
    // Get cart with populated products to check for invalid items
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ success: true, data: { items: [] } });

    // Filter out items where product is null (populate failed) or product was deleted
    const validItems = cart.items
      .filter(item => item.product && item.product._id) // Only keep items with valid populated products
      .map(item => ({
        product: item.product._id, // Store only the ObjectId
        qty: item.qty
      }));

    // Only update if there were invalid items
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
      console.log(`🧹 Cleaned cart: removed ${cart.items.length - validItems.length} invalid items`);
    }

    // Return populated cart
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};