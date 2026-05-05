const { authenticate } = require('./authMiddleware');

function requireAdmin(req, res, next) {
  // first ensure user is authenticated
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access required' });
  });
}

module.exports = { requireAdmin };