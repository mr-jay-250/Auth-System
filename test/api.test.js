const request = require('supertest');
const express = require('express');
const { sequelize } = require('../config/database');

// Import your app (you might need to export it from server.js)
const app = require('../server');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
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

  describe('PUT /api/auth/update-password', () => {
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

    it('should update password successfully with valid current password', async () => {
      const passwordData = {
        currentPassword: 'SecurePass123',
        newPassword: 'NewSecurePass123'
      };

      const response = await request(app)
        .put('/api/auth/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password updated successfully');
    });

    it('should return error with incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword123',
        newPassword: 'NewSecurePass123'
      };

      const response = await request(app)
        .put('/api/auth/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('ValidationError');
    });

    it('should return error with weak new password', async () => {
      const passwordData = {
        currentPassword: 'SecurePass123',
        newPassword: 'weak'
      };

      const response = await request(app)
        .put('/api/auth/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('ValidationError');
    });

    it('should return error without authentication', async () => {
      const passwordData = {
        currentPassword: 'SecurePass123',
        newPassword: 'NewSecurePass123'
      };

      const response = await request(app)
        .put('/api/auth/update-password')
        .send(passwordData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('AuthenticationError');
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