import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/src/routes/authRoutes.js';
import donationRoutes from '../server/src/routes/donationRoutes.js';
import impactRoutes from '../server/src/routes/impactRoutes.js';
import notificationRoutes from '../server/src/routes/notificationRoutes.js';
import aiRoutes from '../server/src/routes/aiRoutes.js';
import { errorHandler } from '../server/src/middleware/errorHandler.js';
import { getDb } from '../server/src/config/database.js';

dotenv.config();

const app = express();

// Allow all Vercel origins + localhost for dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://food-bridges.vercel.app',
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      )
    ) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now; restrict in production
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Initialize DB
getDb().catch(err => console.error('DB init error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FoodBridge API',
    message: 'FoodBridge Platform is Operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use(errorHandler);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
