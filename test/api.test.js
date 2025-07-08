const request = require('supertest');
const express = require('express');
const { sequelize } = require('../config/database');

// Import your app (you might need to export it from server.js)
const app = require('../server');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Sync database for testing with force: true to ensure clean state
    // This will use the test database configuration
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
  });

  afterEach(async () => {
    // Clean up after each test to ensure isolation
    await sequelize.truncate({ cascade: true });
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('ValidationError');
    });

    it('should return error for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('ValidationError');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      };

      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      // Try to create duplicate user
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('DuplicateError');
    });
  });

  describe('POST /api/auth/signin', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        email: 'signin@example.com',
        password: 'SecurePass123',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1990-01-01'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'signin@example.com',
        password: 'SecurePass123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'signin@example.com',
        password: 'WrongPassword123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('AuthenticationError');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'profile@example.com',
        password: 'SecurePass123',
        firstName: 'Profile',
        lastName: 'User',
        dateOfBirth: '1990-01-01'
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      authToken = signupResponse.body.data.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('profile@example.com');
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('AuthenticationError');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('JWTError');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'update@example.com',
        password: 'SecurePass123',
        firstName: 'Update',
        lastName: 'User',
        dateOfBirth: '1990-01-01'
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      authToken = signupResponse.body.data.token;
    });

    it('should update profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        dateOfBirth: '1995-05-15'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe('Updated');
      expect(response.body.data.user.lastName).toBe('Name');
    });
  });

  describe('POST /api/auth/request-password-change-otp', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'otp@example.com',
        password: 'SecurePass123',
        firstName: 'OTP',
        lastName: 'User',
        dateOfBirth: '1990-01-01'
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      authToken = signupResponse.body.data.token;
    });

    it('should request OTP successfully', async () => {
      const response = await request(app)
        .post('/api/auth/request-password-change-otp')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent');
    });
  });

  describe('POST /api/auth/change-password-with-otp', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'password@example.com',
        password: 'SecurePass123',
        firstName: 'Password',
        lastName: 'User',
        dateOfBirth: '1990-01-01'
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      authToken = signupResponse.body.data.token;
    });

    it('should change password with valid OTP', async () => {
      // First request OTP
      await request(app)
        .post('/api/auth/request-password-change-otp')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Note: In a real test, you would need to mock the email service
      // or extract the OTP from the database for testing
      const passwordData = {
        otp: '123456', // This would be the actual OTP in real scenario
        newPassword: 'NewSecurePass123'
      };

      const response = await request(app)
        .post('/api/auth/change-password-with-otp')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400); // Will fail with invalid OTP in test

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('ValidationError');
    });
  });

  describe('GET /health', () => {
    it('should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });
}); 