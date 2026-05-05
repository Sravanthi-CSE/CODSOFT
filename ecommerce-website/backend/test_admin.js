const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function testAdminLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');

    const user = await User.findOne({ email: 'admin@shophub.com' });
    if (!user) {
      console.log('Admin user not found');
      return;
    }

    console.log('User found:', user.email, user.role);

    const password = 'Admin@123';
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', isValid);

    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testAdminLogin();