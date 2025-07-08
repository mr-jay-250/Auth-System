const { ValidationError, DatabaseError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message: `Validation Error: ${message}`,
      statusCode: 400,
      type: 'ValidationError'
    };
  }

  // Sequelize database errors
  if (err instanceof DatabaseError) {
    error = {
      message: 'Database operation failed',
      statusCode: 500,
      type: 'DatabaseError'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      statusCode: 401,
      type: 'JWTError'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      statusCode: 401,
      type: 'JWTExpiredError'
    };
  }

  // Duplicate key error
  if (err.code === '23505') {
    error = {
      message: 'Duplicate field value entered',
      statusCode: 400,
      type: 'DuplicateError'
    };
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = {
      message: 'Resource not found',
      statusCode: 400,
      type: 'CastError'
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      type: error.type || 'ServerError',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler }; 