const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const {
  helmetConfig,
  generalLimiter,
  mongoSanitizeConfig,
  securityHeaders
} = require('./middleware/security');
const { corsMiddleware } = require('./middleware/cors');
const { errorHandler, notFound } = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(mongoSanitizeConfig);
app.use(securityHeaders);

// Rate limiting
app.use('/api', generalLimiter);

// CORS configuration
app.use(corsMiddleware);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/departments', require('./routes/department'));
app.use('/api/leaves', require('./routes/leave'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/payroll', require('./routes/payslip'));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
