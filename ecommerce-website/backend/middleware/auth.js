// legacy wrapper - delegates to new authMiddleware
const { authenticate, authorizeRole } = require('./authMiddleware');

// keep same export shape so existing imports don't crash
module.exports = authenticate;
module.exports.authorizeRole = authorizeRole;