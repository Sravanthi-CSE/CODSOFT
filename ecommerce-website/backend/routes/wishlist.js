const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const wishlistCtrl = require('../controllers/wishlistController');

// all routes require login
router.use(authenticate);

router.get('/', wishlistCtrl.getWishlist);
router.post('/:id', wishlistCtrl.addToWishlist);
router.delete('/:id', wishlistCtrl.removeFromWishlist);

module.exports = router;