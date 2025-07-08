// Test setup file
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_NAME = 'auth_test_db';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  // Helper to create test user
  createTestUser: async (app, userData = {}) => {
    const defaultUser = {
      email: 'test@example.com',
      password: 'SecurePass123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      ...userData
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(defaultUser);

    return {
      user: response.body.data.user,
      token: response.body.data.token
    };
  },

  // Helper to login test user
  loginTestUser: async (app, email, password) => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({ email, password });

    return {
      user: response.body.data.user,
      token: response.body.data.token
    };
  }
}; 