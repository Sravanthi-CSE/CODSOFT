const request = require('supertest');
const mongoose = require('mongoose');
const setupTest = require('./setupTest');
const app = require('../app');
const Product = require('../models/Product');
const seed = require('../seed/products');

beforeAll(async () => {
  await setupTest.setup();
  // seed products
  await Product.deleteMany({});
  await Product.insertMany(seed);
});

afterAll(async () => {
  await setupTest.teardown();
});

describe('Cart API', () => {
  let token;
  test('registers a user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Test Buyer', email: 'testbuyer@example.com', password: 'Password1!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('adds items via items array and returns populated cart', async () => {
    const products = await Product.find({}).limit(1);
    const body = { items: [{ product: products[0]._id.toString(), qty: 2 }] };
    const res = await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send(body);
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].qty).toBe(2);
  });

  test('creates order from cart and clears cart', async () => {
    const orderRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send({ useCart: true, shippingAddress: { line1: '1 Test', city: 'City', postalCode: '12345', country: 'US' }, paymentMethod: 'stripe' });
    expect(orderRes.statusCode).toBe(201);
    expect(orderRes.body.itemsPrice).toBeDefined();

    // cart should be cleared
    const cartRes = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(cartRes.statusCode).toBe(200);
    expect(cartRes.body.items.length).toBe(0);
  });
});
