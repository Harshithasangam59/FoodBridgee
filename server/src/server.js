import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDb } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Express JSON body parser
app.use(express.json({ limit: '10mb' }));

// Initialize DB on server start
getDb()
  .then(() => {
    console.log('⚡ Connected to SQLite Database (FoodBridge)');
  })
  .catch((err) => {
    console.error('❌ Failed to initialize SQLite Database:', err);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FoodBridge API Server',
    message: 'FoodBridge Platform Backend Server is Operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Centralized error handler
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 FoodBridge Server running on http://localhost:${PORT}`);
});
