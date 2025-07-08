# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. User Registration

**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "type": "ValidationError",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address",
        "value": "invalid-email"
      }
    ]
  }
}
```

### 3. User Login

**POST** `/api/auth/signin`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "type": "AuthenticationError"
  }
}
```

### 4. Get User Profile

**GET** `/api/auth/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Access token is required",
    "type": "AuthenticationError"
  }
}
```

### 5. Update User Profile

**PUT** `/api/auth/profile`

Update user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-01-01"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "dateOfBirth": "1990-01-01",
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 6. Request Password Change OTP

**POST** `/api/auth/request-password-change-otp`

Request an OTP to change password (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email for password change"
}
```

**Email Error (500):**
```json
{
  "success": false,
  "error": {
    "message": "Failed to send OTP email. Please try again.",
    "type": "EmailError"
  }
}
```

### 7. Change Password with OTP

**POST** `/api/auth/change-password-with-otp`

Change password using OTP (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired OTP",
    "type": "ValidationError"
  }
}
```

### 8. Get Current User (Alternative)

**GET** `/api/auth/me`

Get current user's information (alternative to /profile).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "isActive": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 9. Logout

**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "type": "ValidationError",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address",
        "value": "invalid-email"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "message": "Access token is required",
    "type": "AuthenticationError"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### JWT Error (401)
```json
{
  "success": false,
  "error": {
    "message": "Invalid token",
    "type": "JWTError"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "message": "Server Error",
    "type": "ServerError"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 requests per window (configurable)
- **Headers**: Rate limit information is included in response headers

## CORS

The API is configured to allow all origins (`*`) with the following settings:

- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With
- **Credentials**: true

## Testing

### Demo Users

The database includes demo users for testing:

| Email | Password | Status |
|-------|----------|--------|
| admin@example.com | DemoPass123 | Verified |
| user@example.com | DemoPass123 | Verified |
| test@example.com | DemoPass123 | Active |

### Example cURL Commands

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "firstName": "New",
    "lastName": "User",
    "dateOfBirth": "1990-01-01"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "DemoPass123"
  }'
```

**Get profile (with token):**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update profile:**
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "dateOfBirth": "1990-01-01"
  }'
```

**Request password change OTP:**
```bash
curl -X POST http://localhost:3000/api/auth/request-password-change-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Change password with OTP:**
```bash
curl -X POST http://localhost:3000/api/auth/change-password-with-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "newPassword": "NewSecurePass123"
  }'
```

## Security Notes

1. **Password Requirements**: Minimum 6 characters
2. **JWT Tokens**: Expire after 24 hours (configurable)
3. **Rate Limiting**: Prevents abuse and brute force attacks
4. **Input Validation**: All inputs are validated and sanitized
5. **CORS**: Configured for cross-origin requests
6. **Security Headers**: Implemented with helmet middleware
7. **OTP Expiration**: OTP tokens expire after 10 minutes
8. **Password Reset Tokens**: Expire after 1 hour
9. **Email Verification**: OTP-based password changes require email verification 