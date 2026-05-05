const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const orderCtrl = require('../controllers/orderController');

// public / user endpoints
router.post('/', authenticate, orderCtrl.createOrder);
router.get('/my', authenticate, orderCtrl.getUserOrders);
router.get('/:id', authenticate, orderCtrl.getOrderById);

// admin endpoints
router.get('/', requireAdmin, orderCtrl.getAllOrders);
router.put('/:id', requireAdmin, orderCtrl.updateOrderStatus);

module.exports = router;
