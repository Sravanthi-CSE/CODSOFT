(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shophub.com', password: 'Admin@123' })
    });
    const data = await res.json().catch(() => ({}));
    console.log('STATUS', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
})();
