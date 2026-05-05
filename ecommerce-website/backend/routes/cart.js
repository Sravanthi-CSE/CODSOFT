const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, cartCtrl.getCart);
router.post('/', authenticate, cartCtrl.addToCart);
router.put('/', authenticate, cartCtrl.updateCartItem);
router.delete('/:productId', authenticate, cartCtrl.removeFromCart);
router.post('/clean', authenticate, cartCtrl.cleanCart);

module.exports = router;
