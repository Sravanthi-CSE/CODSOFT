const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect DB and start server only when running as the entrypoint
if (require.main === module) {
  connectDB().then(() => {
    const app = require('./app');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  }).catch(err => {
    console.error('Failed to connect DB:', err);
    process.exit(1);
  });
} else {
  // when required (e.g., tests), export app without starting server
  module.exports = require('./app');
}
