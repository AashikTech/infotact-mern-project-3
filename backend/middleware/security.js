const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

/**
 * Security middleware configuration
 */

// Helmet configuration for HTTP security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// General rate limiter (100 requests per 15 minutes)
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again after 15 minutes'
);

// Auth rate limiter (5 requests per 15 minutes)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts, please try again after 15 minutes'
);

// Strict rate limiter (3 requests per hour)
const strictLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3,
  'Too many requests, please try again after an hour'
);

// CORS configuration
const corsConfig = cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count']
});

// MongoDB sanitization
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_'
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

module.exports = {
  helmetConfig,
  generalLimiter,
  authLimiter,
  strictLimiter,
  corsConfig,
  mongoSanitizeConfig,
  securityHeaders
};
