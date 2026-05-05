// Test user orders API
const fetch = require('node-fetch');

async function testUserOrders() {
  try {
    console.log('Testing user orders API...');

    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@shophub.com',
        password: 'Admin@123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.log('Login failed:', loginData);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, got token');

    // Now test user orders endpoint
    const ordersResponse = await fetch('http://localhost:5000/api/orders/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const ordersData = await ordersResponse.json();
    console.log('Orders API Status:', ordersResponse.status);
    console.log('Orders Response:', JSON.stringify(ordersData, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUserOrders();