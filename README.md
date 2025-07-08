# Authentication Backend API

A secure Node.js authentication API with JWT tokens, OTP-based password changes via email, and comprehensive user management.

## Features

- **User Registration & Login** with JWT tokens
- **Profile Management** - view and update user information
- **OTP-based Password Change** - secure password updates via email OTP
- **Email Integration** - actual email sending with nodemailer
- **Rate Limiting** - protection against abuse
- **Input Validation** - comprehensive request validation
- **Error Handling** - consistent error responses
- **Modern Frontend** - React with Material-UI components

## API Endpoints

### Public Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login

### Protected Routes
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/request-password-change-otp` - Request OTP for password change
- `POST /api/auth/change-password-with-otp` - Change password with OTP
- `POST /api/auth/logout` - Logout user

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=your_database_url_here
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=24h
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   FRONTEND_URL=http://localhost:3001
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Configure Email (see EMAIL_SETUP.md):**
   - Set up Gmail app password or other email service
   - Add email credentials to `.env` file

4. **Start the server:**
   ```bash
   npm start
   ```

## Frontend Testing

A modern React frontend with Material-UI is included for testing all API endpoints.

### Features:
- **Modern UI** - Clean, professional design with Material-UI
- **Responsive Design** - Works on desktop and mobile
- **Loading States** - Visual feedback during API calls
- **Error Handling** - Clear error messages and validation
- **Step-by-step Password Change** - Intuitive OTP flow

### To start the frontend:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3001`

## Demo Users

The database includes demo users for testing:
- Email: `admin@example.com`, Password: `DemoPass123`
- Email: `user@example.com`, Password: `DemoPass123`

## Password Change Flow

1. **Request OTP** - User clicks "Request OTP" button
2. **Email Sent** - System sends 6-digit OTP to user's email
3. **Enter OTP** - User enters OTP and new password
4. **Password Updated** - System verifies OTP and updates password

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Email Configuration

See `EMAIL_SETUP.md` for detailed email configuration instructions.

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **OTP Verification** - 6-digit codes for password changes
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Sanitized inputs
- **CORS Protection** - Cross-origin request handling
- **Security Headers** - Helmet middleware

## Development

```bash
# Start backend
npm start

```

## Testing

1. Register a new account or use demo users
2. Login to access protected routes
3. Test password change with OTP
4. Test profile management

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  date_of_birth DATE NOT NULL,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `auth_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS origin | `*` |

## Development

### Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed       # Run seeders
npm run db:reset      # Reset database
```

### Project Structure

```
auth-be/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling
│   └── validation.js       # Input validation
├── models/
│   └── User.js             # User model
├── routes/
│   └── auth.js             # Authentication routes
├── migrations/              # Database migrations
├── seeders/                # Database seeders
├── server.js               # Main server file
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong `JWT_SECRET`
4. Configure proper CORS origins
5. Set up SSL/TLS
6. Configure logging
7. Set up monitoring
8. Configure backup strategy

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the repository or contact the development team.

## Note

There is currently no frontend; this is a backend-only API project. 