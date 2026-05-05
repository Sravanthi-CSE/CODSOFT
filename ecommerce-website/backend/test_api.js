async function testAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/products?limit=8');
    const data = await response.json();
    console.log('Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();