const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendOrderConfirmation, sendPaymentSuccess } = require('../services/emailService');

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razor = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }) : null;

// Create Stripe PaymentIntent
router.post('/stripe/create-payment-intent', authenticate, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe not configured' });
    const { amount, currency = 'inr' } = req.body;
    if (amount == null) return res.status(400).json({ message: 'amount required' });

    // Frontend sends amount in main currency units (e.g. 10.50 for $10.50). Convert to smallest unit.
    const amountNumber = Number(amount) || 0;
    const amountInt = Math.round(amountNumber * 100);

    const intent = await stripe.paymentIntents.create({ amount: amountInt, currency });
    res.json({ clientSecret: intent.client_secret, id: intent.id, amount: amountInt, currency: intent.currency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Stripe Checkout Session (simple redirect flow)
router.post('/stripe/create-checkout-session', authenticate, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe not configured' });
    const { items, success_url, cancel_url } = req.body || {};
    if (!items || !items.length) return res.status(400).json({ message: 'items required' });

    const line_items = items.map(i => ({ price_data: { currency: 'usd', product_data: { name: i.name }, unit_amount: Math.round(i.price * 100) }, quantity: i.qty }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || `${process.env.CLIENT_URL || ''}/#/payment-success`,
      cancel_url: cancel_url || `${process.env.CLIENT_URL || ''}/#/payment-failure`,
      metadata: { user: req.user.id }
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe webhook endpoint (expects raw body to verify signature) -- configure endpoint separately
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) return res.status(204).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types as needed
  console.log('Received stripe event', event.type);
  res.json({ received: true });
});

// Create Razorpay order
router.post('/razorpay/create-order', authenticate, async (req, res) => {
  try {
    if (!razor) return res.status(500).json({ message: 'Razorpay not configured' });
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'amount required' });

    const options = { amount: Math.round(amount), currency, receipt: receipt || `rcpt_${Date.now()}` };
    const order = await razor.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Razorpay payment signature
router.post('/razorpay/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ message: 'missing fields' });

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated = crypto.createHmac('sha256', keySecret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    const valid = generated === razorpay_signature;

    if (valid && orderId) {
      // Update order status to paid
      const order = await Order.findById(orderId).populate('user', 'name email');
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'paid',
          email_address: req.user.email
        };
        await order.save();

        // Send payment success email
        await sendPaymentSuccess(
          req.user.email,
          req.user.name,
          {
            transactionId: razorpay_payment_id,
            amount: order.totalPrice,
            method: 'Razorpay'
          }
        );

        // Send order confirmation email
        await sendOrderConfirmation(
          req.user.email,
          req.user.name,
          {
            orderId: order._id,
            totalAmount: order.totalPrice,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            shippingAddress: order.shippingAddress,
            items: order.items
          }
        );
      }
    }

    res.json({ valid, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
