const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./src/routes/auth.routes');
const inquiryRoutes = require('./src/routes/inquiry.routes');
const { notFoundHandler, errorHandler } = require('./src/middleware/error.middleware');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS Configuration supporting single or comma-separated origins
const rawFrontendUrls = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = rawFrontendUrls
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Always allow localhost for local dev if not explicitly forbidden
if (!allowedOrigins.includes('http://localhost:5173')) {
  allowedOrigins.push('http://localhost:5173');
}
if (!allowedOrigins.includes('http://127.0.0.1:5173')) {
  allowedOrigins.push('http://127.0.0.1:5173');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    console.warn(`Blocked by CORS: Origin ${origin} not in [${allowedOrigins.join(', ')}]`);
    return callback(new Error(`CORS error: Origin ${origin} is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'EdTech CRM & Inquiry System API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 EdTech CRM API server running on port ${PORT}`);
    console.log(`🌐 Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
    console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
