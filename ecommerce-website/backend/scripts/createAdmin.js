const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@shophub.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'ShopHub Admin';

  try {
    let user = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (user) {
      user.passwordHash = hash;
      user.role = 'admin';
      user.name = name;
      await user.save();
      console.log(`Updated existing admin user: ${email}`);
    } else {
      user = new User({ name, email, passwordHash: hash, role: 'admin' });
      await user.save();
      console.log(`Created new admin user: ${email}`);
    }

    console.log('Admin password set to:', password);
    console.log('You can now login at /admin-login using this password.');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
