(async () => {
  const fetch = global.fetch || require('node-fetch');
  const setupTest = require('./setupTest');
  const app = require('../app');

  try {
    console.log('Setting up DB...');
    await setupTest.setup();

    // start server on ephemeral port
    const server = app.listen(0);
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;
    console.log('Server started on', base);

    // seed products
    console.log('Seeding products...');
    await fetch(`${base}/api/seed`, { method: 'POST' });

    // get products
    const productsRes = await fetch(`${base}/api/products`);
    const products = await productsRes.json();
    const prod = products.data.products[0];

    // register buyer
    console.log('Registering buyer...');
    const email = `runtestbuyer${Math.floor(Math.random()*100000)}@example.com`;
    const regRes = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Runner', email, password: 'Passw0rd!' }) });
    const reg = await regRes.json();
    if (!reg.data || !reg.data.token) throw new Error('Register failed: ' + JSON.stringify(reg));
    const token = reg.data.token;

    // add cart via items array
    console.log('Adding cart items...');
    const cartBody = { items: [{ product: prod._id, qty: 2 }] };
    const addCartRes = await fetch(`${base}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(cartBody) });
    const cart = await addCartRes.json();
    if (!cart.data || !cart.data.items || cart.data.items.length === 0) throw new Error('Cart add failed: ' + JSON.stringify(cart));

    // create order from cart
    console.log('Creating order from cart...');
    const orderRes = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ useCart: true, shippingAddress: { line1: '1 Test', city: 'City', postalCode: '12345', country: 'US' }, paymentMethod: 'COD' }) });
    const order = await orderRes.json();
    if (!order.data || !order.data._id) throw new Error('Order creation from cart failed: ' + JSON.stringify(order));

    // ensure cart cleared
    const cartAfter = await (await fetch(`${base}/api/cart`, { headers: { 'Authorization': 'Bearer ' + token } })).json();
    if (cartAfter.data && cartAfter.data.items && cartAfter.data.items.length !== 0) throw new Error('Cart not cleared after order: ' + JSON.stringify(cartAfter));

    // create paid order explicit items
    console.log('Creating paid explicit order...');
    const items = [{ product: prod._id, name: prod.name, qty: 1, price: prod.price, image: prod.image }];
    const paidRes = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ useCart: false, items, shippingAddress: { line1: '1 Paid', city: 'Paytown', postalCode: '00001', country: 'US' }, paymentMethod: 'CARD', paymentResult: { id: 'pi_test', status: 'paid', update_time: new Date().toISOString(), email_address: email } }) });
    const paidOrder = await paidRes.json();
    if (!paidOrder.data || !paidOrder.data.isPaid) throw new Error('Paid order not marked as paid: ' + JSON.stringify(paidOrder));

    console.log('All tests passed');

    await setupTest.teardown();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Tests failed:', err);
    try { await setupTest.teardown(); } catch (e) {}
    process.exit(1);
  }
})();
