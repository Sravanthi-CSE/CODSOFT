require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];
  const name = process.argv[3] || 'Admin';
  const password = process.argv[4] || null;

  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email> [name] [password]');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in environment. Copy .env.example to .env and set MONGO_URI');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log('Promoted existing user to admin:', email);
    process.exit(0);
  }

  if (!password) {
    console.error('User not found. Provide a password to create a new admin: node scripts/makeAdmin.js <email> <name> <password>');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  user = new User({ name, email, passwordHash: hashed, role: 'admin' });
  await user.save();
  console.log('Created admin user:', email);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(2); });
