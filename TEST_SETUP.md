# Test Setup Documentation

## Overview

This project includes comprehensive API tests that are designed to run in isolation without interfering with your production or development database.

## Test Configuration

### Database Isolation

Tests use a separate test database (`auth_test_db`) to ensure they don't affect your actual data:

- **Test Database**: `auth_test_db` (configured in `config/database.js`)
- **Test Environment**: `NODE_ENV=test`
- **Database Cleanup**: Tests automatically clean up after each test

### Test Files

- **Main Test File**: `test/api.test.js` - Comprehensive API endpoint tests
- **Test Setup**: `test/setup.js` - Global test configuration
- **Jest Config**: `jest.config.js` - Jest testing framework configuration

## Running Tests

### Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running
2. **Test Database**: Create the test database (if not exists):
   ```bash
   createdb auth_test_db
   ```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Reset test database (if needed)
npm run db:test:reset
```

### Test Environment Variables

Tests automatically set these environment variables:
- `NODE_ENV=test`
- `JWT_SECRET=test-secret-key`
- `DB_NAME=auth_test_db`

## Test Coverage

The test suite covers:

### Authentication Endpoints
- ✅ User Registration (`POST /api/auth/signup`)
- ✅ User Login (`POST /api/auth/signin`)
- ✅ Get Profile (`GET /api/auth/profile`)
- ✅ Update Profile (`PUT /api/auth/profile`)
- ✅ Request Password Change OTP (`POST /api/auth/request-password-change-otp`)
- ✅ Change Password with OTP (`POST /api/auth/change-password-with-otp`)
- ✅ Forgot Password (`POST /api/auth/forgot-password`)
- ✅ Reset Password (`POST /api/auth/reset-password`)
- ✅ Health Check (`GET /health`)

### Test Scenarios
- ✅ Valid requests and responses
- ✅ Invalid input validation
- ✅ Authentication errors
- ✅ Authorization errors
- ✅ Database errors
- ✅ Rate limiting (basic)

## Test Database Safety

### Isolation Features

1. **Separate Database**: Tests use `auth_test_db` instead of your main database
2. **Automatic Cleanup**: Each test cleans up after itself
3. **Force Sync**: Test database is recreated for each test run
4. **Environment Isolation**: Tests run in `NODE_ENV=test`

### Database Operations

```javascript
// Before all tests
await sequelize.sync({ force: true }); // Recreates tables

// After each test
await sequelize.truncate({ cascade: true }); // Cleans data

// After all tests
await sequelize.close(); // Closes connection
```

## Test Data

### Demo Users (for manual testing)

| Email | Password | Status |
|-------|----------|--------|
| admin@example.com | DemoPass123 | Verified |
| user@example.com | DemoPass123 | Verified |
| test@example.com | DemoPass123 | Active |

### Test User Creation

Tests automatically create test users with these defaults:
```javascript
{
  email: 'test@example.com',
  password: 'SecurePass123',
  firstName: 'Test',
  lastName: 'User',
  dateOfBirth: '1990-01-01'
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Ensure PostgreSQL is running
   sudo service postgresql start
   
   # Create test database
   createdb auth_test_db
   ```

2. **Permission Denied**
   ```bash
   # Check PostgreSQL user permissions
   psql -U postgres -c "CREATE DATABASE auth_test_db;"
   ```

3. **Test Timeout**
   - Tests have a 10-second timeout
   - Increase in `jest.config.js` if needed

4. **Email Service Errors**
   - Email tests are mocked in test environment
   - No actual emails are sent during tests

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

### Individual Test Files

Run specific test files:
```bash
npm test -- test/api.test.js
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
        env:
          DB_HOST: localhost
          DB_USER: postgres
          DB_PASSWORD: postgres
          DB_NAME: auth_test_db
```

## Best Practices

1. **Never test against production database**
2. **Always use test environment variables**
3. **Clean up test data after each test**
4. **Mock external services (email, etc.)**
5. **Use descriptive test names**
6. **Test both success and failure scenarios**

## Test Utilities

### Global Test Helpers

```javascript
// Create test user
const { user, token } = await testUtils.createTestUser(app, {
  email: 'custom@example.com',
  firstName: 'Custom'
});

// Login test user
const { user, token } = await testUtils.loginTestUser(app, 'user@example.com', 'password');
```

### Test Database Helpers

```javascript
// Clean database
await sequelize.truncate({ cascade: true });

// Close connection
await sequelize.close();
```

## Security Notes

- Test JWT tokens use a test secret key
- Test database is isolated from production
- No real emails are sent during tests
- Test data is automatically cleaned up
- Rate limiting is tested but doesn't affect real users 