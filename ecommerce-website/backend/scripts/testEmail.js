// Test email functionality
const { sendOrderConfirmation, sendPaymentSuccess } = require('../services/emailService');

async function testEmails() {
  console.log('Testing email functionality...');

  // Check if email is configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com' || emailPass === 'your-gmail-app-password') {
    console.log('❌ Email not configured!');
    console.log('Please update your backend/.env file with real Gmail credentials:');
    console.log('EMAIL_USER=your-gmail@gmail.com');
    console.log('EMAIL_PASS=your-16-character-app-password');
    console.log('');
    console.log('To get Gmail app password:');
    console.log('1. Enable 2FA on Gmail');
    console.log('2. Go to https://myaccount.google.com/apppasswords');
    console.log('3. Generate password for "ShopHub"');
    console.log('4. Use that password in EMAIL_PASS');
    return;
  }

  console.log('✅ Email configured. Testing...');

  // Test payment success email
  await sendPaymentSuccess(
    'test@example.com',
    'Test User',
    {
      transactionId: 'test_txn_123',
      amount: 1000,
      method: 'Razorpay'
    }
  );

  // Test order confirmation email
  await sendOrderConfirmation(
    'test@example.com',
    'Test User',
    {
      orderId: 'test_order_123',
      totalAmount: 1000,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India'
      },
      items: [
        {
          name: 'Test Product',
          qty: 2,
          price: 500
        }
      ]
    }
  );

  console.log('Email tests completed. Check your inbox!');
}

testEmails().catch(console.error);