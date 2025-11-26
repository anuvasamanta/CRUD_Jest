const mongoose = require('mongoose');

// Increase timeout for all tests
jest.setTimeout(30000);

// Setup before all tests
beforeAll(async () => {
  // Connect to a test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/crud_api_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});