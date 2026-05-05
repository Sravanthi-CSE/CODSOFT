const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { requireAdmin } = require('../middleware/adminMiddleware');

// public endpoints
router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getProductById);

// admin protected routes
router.post('/', requireAdmin, productCtrl.createProduct);
router.put('/:id', requireAdmin, productCtrl.updateProduct);
router.delete('/:id', requireAdmin, productCtrl.deleteProduct);

module.exports = router;
