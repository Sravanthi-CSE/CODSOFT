const request = require('supertest');
const mongoose = require('mongoose');
const setupTest = require('./setupTest');
const app = require('../app');
const Product = require('../models/Product');
const seed = require('../seed/products');

beforeAll(async () => {
  await setupTest.setup();
  await Product.deleteMany({});
  await Product.insertMany(seed);
});

afterAll(async () => {
  await setupTest.teardown();
});

describe('Orders API', () => {
  let token;
  test('registers a buyer', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Order Buyer', email: 'orderbuyer@example.com', password: 'Password1!' });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  test('creates paid order with explicit items', async () => {
    const products = await Product.find({}).limit(1);
    const items = [{ product: products[0]._id.toString(), name: products[0].name, qty: 1, price: products[0].price, image: products[0].image }];
    const body = { useCart: false, items, shippingAddress: { line1: '1 Paid', city: 'Paytown', postalCode: '00001', country: 'US' }, paymentMethod: 'stripe', paymentResult: { id: 'pi_test', status: 'succeeded', update_time: new Date().toISOString(), email_address: 'orderbuyer@example.com' } };
    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(body);
    expect(res.statusCode).toBe(201);
    expect(res.body.isPaid).toBe(true);
    expect(res.body.items.length).toBe(1);
  });
});
