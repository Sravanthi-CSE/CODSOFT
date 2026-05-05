const mongoose = require('mongoose');

let mongo;

module.exports = {
  async setup() {
    const existing = process.env.MONGO_URI;
    if (existing) {
      // Use provided MongoDB (fast path for local testing)
      await mongoose.connect(existing, { useNewUrlParser: true, useUnifiedTopology: true });
      return;
    }

    // Fallback to in-memory server when no MONGO_URI is provided
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongo = await MongoMemoryServer.create();
      const uri = mongo.getUri();
      process.env.MONGO_URI = uri;
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.warn('mongodb-memory-server unavailable or failed; falling back to local MongoDB at mongodb://127.0.0.1:27017/ecommerce-test');
      const fallback = 'mongodb://127.0.0.1:27017/ecommerce-test';
      process.env.MONGO_URI = fallback;
      await mongoose.connect(fallback, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  },
  async teardown() {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  }
};
