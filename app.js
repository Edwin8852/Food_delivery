import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { errorHandler } from './src/shared/error-handling/errorHandler.js';
import { loggerMiddleware } from './src/shared/middleware/logger.middleware.js';

console.log('\n🚀 ===== BACKEND INITIALIZATION =====');
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'Not set (using localhost:5174)'}`);
console.log('====================================\n');

dotenv.config();
const app = express();

// CORS Configuration - Allow only frontend origins (dev and production)
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5175',  // New Vite port
      'http://localhost:5174',  // Vite dev server
      'http://localhost:5173',  // Default Vite dev server
      'http://localhost:3000',  // Optional: for any frontend on 3000
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL   // Production frontend URL from .env
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS BLOCKED: Origin ${origin} not allowed`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// 📂 Static serving
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running ✅',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
