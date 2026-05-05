# Update Razorpay Keys
# 1. Go to https://dashboard.razorpay.com/app/settings/api-keys
# 2. Copy your Test Key ID and Test Key Secret
# 3. Replace the values below and save this file as update-keys.js
# 4. Run: node update-keys.js

const fs = require('fs');
const path = require('path');

// Replace these with your actual Razorpay test keys
const RAZORPAY_KEY_ID = 'YOUR_TEST_KEY_ID_HERE'; // e.g., rzp_test_xxxxxxxxxxxx
const RAZORPAY_KEY_SECRET = 'YOUR_TEST_KEY_SECRET_HERE'; // e.g., xxxxxxxxxxxxxxxx

// Update backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
backendEnv = backendEnv.replace(/RAZORPAY_KEY_ID=.*/, `RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}`);
backendEnv = backendEnv.replace(/RAZORPAY_KEY_SECRET=.*/, `RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}`);
fs.writeFileSync(backendEnvPath, backendEnv);

// Update frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
frontendEnv = frontendEnv.replace(/VITE_RAZORPAY_KEY_ID=.*/, `VITE_RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}`);
fs.writeFileSync(frontendEnvPath, frontendEnv);

console.log('✅ Razorpay keys updated successfully!');
console.log('🔄 Please restart your backend server: cd backend && npm start');
console.log('🔄 Please restart your frontend: cd frontend && npm run dev');