const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

// user signup
router.post('/register', authCtrl.signup);

// general login (user or admin)
router.post('/login', authCtrl.login);

// admin-specific login endpoint
router.post('/admin/login', authCtrl.adminLogin);

module.exports = router;
